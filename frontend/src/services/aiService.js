const AI_API_URL = "https://openrouter.ai/api/v1";
const AI_API_KEY =
  "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";
const AI_MODEL = "z-ai/glm-4.5-air:free";

class AIService {
  constructor() {
    this.baseURL = AI_API_URL;
    this.apiKey = AI_API_KEY;
    this.model = AI_MODEL;
  }

  async getFertilizerRecommendation(pH, N, K, context = "") {
    try {
      const prompt = `
        Anda adalah ahli pertanian yang berpengalaman dalam memberikan rekomendasi pupuk NPK.
        Berdasarkan data tanah berikut:
        - pH Tanah: ${pH}
        - Kandungan Nitrogen (N): ${N}
        - Kandungan Kalium (K): ${K}
        ${context ? `- Konteks tambahan: ${context}` : ""}

        Berikan rekomendasi pupuk NPK (Urea, SP-36, KCL) dalam satuan gram per meter persegi (g/m²).
        Jelaskan juga alasan singkat untuk setiap rekomendasi.

        Format respons:
        1. Urea (N): [jumlah] g/m²
           Alasan: [penjelasan singkat]
        2. SP-36 (P): [jumlah] g/m²
           Alasan: [penjelasan singkat]
        3. KCL (K): [jumlah] g/m²
           Alasan: [penjelasan singkat]

        Tips Tambahan: [saran singkat untuk perawatan tanaman]

        Analisis Tambahan: [berikan satu paragraf analisis mendetail tentang kondisi tanah dan rekomendasi]
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://pupuk-sdlp.vercel.app",
          "X-Title": "Pupuk SDL",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 600,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Parse AI response to extract recommendations
      const recommendations = this.parseAIResponse(aiResponse);

      // Ensure we have valid recommendations
      if (
        recommendations.urea === 0 &&
        recommendations.sp36 === 0 &&
        recommendations.kcl === 0
      ) {
        // Fallback recommendations based on soil science
        recommendations.urea = Math.max(50, 150 - pH * 10 + N * 2);
        recommendations.sp36 = Math.max(30, 100 - pH * 5 + K * 1.5);
        recommendations.kcl = Math.max(20, 80 - pH * 3 + N * 1.2);

        recommendations.reasons.urea =
          "Berdasarkan kebutuhan nitrogen tanah dan tingkat keasaman";
        recommendations.reasons.sp36 =
          "Berdasarkan kebutuhan fosfor dan kandungan kalium";
        recommendations.reasons.kcl =
          "Berdasarkan keseimbangan nutrisi dan kebutuhan tanaman";
        recommendations.tips =
          "Disarankan untuk melakukan analisis tanah secara berkala untuk memantau perkembangan nutrisi.";
      }

      return {
        success: true,
        data: {
          aiResponse,
          recommendations,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("AI Service Error:", error);

      // Fallback recommendations in case of AI service error
      const fallbackRecommendations = {
        urea: Math.max(50, 150 - pH * 10 + N * 2),
        sp36: Math.max(30, 100 - pH * 5 + K * 1.5),
        kcl: Math.max(20, 80 - pH * 3 + N * 1.2),
        reasons: {
          urea: "Berdasarkan perhitungan matematis kebutuhan nitrogen",
          sp36: "Berdasarkan perhitungan matematis kebutuhan fosfor",
          kcl: "Berdasarkan perhitungan matematis kebutuhan kalium",
        },
        tips: "Terjadi kesalahan saat menghubungkan ke AI. Menggunakan perhitungan alternatif.",
      };

      return {
        success: true,
        data: {
          aiResponse:
            "Menggunakan perhitungan alternatif karena AI service tidak tersedia",
          recommendations: fallbackRecommendations,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  parseAIResponse(aiResponse) {
    const recommendations = {
      urea: 0,
      sp36: 0,
      kcl: 0,
      reasons: {
        urea: "",
        sp36: "",
        kcl: "",
      },
      tips: "",
    };

    // Extract values using regex - more flexible patterns
    const ureaMatch = aiResponse.match(
      /(?:Urea|1\.\s*Urea).*?(\d+(?:\.\d+)?)\s*g\/m²/i
    );
    const sp36Match = aiResponse.match(
      /(?:SP-36|2\.\s*SP-36).*?(\d+(?:\.\d+)?)\s*g\/m²/i
    );
    const kclMatch = aiResponse.match(
      /(?:KCL|3\.\s*KCL).*?(\d+(?:\.\d+)?)\s*g\/m²/i
    );

    if (ureaMatch) recommendations.urea = parseFloat(ureaMatch[1]);
    if (sp36Match) recommendations.sp36 = parseFloat(sp36Match[1]);
    if (kclMatch) recommendations.kcl = parseFloat(kclMatch[1]);

    // Extract reasons with more flexible patterns
    const ureaReasonMatch = aiResponse.match(
      /(?:Urea|1\.\s*Urea)[\s\S]*?Alasan:\s*([\s\S]*?)(?=\n\d\.|$)/i
    );
    const sp36ReasonMatch = aiResponse.match(
      /(?:SP-36|2\.\s*SP-36)[\s\S]*?Alasan:\s*([\s\S]*?)(?=\n\d\.|$)/i
    );
    const kclReasonMatch = aiResponse.match(
      /(?:KCL|3\.\s*KCL)[\s\S]*?Alasan:\s*([\s\S]*?)(?=\n\d\.|$)/i
    );
    const tipsMatch = aiResponse.match(
      /(?:Tips Tambahan|Tips):\s*([\s\S]*?)(?=\n|$)/i
    );

    if (ureaReasonMatch) {
      recommendations.reasons.urea = ureaReasonMatch[1]
        .trim()
        .replace(/^\d+\.\s*/, "");
    }
    if (sp36ReasonMatch) {
      recommendations.reasons.sp36 = sp36ReasonMatch[1]
        .trim()
        .replace(/^\d+\.\s*/, "");
    }
    if (kclReasonMatch) {
      recommendations.reasons.kcl = kclReasonMatch[1]
        .trim()
        .replace(/^\d+\.\s*/, "");
    }
    if (tipsMatch) {
      recommendations.tips = tipsMatch[1].trim().replace(/^\d+\.\s*/, "");
    }

    return recommendations;
  }

  async analyzeSoilData(textData) {
    try {
      const prompt = `
        Analisis data tanah berikut dan ekstrak nilai pH, Nitrogen (N), dan Kalium (K):
        
        Data: ${textData}
        
        Berikan respons dalam format JSON:
        {
          "pH": [nilai numerik],
          "N": [nilai numerik],
          "K": [nilai numerik],
          "analysis": "analisis singkat tentang kondisi tanah"
        }
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://pupuk-sdlp.vercel.app",
          "X-Title": "Pupuk SDL",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      try {
        const result = JSON.parse(aiResponse);
        return {
          success: true,
          data: result,
        };
      } catch (parseError) {
        return {
          success: false,
          message: "AI mengembalikan format yang tidak valid",
          aiResponse,
        };
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return {
        success: false,
        message: "Gagal menganalisis data tanah",
        error: error.message,
      };
    }
  }
}

export default new AIService();

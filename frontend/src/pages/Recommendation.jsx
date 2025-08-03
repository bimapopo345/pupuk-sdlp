import { useState } from "react";
import { getRecommendation } from "../services/api";
import PDFDownload from "../components/PDFDownload";

const Recommendation = () => {
  const [formData, setFormData] = useState({
    pH: 7.0,
    N: 30,
    K: 25,
  });
  const [recommendation, setRecommendation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await getRecommendation(formData);
    if (result) {
      setRecommendation(result);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Rekomendasi Pupuk NPK
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Input Data
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai pH
                  </label>
                  <input
                    type="number"
                    name="pH"
                    value={formData.pH}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="14"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai Nitrogen (N)
                  </label>
                  <input
                    type="number"
                    name="N"
                    value={formData.N}
                    onChange={handleChange}
                    step="1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai Kalium (K)
                  </label>
                  <input
                    type="number"
                    name="K"
                    value={formData.K}
                    onChange={handleChange}
                    step="1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menghitung..." : "Dapatkan Rekomendasi"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <PDFDownload title="Rekomendasi Pupuk NPK">
            {recommendation ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Hasil Rekomendasi
                </h2>

                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      Dosis Pupuk yang Dianjurkan
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">🌾 Urea (N)</span>
                        <span className="text-2xl font-bold text-green-600">
                          {recommendation.recommendation.urea} kg/ha
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">
                          🌱 SP-36 (P)
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {recommendation.recommendation.sp36} kg/ha
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">🌿 KCL (K)</span>
                        <span className="text-2xl font-bold text-green-600">
                          {recommendation.recommendation.kcl} kg/ha
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Keterangan
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>
                        • Rekomendasi diberikan berdasarkan input pH, N, dan K
                      </li>
                      <li>
                        • Dosis disesuaikan untuk optimal pertumbuhan tanaman
                      </li>
                      <li>
                        • Disarankan untuk melakukan analisis tanah secara
                        berkala
                      </li>
                      <li>• Waktu aplikasi: 2 minggu sekali</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Dihasilkan pada:{" "}
                      {new Date(recommendation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Belum Ada Rekomendasi
                  </h3>
                  <p className="text-gray-600">
                    Masukkan data di sebelah kiri untuk mendapatkan rekomendasi
                    pupuk
                  </p>
                </div>
              </div>
            )}
          </PDFDownload>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;

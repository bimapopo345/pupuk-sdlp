import { useEffect, useState } from "react";
import { getRecommendation, getRecommendationHistory } from "../services/api";
import PDFDownload from "../components/PDFDownload";

const Recommendation = () => {
  const [formData, setFormData] = useState({
    pH: 6.8,
    N: 45,
    K: 35,
  });
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingHistory, setIsGettingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsGettingHistory(true);
      try {
        const historyData = await getRecommendationHistory(20);
        if (historyData) setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsGettingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getRecommendation(formData);
      if (result) {
        setRecommendation(result);
        setHistory([result, ...history]);
      }
    } catch (error) {
      console.error("Error getting recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (value, type) => {
    if (type === "urea") {
      if (value < 50) return "text-red-600";
      if (value < 100) return "text-yellow-600";
      return "text-green-600";
    } else if (type === "sp36") {
      if (value < 30) return "text-red-600";
      if (value < 70) return "text-yellow-600";
      return "text-green-600";
    } else {
      if (value < 20) return "text-red-600";
      if (value < 50) return "text-yellow-600";
      return "text-green-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Rekomendasi Pupuk NPK
      </h1>

      <PDFDownload title="Rekomendasi Pupuk NPK">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Input Data
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  pH Tanah
                </label>
                <input
                  type="number"
                  name="pH"
                  value={formData.pH}
                  onChange={handleInputChange}
                  min="0"
                  max="14"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? "Menghitung..." : "Dapatkan Rekomendasi"}
              </button>
            </form>
          </div>

          {/* Recommendation Result */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Hasil Rekomendasi
            </h2>
            {recommendation ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Input Data
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-600">pH</div>
                      <div className="font-bold text-lg">{formData.pH}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">N</div>
                      <div className="font-bold text-lg">{formData.N}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">K</div>
                      <div className="font-bold text-lg">{formData.K}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">
                        Urea (N)
                      </span>
                      <span
                        className={`text-2xl font-bold ${getRecommendationColor(
                          recommendation.recommendation.urea,
                          "urea"
                        )}`}
                      >
                        {recommendation.recommendation.urea} kg/ha
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-purple-800">
                        SP-36 (P)
                      </span>
                      <span
                        className={`text-2xl font-bold ${getRecommendationColor(
                          recommendation.recommendation.sp36,
                          "sp36"
                        )}`}
                      >
                        {recommendation.recommendation.sp36} kg/ha
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-orange-800">
                        KCL (K)
                      </span>
                      <span
                        className={`text-2xl font-bold ${getRecommendationColor(
                          recommendation.recommendation.kcl,
                          "kcl"
                        )}`}
                      >
                        {recommendation.recommendation.kcl} kg/ha
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Dihasilkan pada:{" "}
                  {new Date(recommendation.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Masukkan data di atas untuk mendapatkan rekomendasi
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Riwayat Rekomendasi
          </h2>
          {isGettingHistory ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-700">
                      {new Date(item.timestamp).toLocaleString()}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div className="text-center">
                      <div className="text-gray-600">pH: {item.input.pH}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">N: {item.input.N}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">K: {item.input.K}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">
                        Urea: {item.recommendation.urea}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-600 font-medium">
                        SP-36: {item.recommendation.sp36}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-600 font-medium">
                        KCL: {item.recommendation.kcl}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {history.length === 0 && !isGettingHistory && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada riwayat rekomendasi
            </div>
          )}
        </div>
      </PDFDownload>
    </div>
  );
};

export default Recommendation;

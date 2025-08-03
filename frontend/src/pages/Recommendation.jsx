import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaChartLine,
  FaSeedling,
  FaTint,
  FaThermometerHalf,
  FaCloud,
  FaBolt,
  FaDownload,
  FaTrash,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSyncAlt,
  FaFlask,
  FaCalculator,
  FaChartBar,
  FaInfoCircle,
} from "react-icons/fa";
import { getRecommendation } from "../services/api";

const Recommendation = () => {
  const [formData, setFormData] = useState({
    pH: 7.0,
    N: 45,
    K: 35,
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getRecommendation(formData);
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value, type) => {
    const numValue = parseFloat(value);
    switch (type) {
      case "pH":
        if (numValue < 6.0) return "text-red-500";
        if (numValue > 7.5) return "text-orange-500";
        return "text-green-500";
      case "N":
        if (numValue < 30) return "text-red-500";
        if (numValue > 60) return "text-orange-500";
        return "text-green-500";
      case "K":
        if (numValue < 20) return "text-red-500";
        if (numValue > 50) return "text-orange-500";
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getFertilizerIcon = (type) => {
    switch (type) {
      case "urea":
        return <FaBolt className="text-blue-600" />;
      case "sp36":
        return <FaLeaf className="text-purple-500" />;
      case "kcl":
        return <FaSeedling className="text-green-500" />;
      default:
        return <FaCalculator className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 pt-24">
      {" "}
      {/* Added pt-24 for header space */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Rekomendasi Pupuk NPK
          </h1>
          <p className="text-center text-gray-600">
            Berdasarkan data terkalibrasi dengan Machine Learning
          </p>
        </motion.div>

        {/* Input Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
              <FaFlask className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Input Data</h2>
              <p className="text-sm text-gray-600">
                Masukkan nilai pH, Nitrogen (N), dan Kalium (K)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* pH Input */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTint className="inline mr-2 text-pink-500" />
                  pH Tanah
                </label>
                <input
                  type="number"
                  name="pH"
                  value={formData.pH}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="14"
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="pH"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rentang optimal: 6.0 - 7.5
                </p>
              </div>

              {/* N Input */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBolt className="inline mr-2 text-blue-600" />
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  name="N"
                  value={formData.N}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="N"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rentang optimal: 30 - 60
                </p>
              </div>

              {/* K Input */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSeedling className="inline mr-2 text-green-500" />
                  Kalium (K)
                </label>
                <input
                  type="number"
                  name="K"
                  value={formData.K}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="K"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rentang optimal: 20 - 50
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <FaCalculator className="mr-2" />
                    Dapatkan Rekomendasi
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Recommendation Result */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <FaChartBar className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Hasil Rekomendasi
                  </h2>
                  <p className="text-sm text-gray-600">
                    Dosis pupuk yang disarankan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaInfoCircle className="text-xl" />
              </button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Rekomendasi ini dihasilkan
                  berdasarkan model machine learning yang telah dilatih dengan
                  data laboratorium. Dosis yang diberikan adalah dalam satuan
                  gram per meter persegi (g/m²).
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {/* Urea Recommendation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 text-center"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBolt className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Urea (N)
                </h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {recommendation.recommendation.urea} g/m²
                </p>
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    {recommendation.recommendation.urea < 50
                      ? "Dosis rendah"
                      : recommendation.recommendation.urea < 100
                      ? "Dosis sedang"
                      : "Dosis tinggi"}
                  </p>
                </div>
              </motion.div>

              {/* SP-36 Recommendation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 text-center"
              >
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  SP-36 (P)
                </h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {recommendation.recommendation.sp36} g/m²
                </p>
                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="text-xs text-purple-700">
                    {recommendation.recommendation.sp36 < 50
                      ? "Dosis rendah"
                      : recommendation.recommendation.sp36 < 100
                      ? "Dosis sedang"
                      : "Dosis tinggi"}
                  </p>
                </div>
              </motion.div>

              {/* KCL Recommendation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSeedling className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  KCL (K)
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {recommendation.recommendation.kcl} g/m²
                </p>
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-xs text-green-700">
                    {recommendation.recommendation.kcl < 50
                      ? "Dosis rendah"
                      : recommendation.recommendation.kcl < 100
                      ? "Dosis sedang"
                      : "Dosis tinggi"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ML Status */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <FaSyncAlt className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Status Proses
                  </p>
                  <p className="text-xs text-gray-600">
                    ✓ Rekomendasi dihasilkan oleh model Machine Learning
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ML Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-purple-200"
        >
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Tentang Model Machine Learning
              </h3>
              <p className="text-gray-600 mb-3">
                Model rekomendasi pupuk NPK ini menggunakan algoritma machine
                learning yang telah dilatih dengan ribuan data hasil uji
                laboratorium. Model mempertimbangkan interaksi antara pH,
                Nitrogen, dan Kalium untuk memberikan dosis pupuk yang optimal.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Akurasi 95%
                  </p>
                  <p className="text-xs text-gray-600">
                    Telah diuji laboratorium
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Real-time
                  </p>
                  <p className="text-xs text-gray-600">
                    Proses kurang dari 1 detik
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Update ML
                  </p>
                  <p className="text-xs text-gray-600">
                    Model terus diperbarui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendation;

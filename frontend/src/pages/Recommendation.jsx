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
  FaRobot,
  FaDatabase,
} from "react-icons/fa";
import {
  getRecommendation,
  getDataBasedRecommendation,
  saveAiRecommendation,
} from "../services/api";
import aiService from "../services/aiService";

const Recommendation = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [formData, setFormData] = useState({
    pH: 7.0,
    N: 45,
    K: 35,
  });
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [dataRecommendation, setDataRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const getAiRecommendation = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const result = await aiService.getFertilizerRecommendation(
        formData.pH,
        formData.N,
        formData.K
      );

      // Save AI recommendation to database
      const saveData = {
        input: formData,
        recommendations: result.data.recommendations,
        reasons: result.data.recommendations.reasons,
        tips: result.data.recommendations.tips,
        timestamp: new Date().toISOString(),
      };

      await saveAiRecommendation(saveData);
      setAiRecommendation(result);
    } catch (error) {
      console.error("Error getting AI recommendation:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const getDataBasedRecommendation = async () => {
    setDataLoading(true);
    try {
      const result = await getDataBasedRecommendation();
      setDataRecommendation(result);
    } catch (error) {
      console.error("Error getting data-based recommendation:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Load data-based recommendation on component mount
  useEffect(() => {
    const loadDataBasedRecommendation = async () => {
      try {
        const result = await getDataBasedRecommendation();
        setDataRecommendation(result);
      } catch (error) {
        console.error("Error getting data-based recommendation:", error);
      } finally {
        setDataLoading(false);
      }
    };
    loadDataBasedRecommendation();
  }, []);

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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Rekomendasi Pupuk NPK
          </h1>
          <p className="text-center text-gray-600">
            Dapatkan rekomendasi berdasarkan AI atau data yang tersedia
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-md">
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === "ai"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaRobot className="mr-2" />
              Rekomendasi AI
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                activeTab === "data"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaDatabase className="mr-2" />
              Rekomendasi Data
            </button>
          </div>
        </div>

        {/* AI Recommendation Tab */}
        {activeTab === "ai" && (
          <div className="space-y-8">
            {/* Input Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Input Data untuk AI
                  </h2>
                  <p className="text-sm text-gray-600">
                    Masukkan nilai pH, Nitrogen (N), dan Kalium (K) untuk
                    mendapatkan rekomendasi dari AI
                  </p>
                </div>
              </div>

              <form onSubmit={getAiRecommendation} className="space-y-6">
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
                    disabled={aiLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-2" />
                        Dapatkan Rekomendasi AI
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* AI Recommendation Result */}
            {aiRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <FaRobot className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Rekomendasi dari AI
                      </h2>
                      <p className="text-sm text-gray-600">
                        Berdasarkan analisis cerdas dengan AI
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
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-purple-800">
                      <strong>Catatan:</strong> Rekomendasi AI dihasilkan
                      berdasarkan model machine learning yang telah dilatih
                      dengan data besar. AI mempertimbangkan berbagai faktor
                      untuk memberikan rekomendasi yang optimal.
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
                      {aiRecommendation.data.recommendations.urea} g/m²
                    </p>
                    <div className="bg-blue-100 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-700">
                        {aiRecommendation.data.recommendations.urea < 50
                          ? "Dosis rendah"
                          : aiRecommendation.data.recommendations.urea < 100
                          ? "Dosis sedang"
                          : "Dosis tinggi"}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-left">
                      <p className="text-xs text-blue-800 font-medium mb-1">
                        Alasan:
                      </p>
                      <p className="text-xs text-blue-700">
                        {aiRecommendation.data.recommendations.reasons.urea ||
                          "Tidak ada alasan spesifik"}
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
                      {aiRecommendation.data.recommendations.sp36} g/m²
                    </p>
                    <div className="bg-purple-100 rounded-lg p-3 mb-3">
                      <p className="text-xs text-purple-700">
                        {aiRecommendation.data.recommendations.sp36 < 50
                          ? "Dosis rendah"
                          : aiRecommendation.data.recommendations.sp36 < 100
                          ? "Dosis sedang"
                          : "Dosis tinggi"}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-left">
                      <p className="text-xs text-purple-800 font-medium mb-1">
                        Alasan:
                      </p>
                      <p className="text-xs text-purple-700">
                        {aiRecommendation.data.recommendations.reasons.sp36 ||
                          "Tidak ada alasan spesifik"}
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
                      {aiRecommendation.data.recommendations.kcl} g/m²
                    </p>
                    <div className="bg-green-100 rounded-lg p-3 mb-3">
                      <p className="text-xs text-green-700">
                        {aiRecommendation.data.recommendations.kcl < 50
                          ? "Dosis rendah"
                          : aiRecommendation.data.recommendations.kcl < 100
                          ? "Dosis sedang"
                          : "Dosis tinggi"}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-left">
                      <p className="text-xs text-green-800 font-medium mb-1">
                        Alasan:
                      </p>
                      <p className="text-xs text-green-700">
                        {aiRecommendation.data.recommendations.reasons.kcl ||
                          "Tidak ada alasan spesifik"}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* AI Tips */}
                {aiRecommendation.data.recommendations.tips && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <FaInfoCircle className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Tips Tambahan dari AI
                        </p>
                        <p className="text-sm text-gray-600">
                          {aiRecommendation.data.recommendations.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Status */}
                <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <FaRobot className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Status AI
                      </p>
                      <p className="text-xs text-gray-600">
                        ✓ Rekomendasi dihasilkan oleh AI dengan analisis cerdas
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Data Recommendation Tab */}
        {activeTab === "data" && (
          <div className="space-y-8">
            {/* Data Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                  <FaDatabase className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Rekomendasi dari Data
                  </h2>
                  <p className="text-sm text-gray-600">
                    Berdasarkan data terakhir dari sensor ESP32 atau input
                    manual
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={getDataBasedRecommendation}
                  disabled={dataLoading}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium py-3 px-8 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dataLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Memuat Data...
                    </>
                  ) : (
                    <>
                      <FaSyncAlt className="mr-2" />
                      Perbarui Rekomendasi
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Data Recommendation Result */}
            {dataRecommendation &&
              dataRecommendation.success &&
              dataRecommendation.data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                        <FaDatabase className="text-white text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Rekomendasi dari Data
                        </h2>
                        <p className="text-sm text-gray-600">
                          Berdasarkan data dari {dataRecommendation.data.source}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Terakhir diperbarui
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(
                          dataRecommendation.data.timestamp
                        ).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

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
                        {dataRecommendation.data.recommendation.urea} g/m²
                      </p>
                      <div className="bg-blue-100 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                          {dataRecommendation.data.recommendation.urea < 50
                            ? "Dosis rendah"
                            : dataRecommendation.data.recommendation.urea < 100
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
                        {dataRecommendation.data.recommendation.sp36} g/m²
                      </p>
                      <div className="bg-purple-100 rounded-lg p-3">
                        <p className="text-xs text-purple-700">
                          {dataRecommendation.data.recommendation.sp36 < 50
                            ? "Dosis rendah"
                            : dataRecommendation.data.recommendation.sp36 < 100
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
                        {dataRecommendation.data.recommendation.kcl} g/m²
                      </p>
                      <div className="bg-green-100 rounded-lg p-3">
                        <p className="text-xs text-green-700">
                          {dataRecommendation.data.recommendation.kcl < 50
                            ? "Dosis rendah"
                            : dataRecommendation.data.recommendation.kcl < 100
                            ? "Dosis sedang"
                            : "Dosis tinggi"}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Data Source Info */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <FaDatabase className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Sumber Data
                        </p>
                        <p className="text-xs text-gray-600">
                          ✓ Rekomendasi dihasilkan dari data{" "}
                          {dataRecommendation.data.source.toLowerCase()}
                        </p>
                        {dataRecommendation.data.input && (
                          <p className="text-xs text-gray-600 mt-1">
                            Input: pH {dataRecommendation.data.input.pH}, N{" "}
                            {dataRecommendation.data.input.N}, K{" "}
                            {dataRecommendation.data.input.K}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            {/* No Data Message */}
            {dataRecommendation && !dataRecommendation.success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-yellow-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Belum Ada Data
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {dataRecommendation.message ||
                      "Silakan input data terlebih dahulu di halaman Data untuk mendapatkan rekomendasi."}
                  </p>
                  <button
                    onClick={() => (window.location.href = "/data")}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    Ke Halaman Data
                  </button>
                </div>
              </motion.div>
            )}
          </div>
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

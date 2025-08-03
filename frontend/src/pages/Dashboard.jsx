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
  FaHome,
  FaDatabase,
  FaRobot,
  FaChartPie,
} from "react-icons/fa";
import {
  getRawData,
  getCalibratedData,
  getRecommendation,
} from "../services/api";

const Dashboard = () => {
  const [rawData, setRawData] = useState(null);
  const [calibratedData, setCalibratedData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [raw, calibrated, rec] = await Promise.all([
          getRawData(),
          getCalibratedData(),
          getRecommendation({ pH: 7.0, N: 45, K: 35 }),
        ]);
        setRawData(raw);
        setCalibratedData(calibrated);
        setRecommendation(rec);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (value, type) => {
    const numValue = parseFloat(value);
    switch (type) {
      case "pH":
        if (numValue < 6.0) return "text-red-500";
        if (numValue > 7.5) return "text-orange-500";
        return "text-green-500";
      case "suhu":
        if (numValue < 20 || numValue > 35) return "text-red-500";
        if (numValue < 22 || numValue > 32) return "text-yellow-500";
        return "text-green-500";
      case "kelembaban":
        if (numValue < 40 || numValue > 80) return "text-red-500";
        if (numValue < 50 || numValue > 70) return "text-yellow-500";
        return "text-green-500";
      case "N":
        if (numValue < 30) return "text-red-500";
        if (numValue > 60) return "text-orange-500";
        return "text-green-500";
      case "P":
        if (numValue < 15) return "text-red-500";
        if (numValue > 30) return "text-orange-500";
        return "text-green-500";
      case "K":
        if (numValue < 20) return "text-red-500";
        if (numValue > 50) return "text-orange-500";
        return "text-green-500";
      case "EC":
        if (numValue < 1.0 || numValue > 3.0) return "text-red-500";
        if (numValue < 1.2 || numValue > 2.5) return "text-yellow-500";
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getVariableIcon = (variable) => {
    switch (variable) {
      case "pH":
        return <FaTint className="text-pink-500" />;
      case "suhu":
        return <FaThermometerHalf className="text-red-500" />;
      case "kelembaban":
        return <FaCloud className="text-blue-500" />;
      case "N":
        return <FaBolt className="text-blue-600" />;
      case "P":
        return <FaLeaf className="text-purple-500" />;
      case "K":
        return <FaSeedling className="text-green-500" />;
      case "EC":
        return <FaChartLine className="text-yellow-600" />;
      default:
        return <FaChartLine className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Dashboard Pupuk SDL
          </h1>
          <p className="text-center text-gray-600">
            Monitoring & Rekomendasi Pupuk NPK dengan Machine Learning
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Status Sistem</p>
                <p className="text-2xl font-bold">Aktif</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Data ESP</p>
                <p className="text-2xl font-bold">7 Variabel</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaDatabase className="text-white text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">ML Status</p>
                <p className="text-2xl font-bold">Terlatih</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Rekomendasi</p>
                <p className="text-2xl font-bold">Ready</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaChartPie className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Data Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Raw Data Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <FaLeaf className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Data Mentah ESP
                  </h2>
                  <p className="text-sm text-gray-600">
                    Pembacaan sensor langsung
                  </p>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-1" />
                <span className="text-sm">Live</span>
              </div>
            </div>

            {rawData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(rawData.variables).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getVariableIcon(key)}
                        <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                          {key}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline">
                      <span
                        className={`text-2xl font-bold ${getStatusColor(
                          value,
                          key
                        )}`}
                      >
                        {value}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {key === "pH"
                          ? ""
                          : key === "suhu"
                          ? "°C"
                          : key === "kelembaban"
                          ? "%"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Calibrated Data Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <FaFlask className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Data Terkalibrasi
                  </h2>
                  <p className="text-sm text-gray-600">Hasil ML akurat</p>
                </div>
              </div>
              <div className="flex items-center text-purple-600">
                <FaSyncAlt className="mr-1" />
                <span className="text-sm">ML</span>
              </div>
            </div>

            {calibratedData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(calibratedData.variables).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getVariableIcon(key)}
                          <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                            {key}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span
                          className={`text-2xl font-bold ${getStatusColor(
                            value,
                            key
                          )}`}
                        >
                          {value}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          {key === "pH"
                            ? ""
                            : key === "suhu"
                            ? "°C"
                            : key === "kelembaban"
                            ? "%"
                            : ""}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recommendation Summary */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 mb-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
                <FaCalculator className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Rekomendasi Pupuk NPK
                </h2>
                <p className="text-sm text-gray-600">
                  Dosis optimal berdasarkan data terkalibrasi
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBolt className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Urea (N)
                </h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {recommendation.recommendation.urea} g/m²
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  SP-36 (P)
                </h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {recommendation.recommendation.sp36} g/m²
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSeedling className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  KCL (K)
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {recommendation.recommendation.kcl} g/m²
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                <FaSyncAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Status Sistem
                </h3>
                <p className="text-sm text-gray-600">
                  Semua sistem berjalan normal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-2" />
                <span>ESP Connected</span>
              </div>
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-2" />
                <span>ML Active</span>
              </div>
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-2" />
                <span>Database OK</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

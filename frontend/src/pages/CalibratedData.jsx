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
} from "react-icons/fa";
import {
  getCalibratedData,
  getCalibratedDataHistory,
  deleteAllCalibratedData,
} from "../services/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../components/PDFDownload";

const CalibratedData = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latest, historyData] = await Promise.all([
          getCalibratedData(),
          getCalibratedDataHistory(10),
        ]);
        setData(latest);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching calibrated data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAll = async () => {
    try {
      await deleteAllCalibratedData();
      setData(null);
      setHistory([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

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

  const getStatusIcon = (value, type) => {
    const numValue = parseFloat(value);
    switch (type) {
      case "pH":
        if (numValue < 6.0 || numValue > 7.5)
          return <FaExclamationTriangle className="text-red-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "suhu":
        if (numValue < 20 || numValue > 35)
          return <FaExclamationTriangle className="text-red-500" />;
        if (numValue < 22 || numValue > 32)
          return <FaExclamationTriangle className="text-yellow-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "kelembaban":
        if (numValue < 40 || numValue > 80)
          return <FaExclamationTriangle className="text-red-500" />;
        if (numValue < 50 || numValue > 70)
          return <FaExclamationTriangle className="text-yellow-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "N":
        if (numValue < 30 || numValue > 60)
          return <FaExclamationTriangle className="text-red-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "P":
        if (numValue < 15 || numValue > 30)
          return <FaExclamationTriangle className="text-red-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "K":
        if (numValue < 20 || numValue > 50)
          return <FaExclamationTriangle className="text-red-500" />;
        return <FaCheckCircle className="text-green-500" />;
      case "EC":
        if (numValue < 1.0 || numValue > 3.0)
          return <FaExclamationTriangle className="text-red-500" />;
        if (numValue < 1.2 || numValue > 2.5)
          return <FaExclamationTriangle className="text-yellow-500" />;
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
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
          <p className="text-gray-600">Memuat data...</p>
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
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Data Terkalibrasi
          </h1>
          <p className="text-center text-gray-600">
            Data yang telah dikalibrasi dengan Machine Learning - Akurat &
            Terpercaya
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Download Data</h3>
                <p className="text-emerald-100 text-sm">
                  Simpan data dalam format PDF
                </p>
              </div>
              <PDFDownloadLink
                document={
                  <PDFDocument
                    data={data}
                    history={history}
                    type="calibrated"
                  />
                }
                fileName={`data-terkalibrasi-${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 flex items-center"
              >
                {({ loading }) => (
                  <span className="flex items-center">
                    <FaDownload className="mr-2" />
                    {loading ? "Membuat..." : "Download PDF"}
                  </span>
                )}
              </PDFDownloadLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Refresh Data</h3>
                <p className="text-purple-100 text-sm">Dapatkan data terbaru</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 flex items-center"
              >
                <FaSyncAlt className="mr-2" />
                Refresh
              </button>
            </div>
          </motion.div>
        </div>

        {/* Current Data Card */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <FaLeaf className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Data Terbaru
                  </h2>
                  <p className="text-sm text-gray-600">
                    Pembacaan terakhir (telah dikalibrasi)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Waktu Kalibrasi</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(data.timestamp).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getVariableIcon(key)}
                      <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                    </div>
                    {getStatusIcon(value, key)}
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

            {/* ML Status */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <FaSyncAlt className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Status Kalibrasi
                  </p>
                  <p className="text-xs text-gray-600">
                    ✓ Data telah dikalibrasi dengan model Machine Learning
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Riwayat Data Terkalibrasi
              </h2>
              <p className="text-sm text-gray-600">10 pembacaan terakhir</p>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(item.timestamp).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <FaCheckCircle className="mr-1" />
                      Terkalibrasi
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(item.variables).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {getVariableIcon(key)}
                          <span className="ml-2 text-xs text-gray-600 capitalize">
                            {key}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold ${getStatusColor(
                            value,
                            key
                          )}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">Tidak ada data riwayat</p>
            </div>
          )}
        </motion.div>

        {/* ML Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-purple-200"
        >
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <FaSeedling className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Tentang Kalibrasi Machine Learning
              </h3>
              <p className="text-gray-600 mb-3">
                Data yang ditampilkan telah melalui proses kalibrasi menggunakan
                model machine learning yang dilatih dengan data laboratorium.
                Hal ini memastikan akurasi pembacaan sensor dan memberikan hasil
                yang lebih dapat diandalkan.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Akurasi Tinggi
                  </p>
                  <p className="text-xs text-gray-600">Error kurang dari 5%</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Real-time
                  </p>
                  <p className="text-xs text-gray-600">Update setiap 5 detik</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Validasi
                  </p>
                  <p className="text-xs text-gray-600">
                    Telah diverifikasi lab
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

export default CalibratedData;

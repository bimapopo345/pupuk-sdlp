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
} from "react-icons/fa";
import {
  getRawData,
  getRawDataHistory,
  deleteAllRawData,
} from "../services/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SimplePDF from "../components/SimplePDF";

const RawData = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latest, historyData] = await Promise.all([
          getRawData(),
          getRawDataHistory(10),
        ]);
        setData(latest);
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching raw data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteAll = async () => {
    try {
      await deleteAllRawData();
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 pt-24">
      {" "}
      {/* Added pt-24 for header space */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Data Sensor Mentah
          </h1>
          <p className="text-center text-gray-600">
            Pembacaan langsung dari ESP32 - Real-time Monitoring
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Download Data</h3>
                <p className="text-green-100 text-sm">
                  Simpan data dalam format PDF
                </p>
              </div>
              <PDFDownloadLink
                document={
                  <SimplePDF
                    data={data}
                    history={history.slice(0, 5)}
                    type="raw"
                  />
                }
                fileName={`data-mentah-${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md"
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
            className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Hapus Data</h3>
                <p className="text-red-100 text-sm">Hapus semua data mentah</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md"
              >
                <FaTrashAlt className="mr-2" />
                Hapus
              </button>
            </div>
          </motion.div>
        </div>

        {/* Current Data Card */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Data Terbaru
                  </h2>
                  <p className="text-sm text-gray-600">
                    Pembacaan terakhir dari sensor
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Waktu Pembacaan</p>
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
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
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
          </motion.div>
        )}

        {/* History Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
              <FaLeaf className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Riwayat Data</h2>
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
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200"
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Konfirmasi Hapus
                </h3>
                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus semua data mentah? Tindakan
                  ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="flex-1 bg-red-500 text-white font-medium py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RawData;

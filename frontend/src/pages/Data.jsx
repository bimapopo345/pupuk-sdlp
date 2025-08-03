import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaFileWord,
  FaFilePdf,
  FaUpload,
  FaSave,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { saveManualData } from "../services/api";
import { getManualData } from "../services/api";

const Data = () => {
  const [activeTab, setActiveTab] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [pH, setpH] = useState("");
  const [n, setN] = useState("");
  const [k, setK] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        setFile(null);
        setUploadStatus({
          type: "error",
          message: "Hanya file .pdf, .doc, atau .docx yang diizinkan.",
        });
      }
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const payload = {
        type: "text",
        content: textContent,
        extractedData: {
          pH: pH ? parseFloat(pH) : null,
          N: n ? parseFloat(n) : null,
          K: k ? parseFloat(k) : null,
        },
      };
      const result = await saveManualData(payload);
      if (result) {
        setUploadStatus({
          type: "success",
          message: "Data teks berhasil disimpan.",
        });
        setTextContent("");
        setpH("");
        setN("");
        setK("");
      } else {
        setUploadStatus({
          type: "error",
          message: "Gagal menyimpan data teks.",
        });
      }
    } catch (error) {
      console.error("Error saving text data:", error);
      setUploadStatus({
        type: "error",
        message: "Terjadi kesalahan saat menyimpan data teks.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const payload = {
        type: "file",
        content: `File: ${file.name}`,
        fileName: file.name,
        fileType: file.type,
        extractedData: {
          pH: null,
          N: null,
          K: null,
        },
      };

      const result = await saveManualData(payload);
      if (result) {
        setIsUploading(false);
        setUploadStatus({
          type: "success",
          message: `File "${file.name}" berhasil diunggah dan sedang diproses.`,
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setIsUploading(false);
        setUploadStatus({
          type: "error",
          message: "Gagal mengunggah file.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setUploadStatus({
        type: "error",
        message: "Terjadi kesalahan saat mengunggah file.",
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Input Data Pupuk Manual
          </h1>
          <p className="text-center text-gray-600">
            Masukkan data pupuk manual atau unggah dokumen untuk analisis
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-md">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "text"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Input Teks
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "file"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Unggah Dokumen
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center ${
              uploadStatus.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <FaCheckCircle className="mr-3 text-green-500" />
            ) : (
              <FaExclamationTriangle className="mr-3 text-red-500" />
            )}
            <span>{uploadStatus.message}</span>
          </motion.div>
        )}

        {/* Text Input Form */}
        {activeTab === "text" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
          >
            <form onSubmit={handleTextSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Data Pupuk
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contoh: Tanah pada lahan pertanian menunjukkan keasaman pH yang tinggi. Observasi awal menunjukkan kurangnya pertumbuhan tanaman. Pupuk NPK terakhir diberikan 2 minggu lalu dengan dosis standar."
                ></textarea>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai pH (Opsional)
                  </label>
                  <input
                    type="number"
                    value={pH}
                    onChange={(e) => setpH(e.target.value)}
                    step="0.1"
                    min="0"
                    max="14"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="pH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai N (Opsional)
                  </label>
                  <input
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    step="1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nitrogen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai K (Opsional)
                  </label>
                  <input
                    type="number"
                    value={k}
                    onChange={(e) => setK(e.target.value)}
                    step="1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kalium"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isUploading || !textContent.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Simpan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* File Upload Form */}
        {activeTab === "file" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-green-100"
          >
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-300">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Seret dan lepas file di sini, atau klik untuk memilih
                  </p>
                  <p className="text-sm text-gray-500">
                    Format yang didukung: PDF, Word (.doc, .docx)
                  </p>
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    {file.type === "application/pdf" ? (
                      <FaFilePdf className="text-red-500 text-2xl mr-3" />
                    ) : (
                      <FaFileWord className="text-blue-500 text-2xl mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <FaFileAlt className="mr-2" />
                      Unggah & Analisis
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Data;

import { useEffect, useState } from "react";
import {
  getCalibratedData,
  getCalibratedDataHistory,
  saveCalibratedData,
} from "../services/api";
import Chart from "../components/Chart";
import PDFDownload from "../components/PDFDownload";

const CalibratedData = () => {
  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [currentResult, historyResult] = await Promise.all([
          getCalibratedData(),
          getCalibratedDataHistory(20),
        ]);

        if (currentResult) setCurrentData(currentResult);
        if (historyResult) setHistoryData(historyResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const newData = {
        timestamp: new Date().toISOString(),
        variables: {
          pH: (Math.random() * 4 + 6).toFixed(2),
          suhu: (Math.random() * 10 + 25).toFixed(2),
          kelembaban: (Math.random() * 30 + 40).toFixed(2),
          N: (Math.random() * 50 + 20).toFixed(2),
          P: (Math.random() * 30 + 10).toFixed(2),
          K: (Math.random() * 40 + 15).toFixed(2),
          EC: (Math.random() * 2 + 1).toFixed(2),
        },
      };

      const savedData = await saveCalibratedData(newData);
      if (savedData) {
        setCurrentData(savedData);
        setHistoryData([savedData, ...historyData]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Data Terkalibrasi</h1>
        <button
          onClick={handleSaveData}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan Data Dummy"}
        </button>
      </div>

      <PDFDownload title="Data Terkalibrasi">
        {currentData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Perbandingan Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Data Mentah
                </h3>
                <div className="space-y-3">
                  {Object.entries(currentData.variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Data Terkalibrasi
                </h3>
                <div className="space-y-3">
                  {Object.entries(currentData.variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Grafik Perbandingan
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Chart data={currentData} title="Data Mentah" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Chart data={currentData} title="Data Terkalibrasi" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Riwayat Data Terkalibrasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyData.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {new Date(item.timestamp).toLocaleString()}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>pH: {item.variables.pH}</div>
                  <div>Suhu: {item.variables.suhu}°C</div>
                  <div>Kelembaban: {item.variables.kelembaban}%</div>
                  <div>N: {item.variables.N}</div>
                  <div>P: {item.variables.P}</div>
                  <div>K: {item.variables.K}</div>
                </div>
              </div>
            ))}
          </div>
          {historyData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data riwayat tersedia
            </div>
          )}
        </div>
      </PDFDownload>
    </div>
  );
};

export default CalibratedData;

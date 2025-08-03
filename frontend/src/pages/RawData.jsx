import { useEffect, useState } from "react";
import { getRawData, getRawDataHistory, saveRawData } from "../services/api";
import Chart from "../components/Chart";
import PDFDownload from "../components/PDFDownload";

const RawData = () => {
  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [currentResult, historyResult] = await Promise.all([
          getRawData(),
          getRawDataHistory(20),
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

      const savedData = await saveRawData(newData);
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
        <h1 className="text-3xl font-bold text-gray-800">Data Mentah ESP</h1>
        <button
          onClick={handleSaveData}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan Data Dummy"}
        </button>
      </div>

      <PDFDownload title="Data Mentah ESP">
        {currentData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Data Terbaru
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(currentData.variables).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">{key}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Waktu: {new Date(currentData.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Grafik Data Terbaru
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {currentData ? (
              <Chart data={currentData} title="Data Mentah Terbaru" />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data tersedia
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Riwayat Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyData.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-700">
                    {new Date(item.timestamp).toLocaleString()}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH:</span>
                    <span className="font-medium">{item.variables.pH}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suhu:</span>
                    <span className="font-medium">{item.variables.suhu}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kelembaban:</span>
                    <span className="font-medium">
                      {item.variables.kelembaban}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N:</span>
                    <span className="font-medium">{item.variables.N}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P:</span>
                    <span className="font-medium">{item.variables.P}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">K:</span>
                    <span className="font-medium">{item.variables.K}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EC:</span>
                    <span className="font-medium">{item.variables.EC}</span>
                  </div>
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

export default RawData;

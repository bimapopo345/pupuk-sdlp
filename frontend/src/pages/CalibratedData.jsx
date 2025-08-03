import { useEffect, useState } from "react";
import { getRawData, getCalibratedData, getHistory } from "../services/api";
import Chart from "../components/Chart";
import PDFDownload from "../components/PDFDownload";

const CalibratedData = () => {
  const [rawData, setRawData] = useState(null);
  const [calibratedData, setCalibratedData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [rawResult, calibratedResult, historyResult] = await Promise.all([
        getRawData(),
        getCalibratedData(),
        getHistory(),
      ]);

      if (rawResult) setRawData(rawResult);
      if (calibratedResult) setCalibratedData(calibratedResult);
      if (historyResult) setHistoryData(historyResult);
    };
    fetchData();
  }, []);

  if (!rawData || !calibratedData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Data Terkalibrasi
      </h1>

      <PDFDownload title="Data Terkalibrasi">
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
                {Object.entries(rawData.variables).map(([key, value]) => (
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
                {Object.entries(calibratedData.variables).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Grafik Perbandingan
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-96">
              <Chart data={rawData} title="Data Mentah" />
              <Chart data={calibratedData} title="Data Terkalibrasi" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Data Historis Terkalibrasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </PDFDownload>
    </div>
  );
};

export default CalibratedData;

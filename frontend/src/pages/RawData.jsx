import { useEffect, useState } from "react";
import { getRawData, getHistory } from "../services/api";
import Chart from "../components/Chart";
import PDFDownload from "../components/PDFDownload";

const RawData = () => {
  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [rawResult, historyResult] = await Promise.all([
        getRawData(),
        getHistory(),
      ]);

      if (rawResult) setCurrentData(rawResult);
      if (historyResult) setHistoryData(historyResult);
    };
    fetchData();
  }, []);

  if (!currentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Data Mentah dari ESP
      </h1>

      <PDFDownload title="Data Mentah ESP">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">pH</h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.pH}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Suhu</h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.suhu}°C
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Kelembaban
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.kelembaban}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nitrogen (N)
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.N}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Fosfor (P)
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.P}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Kalium (K)
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.K}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">EC</h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentData.variables.EC}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Grafik Data Mentah
          </h2>
          <Chart data={currentData} title="Data Mentah ESP" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Data Historis
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

export default RawData;

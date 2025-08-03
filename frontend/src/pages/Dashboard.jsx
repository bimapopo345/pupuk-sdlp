import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRawData } from "../services/api";
import Chart from "../components/Chart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRawData();
      if (result) {
        setData(result);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">pH</h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.pH}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Suhu</h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.suhu}°C
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Kelembaban
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.kelembaban}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nitrogen (N)
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.N}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Fosfor (P)
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.P}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Kalium (K)
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {data.variables.K}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Grafik Data</h2>
        <Chart data={data} title="Data Sensor" />
      </div>

      <div className="bg-green-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/raw-data"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            Lihat Data Mentah
          </Link>
          <Link
            to="/calibrated-data"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            Lihat Data Terkalibrasi
          </Link>
          <Link
            to="/recommendation"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
          >
            Dapatkan Rekomendasi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

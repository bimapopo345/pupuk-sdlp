import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: Object.keys(data.variables),
    datasets: [
      {
        label: "Nilai",
        data: Object.values(data.variables),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="h-64">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default Chart;

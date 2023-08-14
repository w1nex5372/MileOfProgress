import React from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-moment";
import Chart from "chart.js/auto";
import {
  LinearScale,
  BarElement,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import "tailwindcss/tailwind.css"; // Import Tailwind CSS

Chart.register(
  LinearScale,
  BarElement,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, options, setShowChart }) => {
  const handleClose = () => {
    setShowChart(false);
  };

  return (
    <div className="relative p-2 shadow-md rounded-md">
      <h2 className="font-medium">Habit Charts</h2>
      <button
        className="absolute top-2 right-2 z-10 cursor-pointer bg-white rounded-md p-1 hover:bg-gray-300 md:hidden"
        onClick={handleClose}
      >
        X
      </button>

      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponent;

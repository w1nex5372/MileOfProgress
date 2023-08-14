import React from "react";
import ChartComponent from "./ChartComponent";

const MyChart = () => {
  const chartData = {
    // Chart data configuration for the primary data
  };

  const compareChartData = {
    // Chart data configuration for the comparison data
  };

  const chartOptions = {
    // Chart options configuration
  };

  return (
    <>
      <h1>Primary Chart</h1>
      <ChartComponent data={chartData} options={chartOptions} />
    </>
  );
};

export default MyChart;

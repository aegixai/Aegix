import React from "react";
import { Line } from "react-chartjs-2";

const TwitterKeywordTrendChart = ({ tweets }) => {
  const keywordCount = {};
  tweets.forEach((t) => {
    const date = t.created_at.split("T")[0];
    keywordCount[date] = (keywordCount[date] || 0) + 1;
  });

  const labels = Object.keys(keywordCount).sort();
  const data = {
    labels,
    datasets: [
      {
        label: "Tweet Volume",
        data: labels.map((d) => keywordCount[d]),
        borderColor: "#38bdf8",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-cyan-300 mb-3">📈 Keyword Trend</h2>
      <Line data={data} />
    </div>
  );
};

export default TwitterKeywordTrendChart;


// ✅ SentimentPieChart.jsx – Pie Chart for Twitter Sentiment Overview
import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentPieChart = ({ articles }) => {
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

  articles.forEach((article) => {
    const sentiment = article.sentiment || "neutral";
    sentimentCounts[sentiment]++;
  });

  const chartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment Distribution",
        data: [
          sentimentCounts.positive,
          sentimentCounts.negative,
          sentimentCounts.neutral,
        ],
        backgroundColor: ["#4ade80", "#f87171", "#facc15"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <div
      className="bg-white rounded p-4 mb-6 mx-auto"
      style={{ maxWidth: 360, height: 360 }}
    >
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default SentimentPieChart;

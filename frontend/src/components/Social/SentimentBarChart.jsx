// ✅ SentimentBarChart.jsx – Bar Chart for Twitter Sentiment Timeline
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SentimentBarChart = ({ tweets = [] }) => {
  const sentimentByDate = {};

  tweets.forEach((tweet) => {
    const date = tweet.created_at?.split("T")[0];
    const sentiment = tweet.sentiment || "neutral";
    if (!date) return;

    if (!sentimentByDate[date]) {
      sentimentByDate[date] = { positive: 0, negative: 0, neutral: 0 };
    }
    sentimentByDate[date][sentiment]++;
  });

  const labels = Object.keys(sentimentByDate).sort();
  const data = {
    labels,
    datasets: [
      {
        label: "Positive",
        data: labels.map((d) => sentimentByDate[d].positive),
        backgroundColor: "#4ade80",
      },
      {
        label: "Negative",
        data: labels.map((d) => sentimentByDate[d].negative),
        backgroundColor: "#f87171",
      },
      {
        label: "Neutral",
        data: labels.map((d) => sentimentByDate[d].neutral),
        backgroundColor: "#facc15",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
    scales: {
      x: { ticks: { color: "#ccc" } },
      y: { ticks: { color: "#ccc" } },
    },
  };

  return (
    <div
      className="bg-white rounded p-4 mb-6 mx-auto"
      style={{ maxWidth: 800, height: 300 }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default SentimentBarChart;

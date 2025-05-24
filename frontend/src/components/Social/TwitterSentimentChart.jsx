import React from "react";
import { Pie } from "react-chartjs-2";

const TwitterSentimentChart = ({ tweets }) => {
  const counts = { positive: 0, negative: 0, neutral: 0 };
  tweets.forEach((t) => {
    const s = t.sentiment || "neutral";
    counts[s]++;
  });

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [counts.positive, counts.negative, counts.neutral],
        backgroundColor: ["#22c55e", "#ef4444", "#eab308"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-yellow-300 mb-3">🥧 Sentiment Breakdown</h2>
      <Pie data={data} />
    </div>
  );
};

export default TwitterSentimentChart;

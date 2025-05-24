import React from "react";
import { Bar } from "react-chartjs-2";

const TwitterSourceDistribution = ({ tweets }) => {
  const sources = {};

  tweets.forEach((tweet) => {
    const author = tweet.author_id || "unknown";
    sources[author] = (sources[author] || 0) + 1;
  });

  const labels = Object.keys(sources);
  const data = {
    labels,
    datasets: [
      {
        label: "Tweet Count by Author",
        data: labels.map((key) => sources[key]),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-blue-300 mb-3">📊 Source Distribution</h2>
      <Bar data={data} />
    </div>
  );
};

export default TwitterSourceDistribution;

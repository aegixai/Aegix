import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { sentimentKeywords } from "@/utils/sentiment-keywords";

const SentimentPieChart = ({ articles, sector = "finance" }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!articles || articles.length === 0) {
      setChartData(null);
      return;
    }

    const counts = { positive: 0, negative: 0, neutral: 0 };

    articles.forEach((a) => {
      const words = a.title.toLowerCase().split(/\W+/);
      words.forEach((word) => {
        if (sentimentKeywords[sector]?.positive.includes(word)) counts.positive++;
        else if (sentimentKeywords[sector]?.negative.includes(word)) counts.negative++;
        else if (sentimentKeywords[sector]?.neutral.includes(word)) counts.neutral++;
      });
    });

    setChartData({
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [
        {
          data: [counts.positive, counts.negative, counts.neutral],
          backgroundColor: ["#22c55e", "#ef4444", "#a3a3a3"],
          borderColor: "#1f2937",
          borderWidth: 1,
        },
      ],
    });
  }, [articles, sector]);

  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-700">
      <h2 className="text-lg font-semibold mb-2 text-white">📊 Sentiment Pie Chart ({sector})</h2>
      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p className="text-gray-400 text-sm">No data available to analyze.</p>
      )}
    </div>
  );
};

export default SentimentPieChart;

import React from "react";
import { sentimentKeywords } from "@/utils/sentiment-keywords";

const TopKeywordsTable = ({ articles, sector = "finance" }) => {
  const counts = {
    positive: {},
    negative: {},
    neutral: {},
  };

  articles.forEach((a) => {
    const text = `${a.title} ${a.description || ""}`.toLowerCase();
    ["positive", "negative", "neutral"].forEach((sentiment) => {
      const words =
        sentimentKeywords[sector]?.[sentiment] || sentimentKeywords[sentiment] || [];
      words.forEach((word) => {
        if (text.includes(word.toLowerCase())) {
          counts[sentiment][word] = (counts[sentiment][word] || 0) + 1;
        }
      });
    });
  });

  const getTopWords = (sentiment) => {
    const sorted = Object.entries(counts[sentiment])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return sorted.map(([word, count]) => (
      <div key={word} className="flex justify-between px-2 py-1 text-sm">
        <span>{word}</span>
        <span className="text-gray-400">×{count}</span>
      </div>
    ));
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-green-900 p-3 rounded border border-green-500">
        <h3 className="text-lg font-semibold text-green-300 mb-2">Positive</h3>
        {getTopWords("positive")}
      </div>
      <div className="bg-red-900 p-3 rounded border border-red-500">
        <h3 className="text-lg font-semibold text-red-300 mb-2">Negative</h3>
        {getTopWords("negative")}
      </div>
      <div className="bg-yellow-800 p-3 rounded border border-yellow-400">
        <h3 className="text-lg font-semibold text-yellow-200 mb-2">Neutral</h3>
        {getTopWords("neutral")}
      </div>
    </div>
  );
};

export default TopKeywordsTable;

import React from "react";

const TwitterAIInsightsPanel = ({ insights }) => {
  return (
    <div className="bg-gray-900 p-4 rounded shadow text-white mb-6">
      <h2 className="text-xl font-semibold text-pink-400 mb-3">🤖 AI Insights</h2>
      {insights.length ? (
        <ul className="list-disc ml-6 space-y-1 text-sm">
          {insights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No insights available.</p>
      )}
    </div>
  );
};

export default TwitterAIInsightsPanel;

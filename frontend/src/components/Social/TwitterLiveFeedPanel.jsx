import React from "react";

const TwitterLiveFeedPanel = ({ tweets }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-green-300 mb-3">🟢 Live Tweet Feed</h2>
      <ul className="space-y-2 text-sm max-h-96 overflow-y-auto">
        {tweets.map((t, i) => (
          <li key={i} className="border-b border-gray-700 pb-2">
            <p>{t.text}</p>
            <p className="text-xs text-gray-400">
              {new Date(t.created_at).toLocaleString()} | Sentiment: {t.sentiment || "neutral"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TwitterLiveFeedPanel;

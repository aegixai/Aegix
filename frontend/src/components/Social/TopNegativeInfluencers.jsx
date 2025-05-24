// ✅ TopNegativeInfluencers.jsx — Component to display dynamic Top N negative users
import React, { useState } from "react";

const TopNegativeInfluencers = ({ tweets }) => {
  const [limit, setLimit] = useState(10);

  const countNegatives = () => {
    const counter = {};
    tweets.forEach((t) => {
      if (t.sentiment === "negative") {
        const user = t.author_id || "unknown";
        counter[user] = (counter[user] || 0) + 1;
      }
    });

    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([user, count]) => ({ user, count }));
  };

  const topUsers = countNegatives();

  return (
    <div className="mb-6">
      <h2 className="text-xl text-red-400 font-semibold mb-2">
        🔥 Top {limit} Negative Influencers
      </h2>

      <div className="flex gap-2 mb-4">
        {[5, 10, 15, 20].map((n) => (
          <button
            key={n}
            onClick={() => setLimit(n)}
            className={`px-3 py-1 rounded border ${
              limit === n ? "bg-red-800 text-white" : "bg-gray-900 text-gray-300"
            }`}
          >
            TOP {n}
          </button>
        ))}
      </div>

      {topUsers.length === 0 ? (
        <p className="text-gray-400">No negative influencers found.</p>
      ) : (
        <ul className="list-decimal ml-6 text-sm text-white">
          {topUsers.map((u, i) => (
            <li key={i}>
              User ID: <span className="text-pink-300">{u.user}</span> — {u.count} negative tweets
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopNegativeInfluencers;

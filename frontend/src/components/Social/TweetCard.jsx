import React from "react";

const TweetCard = ({ tweet }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow">
      <p className="text-sm mb-2">{tweet.text}</p>
      <div className="text-xs text-gray-400 flex justify-between">
        <span>🧠 {tweet.sentiment || "neutral"}</span>
        <span>{new Date(tweet.created_at).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TweetCard;

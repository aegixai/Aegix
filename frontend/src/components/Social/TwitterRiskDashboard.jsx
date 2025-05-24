// ✅ TwitterRiskDashboard.jsx – Final Clean Version with Live Data, AI Insights, and Graphs
import React, { useEffect, useState } from "react";
import axios from "axios";
import SentimentPieChart from "./SentimentPieChart";
import TweetCard from "./TweetCard";
import TopNegativeInfluencers from "./TopNegativeInfluencers";
import SentimentBarChart from "./SentimentBarChart";

const TwitterRiskDashboard = () => {
  const [query, setQuery] = useState("FATF");
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    fetchTweets(query);
  }, []);

  const fetchTweets = async (q) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/twitter/search", { query: q });
      const fetchedTweets = res.data.tweets || [];
      setTweets(fetchedTweets);

      const ai = await axios.post("/api/ai/summary", {
        articles: fetchedTweets.map((t) => ({ title: t.text })),
      });
      setInsights(ai.data.recommendations || []);
    } catch (err) {
      console.error("❌ Twitter fetch error:", err);
      setError("Failed to fetch tweets or insights.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = (tweet) => {
    setFlagged((prev) => [...prev, tweet]);
    console.log("🚩 Flagged tweet for further analysis:", tweet);
  };

  const filteredTweets = tweets.filter(
    (t) => sentimentFilter === "all" || t.sentiment === sentimentFilter
  );

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🐦 Twitter Risk Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topic or hashtag..."
          className="bg-gray-800 text-white p-2 rounded w-72"
          onKeyDown={(e) => e.key === "Enter" && fetchTweets(query)}
        />
        <button
          onClick={() => fetchTweets(query)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          🔍 Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {["all", "positive", "neutral", "negative"].map((s) => (
          <button
            key={s}
            onClick={() => setSentimentFilter(s)}
            className={`px-3 py-1 rounded border ${
              sentimentFilter === s ? "bg-gray-700" : "bg-gray-900"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p className="text-blue-400">Loading tweets and insights...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && tweets.length > 0 && (
        <>
          <SentimentBarChart tweets={tweets} />

          <TopNegativeInfluencers tweets={tweets} />

          <div className="mb-6">
            <h2 className="text-xl text-pink-400 font-semibold mb-2">🤖 AI Insights</h2>
            <ul className="list-disc ml-6 text-sm text-gray-200">
              {insights.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl text-yellow-400 font-semibold mb-2">🥧 Sentiment Overview</h2>
            <SentimentPieChart articles={tweets} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-green-400 font-semibold mb-2">📢 Tweets</h2>
            {filteredTweets.map((t, i) => (
              <div key={i} className="border border-gray-700 p-4 rounded-lg relative">
                <TweetCard tweet={t} />
                <button
                  className="absolute top-2 right-2 text-sm text-red-400 hover:underline"
                  onClick={() => handleFlag(t)}
                >
                  🚩 Flag
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TwitterRiskDashboard;
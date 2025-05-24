import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SentimentPieChart from "./SentimentPieChart";
import TopKeywordsTable from "./TopKeywordsTable";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CompanyNewsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlCompany = new URLSearchParams(location.search).get("company") || "BlackRock";

  const [company, setCompany] = useState(urlCompany);
  const [query, setQuery] = useState(urlCompany);
  const [articles, setArticles] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      setArticles([]);
      setAiInsights([]);

      try {
        const url = "https://newsapi.org/v2/everything?q=" + encodeURIComponent(company) +
                    "&sortBy=publishedAt&pageSize=30&language=en&apiKey=" + NEWS_API_KEY;
        const res = await axios.get(url);
        const fetchedArticles = res.data.articles || [];

        if (fetchedArticles.length === 0) throw new Error("No articles found.");

        setArticles(fetchedArticles);
        const timestamp = new Date().toISOString();
        setLastFetched(timestamp);

        try {
          await axios.post("/api/save-news", {
            query: company,
            last_fetched: timestamp,
            articles: fetchedArticles
          });
        } catch (err) {
          console.warn("Save to backend failed");
        }

        try {
          const aiRes = await axios.post("/api/ai/summary", { articles: fetchedArticles });
          setAiInsights(aiRes.data.recommendations || []);
        } catch (err) {
          console.warn("AI summary failed");
          setAiInsights(["AI summary not available."]);
        }

      } catch (err) {
        setError("Could not load news or insights.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company]);

  const handleSearch = () => {
    if (!query) return;
    navigate("?company=" + encodeURIComponent(query));
    setCompany(query);
  };

  const sentimentData = () => {
    const counts = {};
    articles.forEach(a => {
      const date = a.publishedAt?.split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });

    const labels = Object.keys(counts).sort();
    const data = labels.map(d => counts[d]);

    return {
      labels,
      datasets: [{
        label: "Articles by Date",
        data,
        borderColor: "#4fc3f7",
        backgroundColor: "#81d4fa",
        tension: 0.3
      }]
    };
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📰 News Coverage: {company}</h1>
        <Link to="/investigation-center" className="text-blue-400 hover:underline">← Back</Link>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Search company..."
          className="bg-gray-800 text-white p-2 rounded w-72"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          🔍 Search
        </button>
      </div>

      {loading && <p className="text-blue-300">Loading news and insights...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <>
          {lastFetched && (
            <p className="text-sm text-gray-400 mb-4">
              🕓 Last updated: {new Date(lastFetched).toLocaleString()}
            </p>
          )}

          <div className="bg-white rounded p-4 mb-6 max-w-xl mx-auto">
            <Line data={sentimentData()} />
          </div>

          <div className="mb-6">
            <h2 className="text-xl text-pink-400 font-semibold mb-2">🤖 AI Insights</h2>
            <ul className="list-disc ml-6 text-sm text-gray-200">
              {aiInsights.length ? aiInsights.map((r, i) => <li key={i}>{r}</li>) : <li>No AI insights available.</li>}
            </ul>
          </div>

          <div className="mb-6">
           <h2 className="text-xl text-yellow-400 font-semibold mb-2">🥧 Sentiment Breakdown</h2>
           <div className="w-1/2 mx-auto">
         <SentimentPieChart articles={articles} />
          </div>
        </div>


          <div className="mb-6">
            <h2 className="text-xl text-green-400 font-semibold mb-2">📌 Top Keywords</h2>
            <TopKeywordsTable articles={articles} />
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyNewsDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
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
  const [articles, setArticles] = useState([]);
  const [company, setCompany] = useState("BlackRock");
  const [query, setQuery] = useState("BlackRock");
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const navigate = useNavigate();

  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const fetchAndSaveNews = async (companyName) => {
    setLoading(true);
    try {
      const url = `https://newsapi.org/v2/everything?q=${companyName}&sortBy=publishedAt&pageSize=30&language=en&apiKey=${NEWS_API_KEY}`;
      const res = await axios.get(url);
      const articles = res.data.articles || [];

      setArticles(articles);
      setLastFetched(new Date().toISOString());

      await fetch("/api/save-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: companyName,
          last_fetched: new Date().toISOString(),
          articles,
        }),
      });

      const aiRes = await axios.post("/api/ai/summary", { articles });
      setAiInsights(aiRes.data.recommendations || []);
    } catch (err) {
      console.error("News API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFromJson = async () => {
      try {
        const res = await fetch("/data/company_news.json");
        const data = await res.json();
        if (data.query?.toLowerCase() === company.toLowerCase()) {
          setArticles(data.articles);
          setLastFetched(data.last_fetched);
          const aiRes = await axios.post("/api/ai/summary", { articles: data.articles });
          setAiInsights(aiRes.data.recommendations || []);
          return;
        }
      } catch (err) {
        console.warn("No saved data, fetching fresh news...");
      }
      fetchAndSaveNews(company);
    };
    loadFromJson();
  }, [company]);

  const sentimentData = () => {
    const counts = {};
    articles.forEach((a) => {
      const date = a.publishedAt?.split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map((d) => counts[d]);

    return {
      labels: labels.length ? labels : ["No Data"],
      datasets: [
        {
          label: "Articles by Date",
          data: data.length ? data : [0],
          borderColor: "#4fc3f7",
          backgroundColor: "#81d4fa",
          tension: 0.2,
        },
      ],
    };
  };

  const handleDisinfoClick = () => {
    navigate("/narrative-monitor");
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📰 News Coverage: {company}</h1>
        <Link to="/investigation-center" className="text-blue-400 hover:underline">
          ← Back
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company name..."
          className="px-4 py-2 rounded bg-gray-800 text-white w-72"
        />
        <button
          onClick={() => setCompany(query)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          🔍 Search
        </button>
      </div>

      {lastFetched && (
        <p className="text-sm text-gray-400 mb-4">
          🕓 Last fetched: {new Date(lastFetched).toLocaleString()}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading news...</p>
      ) : (
        <>
          <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-2">📊 Article Timeline</h2>
            <div className="bg-white rounded p-2 w-1/2 mx-auto">
              <Line data={sentimentData()} />
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-pink-400 mb-2">🤖 AI Insights</h2>
            <ul className="list-disc ml-6 text-sm text-gray-200">
              {aiInsights.length ? (
                aiInsights.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li>Insufficient data for insights.</li>
              )}
            </ul>
          </div>

          <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2">🥧 Sentiment Overview</h2>
            <div className="w-1/2 mx-auto">
              <SentimentPieChart articles={articles} />
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-green-400 mb-2">📌 Top Keywords by Sentiment</h2>
            <TopKeywordsTable articles={articles} />
          </div>

          <div className="my-6">
            <button
              onClick={handleDisinfoClick}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              🔍 Suspicious narrative? Go to Narrative Monitor
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="text-lg font-semibold mb-3">🗞️ Latest News on {company}</h2>
            {articles.length === 0 ? (
              <p className="text-gray-400">No news articles found.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {articles.map((a, i) => (
                  <li key={i} className="border-b pb-2">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {a.title}
                    </a>
                    <p className="text-gray-400">
                      {a.source.name} — {new Date(a.publishedAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyNewsDashboard;

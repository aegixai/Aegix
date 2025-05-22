import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const stopWords = new Set(["the", "and", "to", "of", "in", "a", "for", "on", "is", "with", "at", "by", "an", "as", "it", "from", "that", "this", "are", "was", "be"]);

const extractKeywords = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zא-ת0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));
};

const ProductSentimentDashboard = () => {
  const { companyId } = useParams();
  const [tweets, setTweets] = useState([]);
  const [query, setQuery] = useState(companyId || "Israel");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sentimentCounts, setSentimentCounts] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [timelineData, setTimelineData] = useState({});
  const [keywordsByTopic, setKeywordsByTopic] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const fetchTweets = async () => {
    try {
      const res = await axios.get(`/api/twitter/search?q=${encodeURIComponent(query.trim())}`);
      const allTweets = res.data.tweets || [];

      const filtered = allTweets.filter((t) => {
        const date = t.created_at?.split("T")[0];
        return (!startDate || date >= startDate) && (!endDate || date <= endDate) &&
          (!country || t.text.toLowerCase().includes(country.toLowerCase())) &&
          (!groupUsers.length || groupUsers.includes(t.author_id));
      });

      const sentimentMap = { positive: 0, neutral: 0, negative: 0 };
      const timeline = {};
      const topicMap = {};

      const enriched = filtered.map((t) => {
        const text = t.text.toLowerCase();
        const sentiment = text.includes("fail") || text.includes("loss") || text.includes("attack") ? "Negative"
          : text.includes("success") || text.includes("growth") || text.includes("win") ? "Positive"
          : "Neutral";

        sentimentMap[sentiment.toLowerCase()]++;

        const date = t.created_at?.split("T")[0];
        if (!timeline[date]) timeline[date] = { positive: 0, neutral: 0, negative: 0 };
        timeline[date][sentiment.toLowerCase()]++;

        const words = extractKeywords(text);
        words.forEach((w) => {
          if (!topicMap[w]) topicMap[w] = { positive: 0, neutral: 0, negative: 0 };
          topicMap[w][sentiment.toLowerCase()]++;
        });

        return { ...t, sentiment };
      });

      setTweets(enriched);
      setSentimentCounts(sentimentMap);
      setTimelineData(timeline);
      setKeywordsByTopic(topicMap);

      const aiRes = await axios.post("/api/ai/sentiment-summary", { tweets: enriched });
      setAiInsights(aiRes.data.insights || []);
    } catch (err) {
      console.error("⚠️ Twitter API or AI error:", err);
      const fallback = await axios.get("/data/mock_data/mock_tweets.json");
      setTweets(fallback.data || []);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [companyId]);

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [{
      label: "Sentiment",
      data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
      backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
    }],
  };

  const barData = {
    labels: Object.keys(timelineData).sort(),
    datasets: ["positive", "neutral", "negative"].map((s, i) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      data: Object.keys(timelineData).sort().map((d) => timelineData[d][s] || 0),
      backgroundColor: ["#22c55e", "#facc15", "#ef4444"][i],
    })),
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">📢 Product Sentiment Dashboard (Twitter)</h1>
        <button onClick={() => navigate(`/company-profile/${companyId}`)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">← Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Topic (e.g. Israel)" className="px-3 py-2 bg-gray-800 text-white rounded" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 bg-gray-800 text-white rounded" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 bg-gray-800 text-white rounded" />
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country/Region" className="px-3 py-2 bg-gray-800 text-white rounded" />
      </div>

      <div className="flex gap-2 mb-6">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search in tweets" className="px-3 py-2 bg-gray-800 text-white rounded w-64" />
        <input type="text" onBlur={(e) => setGroupUsers(e.target.value.split(",").map(v => v.trim()))} placeholder="User IDs (comma-separated)" className="px-3 py-2 bg-gray-800 text-white rounded" />
        <button onClick={fetchTweets} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-3">
            <h2 className="text-lg font-semibold mb-2">🥧 Sentiment Pie</h2>
            <div style={{ height: "180px" }}><Pie data={pieData} /></div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-3">
            <h2 className="text-lg font-semibold mb-2">📊 Sentiment Trend</h2>
            <div style={{ height: "180px" }}><Bar data={barData} /></div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="p-3">
          <h2 className="text-lg font-semibold text-green-400 mb-3">🧠 AI Insights</h2>
          <ul className="list-disc ml-6 text-sm text-gray-300">
            {aiInsights.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {Object.entries(keywordsByTopic)
          .sort((a, b) => (b[1].positive + b[1].neutral + b[1].negative) - (a[1].positive + a[1].neutral + a[1].negative))
          .slice(0, 12)
          .map(([word, counts]) => (
            <Card key={word} className="bg-gray-800 border border-gray-600 p-3">
              <h4 className="font-semibold text-white mb-1">{word}</h4>
              <p className="text-green-400">+ {counts.positive}</p>
              <p className="text-yellow-300">~ {counts.neutral}</p>
              <p className="text-red-400">- {counts.negative}</p>
            </Card>
          ))}
      </div>

      <div className="grid gap-3">
        {tweets
          .filter((t) => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((t, i) => {
            const sentimentColor =
              t.sentiment === "Positive" ? "text-green-400"
              : t.sentiment === "Negative" ? "text-red-400"
              : "text-yellow-300";
            return (
              <Card key={i} className="bg-gray-800 border border-gray-700">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🧾 @{t.author_id}</span>
                    <span className={sentimentColor}>Sentiment: {t.sentiment}</span>
                  </div>
                  <p className="text-white text-sm">💬 {t.text}</p>
                  <p className="text-gray-400 text-xs">📅 {t.created_at}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default ProductSentimentDashboard;
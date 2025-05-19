import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const NarrativeMonitor = () => {
  const [narratives, setNarratives] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    const fetchNarratives = async () => {
      try {
        const res = await axios.get("/api/narratives");
        const data = res.data.narratives || [];
        setNarratives(data);

        const aiRes = await axios.post("/api/ai/narrative-summary", {
          narratives: data,
        });
        setAiInsights(aiRes.data.insights || []);
      } catch (err) {
        console.error("Failed to fetch narratives:", err);
      }
    };
    fetchNarratives();
  }, []);

  const countBySentiment = () => {
    const counts = { critical: 0, neutral: 0, positive: 0 };
    narratives.forEach((n) => {
      const s = n.sentiment?.toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  };

  const sentimentData = () => {
    const { critical, neutral, positive } = countBySentiment();
    return {
      labels: ["Critical", "Neutral", "Positive"],
      datasets: [
        {
          data: [critical, neutral, positive],
          backgroundColor: ["#ef4444", "#facc15", "#22c55e"],
        },
      ],
    };
  };

  const timelineData = () => {
    const timeline = {};
    narratives.forEach((n) => {
      const date = n.date;
      const sentiment = n.sentiment?.toLowerCase();
      if (!timeline[date]) {
        timeline[date] = { critical: 0, neutral: 0, positive: 0 };
      }
      if (timeline[date][sentiment] !== undefined) {
        timeline[date][sentiment]++;
      }
    });
    const dates = Object.keys(timeline).sort();
    return {
      labels: dates,
      datasets: [
        {
          label: "Critical",
          data: dates.map((d) => timeline[d].critical),
          borderColor: "#ef4444",
        },
        {
          label: "Neutral",
          data: dates.map((d) => timeline[d].neutral),
          borderColor: "#facc15",
        },
        {
          label: "Positive",
          data: dates.map((d) => timeline[d].positive),
          borderColor: "#22c55e",
        },
      ],
    };
  };

  const topKeywordsBySentiment = () => {
    const counts = {
      critical: {},
      neutral: {},
      positive: {},
    };
    narratives.forEach((n) => {
      const sentiment = n.sentiment?.toLowerCase();
      const keywords = n.keywords || [];
      keywords.forEach((k) => {
        if (!counts[sentiment][k]) counts[sentiment][k] = 0;
        counts[sentiment][k]++;
      });
    });

    const top = {};
    Object.keys(counts).forEach((s) => {
      top[s] = Object.entries(counts[s])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    });
    return top;
  };

  const top = topKeywordsBySentiment();

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">🧠 Narrative Intelligence Monitor</h1>
        <Link to="/investigation-center" className="text-blue-400 hover:underline">
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="text-lg font-semibold text-yellow-300 mb-2">🍑 Narrative Type Breakdown</h2>
          <Pie data={sentimentData()} />
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="text-lg font-semibold text-cyan-300 mb-2">📈 Timeline Trend</h2>
          <Line data={timelineData()} />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-green-400 mb-3">🧩 Top Keywords by Sentiment</h2>
        <div className="grid grid-cols-3 gap-4">
          {["positive", "neutral", "critical"].map((s) => (
            <div key={s} className={`p-3 rounded border ${s === "positive" ? "border-green-500" : s === "neutral" ? "border-yellow-400" : "border-red-500"}`}>
              <h3 className="font-semibold mb-2 capitalize text-lg text-white">{s}</h3>
              {top[s].map(([word, count]) => (
                <div key={word} className="flex justify-between text-sm text-gray-300">
                  <span>{word}</span>
                  <span>×{count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-pink-400 mb-2">🤖 AI Narrative Insights</h2>
        {aiInsights.length > 0 ? (
          <ul className="list-disc ml-6 text-sm text-gray-200">
            {aiInsights.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Loading insights...</p>
        )}
      </div>
    </div>
  );
};

export default NarrativeMonitor;

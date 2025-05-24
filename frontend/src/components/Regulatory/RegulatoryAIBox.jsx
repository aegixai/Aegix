// ✅ RegulatoryAIBox.jsx – תיבת תובנות AI מבוססת מידע אמיתי עם fallback
import React, { useEffect, useState } from "react";
import axios from "axios";

const RegulatoryAIBox = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/data/regulatory_alerts.json");
        const data = await res.json();

        const formatted = Array.isArray(data) && data.length > 0
          ? data.map((item) => ({
              source: item.source || "Unknown Source",
              value: item.description || item.title || "No description"
            }))
          : [
              {
                source: "Fallback Source",
                value: "Example regulation or compliance signal."
              }
            ];

        const response = await axios.post("/api/ai/insights", {
          results: formatted
        });

        if (response.data?.recommendations) {
          setInsights(response.data.recommendations);
        } else {
          setInsights(["⚠️ No AI recommendations received."]);
        }
      } catch (err) {
        console.error("❌ Failed to load AI insights", err);
        setError("Unable to generate AI insights at this moment.");
        setInsights(["⚠️ Failed to load insights."]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-pink-400 mb-3">🤖 AI Regulatory Insights</h2>

      {loading ? (
        <p className="text-blue-300 animate-pulse">Loading AI insights...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ul className="list-disc ml-6 space-y-2 text-gray-200 text-sm">
          {insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegulatoryAIBox;

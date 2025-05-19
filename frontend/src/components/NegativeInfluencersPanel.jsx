import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const NegativeInfluencersPanel = () => {
  const [data, setData] = useState([]);
  const [aiSummary, setAiSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/data/negative_influencers.json");
        setData(res.data.users);

        const aiRes = await axios.post("/api/ai/user-summary", { users: res.data.users });
        setAiSummary(aiRes.data.insights || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.map((u) => u.username),
    datasets: [
      {
        label: "Negative Sentiment Score",
        data: data.map((u) => u.negative_score),
        backgroundColor: "rgba(239, 68, 68, 0.8)"
      }
    ]
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🚨 Negative Influencers Panel</h1>
        <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => window.history.back()}>
          ← Back
        </Button>
      </div>

      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-red-400 mb-4">📊 Top Negative Influencers</h2>
          <Bar data={chartData} />
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold text-yellow-300 mb-2">🧠 AI Insights</h2>
          <ul className="list-disc ml-6 text-sm text-gray-300">
            {aiSummary.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-700">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">📋 User Risk Table</h2>
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-600">
                <th className="px-2 py-1">Username</th>
                <th className="px-2 py-1">Platform</th>
                <th className="px-2 py-1">Risk Score</th>
                <th className="px-2 py-1">Mentions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="px-2 py-1">@{u.username}</td>
                  <td className="px-2 py-1">{u.platform}</td>
                  <td className="px-2 py-1 text-red-300">{u.risk_score}</td>
                  <td className="px-2 py-1">{u.mentions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NegativeInfluencersPanel;

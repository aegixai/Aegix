
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft } from "lucide-react";
import AddGroupPanel from "./AddGroupPanel";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GroupComparePanel = () => {
  const [allGroups, setAllGroups] = useState([
    "Crypto Watchdogs",
    "Token Hunters",
    "DeFi Explorers",
    "Altcoin Ninjas",
  ]);
  const [groups, setGroups] = useState(["Crypto Watchdogs", "Token Hunters"]);
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const handleGroupChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setGroups(selected);
  };

  const inferSectorFromDescription = (desc) => {
    const text = desc.toLowerCase();
    if (text.includes("crypto") || text.includes("token") || text.includes("defi")) return "Finance";
    if (text.includes("law") || text.includes("regulation") || text.includes("legal")) return "Regulatory";
    if (text.includes("politic") || text.includes("election") || text.includes("party")) return "Political";
    if (text.includes("journalism") || text.includes("media")) return "Media";
    if (text.includes("cyber") || text.includes("hacking")) return "Cyber";
    return "Other";
  };

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ai/group-compare-insight", {
        groups,
      });
      setChartData(res.data.chart);
      setInsights(res.data.insights || []);
      setRecommendations(res.data.recommendations || []);
      setAlerts(res.data.alerts || []);
    } catch (e) {
      console.error("Error fetching group compare data", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groups]);

  const data = {
    labels: chartData?.labels || [],
    datasets: chartData?.datasets || [],
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📊 Group Comparison Panel</h2>
        <div className="flex gap-3">
          <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500">
            <FileDown className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button onClick={() => window.history.back()} className="bg-gray-700 hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      <AddGroupPanel
        onAdd={(group) => {
          setAllGroups((prev) => [...prev, group.name]);
          const sector = inferSectorFromDescription(group.description);
          console.log("📌 New Group:", group.name, "| Sector:", sector);
        }}
      />

      <div>
        <label className="text-sm text-gray-300">Select Groups to Compare:</label>
        <select multiple className="bg-gray-800 border p-2 mt-1 rounded w-full" value={groups} onChange={handleGroupChange}>
          {allGroups.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <Card className="bg-gray-900 border border-gray-700 h-[200px] mt-6">
        <CardContent className="p-4 h-full">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">📉 Sentiment Score Comparison</h2>
          {chartData ? (
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
          ) : (
            <p>Loading chart...</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-gray-900 border border-gray-700 mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-300 mb-2">🧠 AI Insights</h3>
            <ul className="list-disc ml-6 text-sm text-gray-300 space-y-1">
              {insights.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-300 mb-2">✅ AI Recommendations</h3>
            <ul className="list-disc ml-6 text-sm text-green-200 space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold text-red-300 mb-2">🚨 AI Alerts</h3>
            <ul className="list-disc ml-6 text-sm text-red-200 space-y-1">
              {alerts.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupComparePanel;

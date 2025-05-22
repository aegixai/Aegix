import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ShodanIntelDashboard = () => {
  const [query, setQuery] = useState("8.8.8.8");
  const [type, setType] = useState("ip");
  const [result, setResult] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const navigate = useNavigate();

  const searchShodan = async () => {
    try {
      const res = await axios.get(`/api/shodan/${type}/${query}`);
      setResult(res.data);

      const aiRes = await axios.post("/api/ai/shodan-insight", {
        raw: res.data,
      });
      setAiSummary(aiRes.data.summary || "No AI summary available.");
    } catch (err) {
      console.error("Shodan search failed", err);
      setAiSummary("⚠️ Error fetching data from Shodan or AI");
    }
  };

  const getPortChartData = () => {
    if (!result?.ports || !Array.isArray(result.ports)) return null;
    const portCounts = {};
    result.ports.forEach((p) => {
      portCounts[p] = (portCounts[p] || 0) + 1;
    });

    return {
      labels: Object.keys(portCounts),
      datasets: [
        {
          label: "Open Ports",
          data: Object.values(portCounts),
          backgroundColor: "#6366f1",
        },
      ],
    };
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛰️ Shodan Intelligence Dashboard</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← חזרה
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <select
          className="bg-gray-800 px-2 py-2 rounded text-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="ip">🔍 IP Address</option>
          <option value="domain">🌐 Domain</option>
          <option value="org">🏢 Organization</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter IP, Domain, or Org"
          className="bg-gray-800 px-4 py-2 rounded text-white w-96"
        />
        <Button onClick={searchShodan}>Search</Button>
      </div>

      {result && (
        <>
          {getPortChartData() && (
            <Card className="bg-gray-900 border border-gray-700 mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">🔌 Open Ports</h2>
                <div className="h-[250px] w-full">
                  <Bar data={getPortChartData()} options={{ responsive: true }} />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900 border border-gray-700 mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-green-400 mb-2">
                🤖 AI Summary
              </h2>
              <p className="text-white">{aiSummary}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-700 mb-6">
            <CardContent className="p-4 space-y-2">
              <p>
                <strong>📍 Org:</strong> {result.org || "N/A"}
              </p>
              <p>
                <strong>🔐 Hostnames:</strong> {result.hostnames?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>📡 Domains:</strong> {result.domains?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>🌐 Link:</strong>{" "}
                <a
                  href={`https://www.shodan.io/host/${query}`}
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Shodan
                </a>
              </p>
              <p className="text-sm text-gray-400">
                <strong>🔎 Search Type:</strong> {type} <br />
                <strong>🔍 Query:</strong> {query}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ShodanIntelDashboard;

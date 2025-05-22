import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const ShodanIntelDashboard = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ip");
  const [data, setData] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      let endpoint = "";
      if (type === "ip") {
        endpoint = `/api/shodan/ip/${encodeURIComponent(query)}`;
      } else if (type === "domain") {
        endpoint = `/api/shodan/domain/${encodeURIComponent(query)}`;
      } else if (type === "org") {
        endpoint = `/api/shodan/org/${encodeURIComponent(query)}`;
      }

      const res = await axios.get(endpoint);
      setData(res.data);

      const ai = await axios.post("/api/ai/shodan-insight", { raw: res.data });
      setAiInsight(ai.data.summary || "No AI summary available.");
    } catch (err) {
      console.error("Shodan or AI API error:", err);
      setData(null);
      setAiInsight("Error fetching data");
    }
  };

  const getPieData = () => {
    if (!data?.ports) return null;
    const portCounts = {};
    data.ports.forEach((p) => {
      portCounts[p] = (portCounts[p] || 0) + 1;
    });

    return {
      labels: Object.keys(portCounts),
      datasets: [
        {
          label: "Open Ports",
          data: Object.values(portCounts),
          backgroundColor: [
            "#36A2EB", "#FF6384", "#FFCE56",
            "#4BC0C0", "#9966FF", "#F7464A",
          ],
        },
      ],
    };
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🛰 Shodan Intelligence Dashboard</h1>

      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-800 text-white px-2 py-1 rounded"
        >
          <option value="ip">IP</option>
          <option value="domain">Domain</option>
          <option value="org">Organization</option>
        </select>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter IP, domain, or org..."
          className="w-64"
        />
        <Button onClick={handleSearch}>🔍 Search</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      </div>

      {data && (
        <>
          <Card className="bg-gray-900 border border-gray-700 mb-6">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Shodan Data</h2>
              <pre className="text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-700 mb-6">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-green-400 mb-2">🧠 AI Insights</h2>
              <p className="text-gray-200 italic">{aiInsight}</p>
            </CardContent>
          </Card>

          {getPieData() && (
            <Card className="bg-gray-900 border border-gray-700 mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">📊 Port Distribution</h2>
                <div style={{ height: "250px" }}>
                  <Pie data={getPieData()} />
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ShodanIntelDashboard;

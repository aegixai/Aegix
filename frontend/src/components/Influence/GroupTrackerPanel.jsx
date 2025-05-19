import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { UserPlus, XCircle, FileDown } from "lucide-react";
import { Link } from "react-router-dom";

const GroupTrackerPanel = () => {
  const [groupName, setGroupName] = useState("Crypto Watchdogs");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState(["cryptoshark77", "darkbot99"]);
  const [sentimentData, setSentimentData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addUser = () => {
    if (username.trim() && !users.includes(username.trim())) {
      setUsers([...users, username.trim()]);
      setUsername("");
    }
  };

  const removeUser = (u) => {
    setUsers(users.filter((x) => x !== u));
  };

  const fetchSentiment = async () => {
    try {
      const res = await axios.post("/api/ai/group-sentiment", {
        group: users,
        from: startDate,
        to: endDate,
      });
      setSentimentData(res.data.trend);
      setAiInsights(res.data.insights || []);
    } catch (err) {
      console.error("Sentiment error:", err);
    }
  };

  useEffect(() => {
    fetchSentiment();
  }, [users, startDate, endDate]);

  const sentimentChart = {
    labels: sentimentData?.dates || [],
    datasets: [
      {
        label: "Group Sentiment Trend",
        data: sentimentData?.scores || [],
        borderColor: "#34d399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Group Tracker: {groupName}</h1>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => window.print()}>
            <FileDown className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="px-3 py-2 rounded bg-gray-800 text-white w-64"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={addUser} className="bg-blue-600 hover:bg-blue-500">
              <UserPlus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          <ul className="flex flex-wrap gap-3">
            {users.map((u, i) => (
              <li key={i} className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                @{u}
                <XCircle className="w-4 h-4 text-red-400 cursor-pointer" onClick={() => removeUser(u)} />
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm mb-1">Start Date:</label>
              <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date:</label>
              <input
                type="date"
                className="bg-gray-800 text-white px-3 py-2 rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-700 mb-6">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-green-300 mb-2">📈 Group Sentiment Trend</h2>
          {sentimentData ? <Line data={sentimentChart} /> : <p>Loading sentiment data...</p>}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-700">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-yellow-300 mb-2">🧠 AI Insights</h2>
          <ul className="list-disc ml-6 text-sm text-gray-300">
            {aiInsights.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupTrackerPanel;

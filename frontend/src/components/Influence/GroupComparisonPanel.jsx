import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GroupComparisonPanel = () => {
  const [groups, setGroups] = useState([]);
  const [platform, setPlatform] = useState("All");
  const [sector, setSector] = useState("All");
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-18");
  const [minSentiment, setMinSentiment] = useState(-1);
  const [aiInsight, setAiInsight] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups/compare", {
        params: { platform, sector, startDate, endDate, minSentiment },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("❌ Error fetching groups:", err);
    }
  };

  const fetchAIInsight = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ai/group-compare-insight", {
        platform,
        sector,
        startDate,
        endDate,
      });
      setAiInsight(res.data.insight || "No AI insight available.");
    } catch (err) {
      setAiInsight("AI insight unavailable.");
      console.error("❌ AI fetch error:", err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📊 Group Comparison Report", 14, 20);

    groups.forEach((group, index) => {
      doc.setFontSize(12);
      doc.text(`Group: ${group.name} (${group.platform})`, 14, 30 + index * 60);
      doc.autoTable({
        startY: 35 + index * 60,
        head: [["Username", "Sentiment"]],
        body: group.topNegativeInfluencers.map((u) => [u.username, u.sentiment]),
      });
    });

    doc.save("group_comparison_report.pdf");
  };

  useEffect(() => {
    fetchGroups();
    fetchAIInsight();
  }, [platform, sector, startDate, endDate, minSentiment]);

  const chartData = {
    labels: groups[0]?.sentimentTimeline.map((p) => p.date) || [],
    datasets: groups.map((group) => ({
      label: group.name,
      data: group.sentimentTimeline.map((p) => p.value),
      tension: 0.4,
      fill: false,
    })),
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white space-y-6">
      <h2 className="text-2xl font-bold">📊 Group Comparison Panel</h2>

      <div className="flex flex-wrap gap-4 items-center">
        <Select onChange={(e) => setPlatform(e.target.value)} defaultValue="All">
          <option value="All">All Platforms</option>
          <option value="Telegram">Telegram</option>
          <option value="Twitter">Twitter</option>
          <option value="Discord">Discord</option>
        </Select>
        <Select onChange={(e) => setSector(e.target.value)} defaultValue="All">
          <option value="All">All Sectors</option>
          <option value="Finance">Finance</option>
          <option value="Cyber">Cyber</option>
        </Select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-800 border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-800 border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={minSentiment}
          step="0.1"
          onChange={(e) => setMinSentiment(e.target.value)}
          className="w-32 bg-gray-800 border px-2 py-1 rounded"
          placeholder="Min Sentiment"
        />
      </div>

      <Card>
        <CardContent>
          <Line data={chartData} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <Card key={group.name}>
            <CardContent>
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-400">Platform: {group.platform}</p>
              <p className="text-sm text-gray-400">Sector: {group.sector}</p>
              <p className="text-sm">Avg Sentiment: {group.averageSentiment.toFixed(2)}</p>
              <p className="text-sm">Keywords: {group.keywords?.join(", ")}</p>
              <p className="mt-2 font-semibold">Top Negative Influencers:</p>
              <ul className="list-disc list-inside text-sm text-red-300">
                {group.topNegativeInfluencers?.map((user) => (
                  <li key={user.id}>
                    <Link to={`/user/${user.id}`} className="underline">
                      {user.username}
                    </Link>{" "}
                    (Sentiment: {user.sentiment})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <h3 className="font-semibold text-lg">🧠 AI Insight</h3>
          <p className="text-sm mt-2 whitespace-pre-line">{aiInsight}</p>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4">
        <button
          onClick={exportToPDF}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          ⬇ Export PDF
        </button>
        <Link
          to="/group-tracker"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          ← Back to Group Tracker
        </Link>
      </div>
    </div>
  );
};

export default GroupComparisonPanel;

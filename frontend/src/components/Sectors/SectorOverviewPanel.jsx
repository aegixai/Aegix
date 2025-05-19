
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SectorOverviewPanel = () => {
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ai/sector-overview");
      setChartData(res.data.chart);
      setInsights(res.data.insights || []);
      setRecommendations(res.data.recommendations || []);
      setAlerts(res.data.alerts || []);
    } catch (error) {
      console.error("Error loading sector data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: chartData?.labels || [],
    datasets: chartData?.datasets || [],
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white space-y-6">
      <h2 className="text-2xl font-bold">🏢 Sector Overview Panel</h2>

      <Card className="bg-gray-900 border border-gray-700">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">📊 Sector Sentiment Comparison</h3>
          {chartData ? <Bar data={data} options={{ responsive: true }} /> : <p>Loading chart...</p>}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border border-gray-700">
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
            {alerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorOverviewPanel;

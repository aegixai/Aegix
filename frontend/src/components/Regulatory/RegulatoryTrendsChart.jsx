import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const RegulatoryTrendsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredAlerts, setFilteredAlerts] = useState([]);

  useEffect(() => {
    fetch("/data/regulatory_trends_chart_data.json")
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("❌ Failed to load chart:", err));

    fetch("/data/regulatory_alerts.json")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("❌ Failed to load alerts:", err));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const matches = alerts.filter((a) => a.date === selectedDate);
      setFilteredAlerts(matches);
    } else {
      setFilteredAlerts([]);
    }
  }, [selectedDate, alerts]);

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    onClick: (event, elements) => {
      if (elements.length && chartData) {
        const idx = elements[0].index;
        const clickedDate = chartData.labels[idx];
        setSelectedDate(clickedDate);
      }
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "#444" } },
      y: { ticks: { color: "white" }, grid: { color: "#444" } },
    },
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">📊 Regulatory Trends Timeline</h2>

      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p className="text-gray-400">Loading chart...</p>
      )}

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            📅 Regulatory Events on {selectedDate}
          </h3>
          {filteredAlerts.length === 0 ? (
            <p className="text-gray-400">No regulatory alerts on this date.</p>
          ) : (
            <ul className="space-y-4">
              {filteredAlerts.map((alert, i) => (
                <li key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-bold mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-300">{alert.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Source: {alert.source} | Date: {alert.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default RegulatoryTrendsChart;

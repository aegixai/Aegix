import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const RegulatoryAlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch("/data/regulatory_alerts.json")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to load alerts:", err));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      alerts.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    );
  }, [search, alerts]);

  const toggle = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const riskColor = (level) => {
    switch (level) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-300";
      case "Low":
        return "text-green-300";
      default:
        return "text-gray-200";
    }
  };

  const exportCSV = () => {
    const rows = filtered.map(a => [
      a.title,
      a.source,
      a.date,
      a.risk_level,
      a.description
    ]);
    const csv = [
      ["Title", "Source", "Date", "Risk", "Description"],
      ...rows
    ].map(r => r.map(f => `"${f}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "regulatory_alerts.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Title", "Source", "Date", "Risk", "Description"]],
      body: filtered.map((a) => [
        a.title,
        a.source,
        a.date,
        a.risk_level,
        a.description,
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("regulatory_alerts.pdf");
  };

  return (
    <div className="p-4 space-y-4 bg-gray-900 rounded-lg shadow-md text-white">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center mb-4">
        <h2 className="text-xl font-bold">📜 Regulatory Alerts</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search alerts..."
          className="bg-gray-800 p-2 rounded text-white w-full sm:w-64 border border-gray-700"
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={exportCSV} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Export CSV</button>
        <button onClick={exportPDF} className="bg-green-600 px-4 py-2 rounded hover:bg-green-500">Export PDF</button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No alerts found.</p>
      ) : (
        filtered.map((alert, idx) => (
          <div
            key={idx}
            onClick={() => toggle(idx)}
            className="cursor-pointer bg-gray-800 rounded p-4 shadow hover:bg-gray-700 transition-all"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{alert.title}</h3>
              <span className={riskColor(alert.risk_level)}>{alert.risk_level}</span>
            </div>
            <p className="text-sm text-gray-400">Source: {alert.source} | Date: {alert.date}</p>
            {expanded[idx] && (
              <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RegulatoryAlertsPanel;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduledScanForm = () => {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const body = { address, date, time };
      await axios.post("http://localhost:5005/api/schedule-scan", body);
      setSubmitted(true);

      const newItem = {
        address,
        date,
        time,
        id: Date.now(),
      };
      const oldItems = JSON.parse(localStorage.getItem("scheduledScans") || "[]");
      const updated = [newItem, ...oldItems].slice(0, 5);
      localStorage.setItem("scheduledScans", JSON.stringify(updated));
      setHistory(updated);
    } catch (err) {
      alert("Error scheduling scan");
    }
  };

  useEffect(() => {
    const scans = JSON.parse(localStorage.getItem("scheduledScans") || "[]");
    setHistory(scans);
  }, []);

  return (
    <div className="flex justify-center bg-black text-white min-h-screen pt-10">
      <div className="w-full max-w-xl px-4 space-y-8">
        <h1 className="text-3xl font-bold">🗓️ Schedule Future Geo Scan</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Address:</label>
            <input
              type="text"
              placeholder="e.g. Azrieli, Tel Aviv"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded w-full"
          >
            ➕ Schedule Scan
          </button>
        </div>

        {submitted && (
          <div className="bg-green-900 border border-green-400 rounded p-4 space-y-2">
            <p className="text-green-300">✅ Scan scheduled successfully!</p>
            <p><b>📍 Address:</b> {address}</p>
            <p><b>📅 Date:</b> {date}</p>
            <p><b>⏰ Time:</b> {time}</p>
            <button
              onClick={() => navigate("/geo-report")}
              className="mt-2 bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              🔍 View Result
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">🕓 Recent Scheduled Scans</h3>
            {history.map((scan) => (
              <div
                key={scan.id}
                className="border border-gray-600 p-3 rounded bg-gray-800 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm"><b>📍 {scan.address}</b></p>
                  <p className="text-xs text-gray-400">📅 {scan.date} | ⏰ {scan.time}</p>
                </div>
                <button
                  onClick={() => navigate("/geo-report")}
                  className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledScanForm;

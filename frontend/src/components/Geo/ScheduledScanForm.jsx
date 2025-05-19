import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScheduledScanForm = () => {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSchedule = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5005/api/schedule-scan", {
        address,
        date,
        time,
      });
      if (response.status === 200) {
        setStatus({ success: true, data: { address, date, time } });
      } else {
        setStatus({ success: false });
      }
    } catch (err) {
      setStatus({ success: false });
    }
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🗓️ Schedule Future Geo Scan</h1>

      <div className="space-y-3">
        <div>
          <label className="text-sm">Address:</label>
          <input
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white mt-1"
            type="text"
            placeholder="e.g. Azrieli, Tel Aviv"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Date:</label>
          <input
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white mt-1"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Time:</label>
          <input
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white mt-1"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button
          className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded mt-2"
          onClick={handleSchedule}
        >
          ➕ Schedule Scan
        </button>
      </div>

      {status && status.success && (
        <div className="mt-4 p-4 bg-green-800 text-white rounded border border-green-500 space-y-2">
          <p>✅ Scan scheduled successfully!</p>
          <p>📍 <b>Address:</b> {status.data.address}</p>
          <p>📅 <b>Date:</b> {status.data.date}</p>
          <p>⏰ <b>Time:</b> {status.data.time}</p>
          <button
            onClick={() => navigate("/geo-report")}
            className="text-blue-300 underline mt-2"
          >
            🔍 View Result (if available)
          </button>
          <button
            onClick={() => navigate("/geo-search")}
            className="block text-sm text-gray-300 underline mt-1"
          >
            ← Back to Search
          </button>
        </div>
      )}

      {status && !status.success && (
        <p className="mt-4 text-red-400">❌ Error scheduling scan</p>
      )}
    </div>
  );
};

export default ScheduledScanForm;
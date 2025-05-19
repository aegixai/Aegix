import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeoSearchPanel = () => {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [radius, setRadius] = useState("1000");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const geocodeAddress = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      setLat(data[0].lat);
      setLon(data[0].lon);
    } else {
      alert("Address not found");
    }
  };

  const handleGenerateReport = async () => {
    if (!lat || !lon) {
      alert("Please provide valid coordinates.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5005/api/geo-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lon })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error: " + errorData.error);
        setLoading(false);
        return;
      }

      const users = await res.json();
      console.log("Received users:", users);
      navigate("/geo-report");
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to contact server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold">📍 Geo Search Panel</h1>

      <div className="space-y-4 bg-gray-800 p-4 rounded">
        <div>
          <label className="block text-sm mb-1">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="e.g. Rafah border crossing, Gaza"
          />
          <button
            onClick={geocodeAddress}
            className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            🔄 Convert to Coordinates
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Latitude:</label>
            <input
              type="text"
              value={lat}
              readOnly
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude:</label>
            <input
              type="text"
              value={lon}
              readOnly
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Radius (meters):</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleGenerateReport}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "🔄 Scanning..." : "🛰️ Generate Geo Report"}
      </button>
    </div>
  );
};

export default GeoSearchPanel;

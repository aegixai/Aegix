// ✅ RegulatoryWorldMap.jsx – מפת עולם עם רגולציות
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// 📌 פתרון בעיית Marker Icons ב־React + Leaflet
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RegulatoryWorldMap = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch("/data/regulatory_map_markers.json")
      .then((res) => res.json())
      .then((data) => setMarkers(data))
      .catch((err) => console.error("Failed to load map markers", err));
  }, []);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-white">🌍 Global Regulatory Map</h2>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]}>
            <Popup>
              <strong>{m.title}</strong>
              <br />
              {m.source} — {m.date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RegulatoryWorldMap;

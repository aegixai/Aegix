import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GeoUserProfileView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/data/geo_users.json")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((u) => String(u.id) === String(id));
        setUser(match);
      });
  }, [id]);

  if (!user) return <p className="p-6 text-white">Loading...</p>;

  const position = [user.location?.lat || 32.0728, user.location?.lon || 34.779];

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="p-6 bg-black text-white min-h-screen space-y-10">
      <h1 className="text-3xl font-bold">📱 Telegram User Profile</h1>

      <div className="bg-gray-800 p-4 rounded shadow space-y-2">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p><strong>Username:</strong> @{user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Distance from event:</strong> {user.distance_m || "?"} meters</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📍 Estimated Location</h3>
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={markerIcon}>
            <Popup>{user.name}'s Position</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">🧠 Behavioral & Sentiment (coming soon)</h3>
        <p className="text-sm text-gray-300">
          This panel will show the user's tone, language use, hostility, and key themes in monitored groups.
        </p>
      </div>

      <div>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default GeoUserProfileView;

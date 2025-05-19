import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserGeoHeatmap = () => {
  const [showMarkers, setShowMarkers] = useState(true);
  const [users, setUsers] = useState([]);
  const center = [32.0728, 34.7790];

  useEffect(() => {
    fetch("/data/geo_users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Failed to load users:", err);
        setUsers([]);
      });
  }, []);

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const radiusCircles = [500, 1000, 1500, 2000, 3000];

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showMarkers}
          onChange={() => setShowMarkers(!showMarkers)}
        />
        <span>Show users on map</span>
      </label>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {radiusCircles.map((radius, idx) => (
          <Circle
            key={idx}
            center={center}
            radius={radius}
            pathOptions={{ color: "purple", dashArray: "4" }}
          />
        ))}

        <Marker position={center} icon={markerIcon}>
          <Popup>Center Point</Popup>
        </Marker>

        {showMarkers &&
          users.map((user) => {
            const lat = user.location?.lat || user.lat;
            const lon = user.location?.lon || user.lon;
            if (!lat || !lon) return null;
            return (
              <Marker
                key={user.id}
                position={[lat, lon]}
                icon={markerIcon}
              >
                <Popup>
                  <strong>{user.name}</strong>
                  <br />
                  @{user.username}
                  <br />
                  {user.phone}
                  <br />
                  {user.distance_m || user.distance}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default UserGeoHeatmap;

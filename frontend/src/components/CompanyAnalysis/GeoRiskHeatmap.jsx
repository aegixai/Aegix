import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GeoRiskHeatmap = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("/data/mock_company.json")
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []));
  }, []);

  const getColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "orange";
    return "green";
  };

  const getRadius = (risk) => {
    if (risk === "High") return 50000;
    if (risk === "Medium") return 40000;
    return 10000;
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">🌍 Geographic Risk Heatmap</h1>
      <MapContainer
        center={[40, 0]}
        zoom={2}
        style={{ height: "600px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {employees.map((emp, index) => (
          <Circle
            key={index}
            center={[emp.lat, emp.lng]}
            pathOptions={{ color: getColor(emp.risk), fillColor: getColor(emp.risk), fillOpacity: 0.6 }}
            radius={getRadius(emp.risk)}
          >
            <Popup>
              <div>
                <strong>{emp.name}</strong><br />
                Role: {emp.role}<br />
                Risk: <span style={{ color: getColor(emp.risk) }}>{emp.risk}</span>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeoRiskHeatmap;

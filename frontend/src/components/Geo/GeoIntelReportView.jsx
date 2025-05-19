import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserGeoHeatmap from "./UserGeoHeatmap";
import NearbyUsersTable from "./NearbyUsersTable";
import NearbyGroupsTable from "./NearbyGroupsTable";
import ExportGeoReportButton from "./ExportGeoReportButton";
import TranslateReportButton from "./TranslateReportButton";

const GeoIntelReportView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/geo_users.json")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load geo_users.json", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-white bg-gray-900">
        <p>Loading geo report...</p>
      </div>
    );
  }

  return (
    <div id="geo-report" className="p-4 space-y-4 bg-gray-900 text-white">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">🌍 Geo Intelligence Report</h1>
      <TranslateReportButton />
      <UserGeoHeatmap users={users} />
      <NearbyUsersTable users={users} />
      <NearbyGroupsTable />
      <ExportGeoReportButton />
    </div>
  );
};

export default GeoIntelReportView;

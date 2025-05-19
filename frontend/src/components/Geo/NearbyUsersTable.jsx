import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NearbyUsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/data/geo_users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const getDistanceRange = (distance) => {
    if (distance <= 500) return "0–500m";
    if (distance <= 1000) return "501–1000m";
    if (distance <= 1500) return "1001–1500m";
    if (distance <= 2000) return "1501–2000m";
    return "2001–3000m";
  };

  const grouped = users.reduce((acc, user) => {
    const range = getDistanceRange(user.distance_m || user.distance || 0);
    if (!acc[range]) acc[range] = [];
    acc[range].push(user);
    return acc;
  }, {});

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-white">Nearby Users (Grouped by Distance)</h2>
      {Object.entries(grouped).map(([range, group], i) => (
        <div key={i} className="mb-4">
          <h3 className="font-bold text-white mb-1">{range}</h3>
          <table className="min-w-full text-sm mb-2">
            <thead>
              <tr className="text-left text-gray-400">
                <th>Name</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Distance</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {group.map((user) => (
                <tr key={user.id} className="text-white">
                  <td className="py-1">{user.name}</td>
                  <td className="py-1">@{user.username}</td>
                  <td className="py-1">{user.phone}</td>
                  <td className="py-1">{user.distance_m || user.distance}</td>
                  <td className="py-1">
                    <Link
                      to={`/geo-user/${user.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default NearbyUsersTable;

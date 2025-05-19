import React, { useEffect, useState } from "react";

const NearbyGroupsTable = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("/data/nearby_groups.json")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error("Failed to load groups:", err));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Detected Groups</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400">
            <th>Group Name</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index} className="text-white">
              <td className="py-1">{group.group_name}</td>
              <td className="py-1">{group.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NearbyGroupsTable;

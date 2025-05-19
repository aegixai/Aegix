import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NegativeInfluencersPanel = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/data/real_users/negative_influencers.json");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch influencers data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚨 Negative Influencers</h1>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => window.print()}>
            📤 Export Intelligence Report
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border border-gray-700">
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600">
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3">Followers</th>
                <th className="py-2 px-3">Risk Score</th>
                <th className="py-2 px-3">Top Topics</th>
                <th className="py-2 px-3">Profile</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="py-2 px-3 font-semibold text-cyan-400">@{u.username}</td>
                  <td className="py-2 px-3">{u.followers}</td>
                  <td className="py-2 px-3 text-red-400 font-semibold">{u.risk_score}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1">
                      {u.top_topics.map((topic, idx) => (
                        <span key={idx} className="bg-gray-700 px-2 py-1 rounded text-white">{topic}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Button
                      className="bg-gray-800 hover:bg-gray-700 text-white text-xs"
                      onClick={() => navigate(`/user-profile/${u.username}`)}
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NegativeInfluencersPanel;

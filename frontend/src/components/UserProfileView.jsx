// קובץ: UserProfileView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const UserProfileView = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [aiSummary, setAiSummary] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const path = `/data/real_users/user_${username}.json`;
        const res = await axios.get(path);
        setUser(res.data);

        const aiRes = await axios.post("/api/ai/user-summary", { user: res.data });
        setAiSummary(aiRes.data.insights || []);
      } catch (err) {
        console.error("Error fetching user data", err);
        setError("Failed to load user profile.");
      }
    };

    fetchUserData();
  }, [username]);

  if (error) {
    return <div className="bg-black text-red-500 p-6 min-h-screen flex items-center justify-center">{error}</div>;
  }

  if (!user) {
    return <div className="bg-black text-white p-6 min-h-screen flex items-center justify-center">🔄 Loading user profile...</div>;
  }

  const activityData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Posts per Day",
        data: user.weekly_activity,
        fill: true,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-300 mb-8">👤 פרופיל משתמש: {user.username}</h1>

      <Card className="bg-gray-900 border border-gray-700 max-w-4xl mx-auto mb-8">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={user.profile_image}
              alt={user.username}
                className="w-15 h-15 rounded-lg object-cover border border-gray-500"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">@{user.username}</p>
              {user.joined && <p className="text-sm text-gray-500">📅 הצטרף: {user.joined}</p>}
            </div>
          </div>

          {user.bio && <p className="text-gray-300">{user.bio}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
            {user.email && <div>📧 {user.email}</div>}
            {user.phone && <div>📞 {user.phone}</div>}
            {user.location && <div>📍 {user.location}</div>}
            {user.followers !== undefined && <div>📈 עוקבים: {user.followers}</div>}
            {user.following !== undefined && <div>📉 עוקב אחרי: {user.following}</div>}
            {user.risk_score !== undefined && user.risk_level && (
              <div>
                🧠 רמת סיכון: <span className="text-red-400">{user.risk_score}</span> ({user.risk_level})
              </div>
            )}
            {user.engagement_score !== undefined && (
              <div>⭐ מדד מעורבות: {user.engagement_score}/100</div>
            )}
          </div>

          {user.risk_reason && (
            <div>
              <h3 className="font-semibold text-red-400 mt-6">⚠️ סיבת סיכון</h3>
              <p className="text-sm text-gray-300">{user.risk_reason}</p>
            </div>
          )}

          {user.linked_platforms && (
            <div>
              <h3 className="font-semibold text-yellow-300 mt-6">🔗 פלטפורמות מקושרות</h3>
              <ul className="list-disc ml-6 text-sm text-gray-300">
                {user.linked_platforms.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {user.top_topics && (
            <div>
              <h3 className="font-semibold text-green-300 mt-6">🧩 נושאים מובילים</h3>
              <ul className="flex flex-wrap gap-2 text-sm text-white">
                {user.top_topics.map((t, i) => (
                  <span key={i} className="bg-gray-700 px-3 py-1 rounded-full">{t}</span>
                ))}
              </ul>
            </div>
          )}

          {user.geo_activity && (
            <div>
              <h3 className="font-semibold text-cyan-400 mt-6">🌍 פעילות גיאוגרפית</h3>
              <ul className="flex flex-wrap gap-2 text-sm text-white">
                {user.geo_activity.map((loc, i) => (
                  <span key={i} className="bg-gray-700 px-3 py-1 rounded-full">{loc}</span>
                ))}
              </ul>
            </div>
          )}

          {user.wallet_tags && (
            <div>
              <h3 className="font-semibold text-pink-400 mt-6">💼 תגיות ארנק</h3>
              <ul className="list-disc ml-6 text-sm text-gray-300">
                {user.wallet_tags.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {user.connections && (
            <div>
              <h3 className="font-semibold text-blue-300 mt-6">🕸️ חיבורים</h3>
              <ul className="list-disc ml-6 text-sm text-gray-300">
                {user.connections.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          {user.externalLinks && (
            <div>
              <h3 className="font-semibold text-lime-300 mt-6">🌐 קישורים חיצוניים</h3>
              <ul className="list-disc ml-6 text-sm text-gray-300">
                {user.externalLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {user.weekly_activity && (
            <div>
              <h3 className="font-semibold text-indigo-300 mt-8">📊 גרף פעילות שבועי</h3>
              <Line data={activityData} />
            </div>
          )}

          {aiSummary.length > 0 && (
            <div>
              <h3 className="font-semibold text-amber-400 mt-8">🧠 תובנות AI</h3>
              <ul className="list-disc ml-6 text-sm text-gray-300">
                {aiSummary.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-500 w-full">📤 ייצוא דו"ח</Button>
            <Button className="bg-gray-700 hover:bg-gray-600 w-full" onClick={() => navigate(-1)}>
              ← חזרה
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileView;

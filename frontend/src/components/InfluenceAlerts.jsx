import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const InfluenceAlerts = () => {
  const alerts = [
    { user: "user_22", message: "Suspicious coordinated messaging", severity: "high" },
    { user: "group_88", message: "Unusual increase in activity", severity: "medium" },
    { user: "user_07", message: "Spreading disinformation", severity: "high" },
    { user: "group_43", message: "Low trust score group emerging", severity: "low" },
  ];

  const severityStyle = (level) => {
    switch (level) {
      case "high":
        return "bg-red-900 text-red-300";
      case "medium":
        return "bg-yellow-900 text-yellow-300";
      case "low":
        return "bg-green-900 text-green-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <Card className="p-6">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold">🚨 Influence Alerts</h2>
        <ul className="space-y-3">
          {alerts.map((alert, idx) => (
            <li
              key={idx}
              className={`p-4 rounded border shadow-sm flex justify-between items-start ${severityStyle(alert.severity)}`}
            >
              <div>
                <p className="font-semibold">{alert.user}</p>
                <p className="text-sm">{alert.message}</p>
              </div>
              <Badge color="bg-gray-800">{alert.severity.toUpperCase()}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InfluenceAlerts;
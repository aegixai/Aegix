import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import alerts from "@/data/all_sectors_alerts.json";

const LiveAlertsPanel = () => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <h3 className="text-xl font-bold text-red-500">🚨 Live Alerts</h3>
        <ul className="list-disc ml-6 space-y-1">
          {alerts.map((alert, index) => (
            <li key={index}>
              <strong>{alert.sector}</strong>: {alert.message} ({alert.time})
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LiveAlertsPanel;

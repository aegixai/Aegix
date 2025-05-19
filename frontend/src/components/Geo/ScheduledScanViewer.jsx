import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const ScheduledScanViewer = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5005/api/scheduled-scans")
      .then((res) => res.json())
      .then((data) => setScans(data))
      .catch((err) => console.error("Failed to fetch scheduled scans", err));
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📅 Upcoming Scheduled Scans</h1>

      {scans.length === 0 ? (
        <p className="text-gray-400">No scans scheduled.</p>
      ) : (
        <div className="space-y-4">
          {scans.map((scan, index) => (
            <Card key={index} className="bg-gray-800 text-white border border-gray-700">
              <CardContent className="p-4 space-y-2">
                <p><strong>📍 Address:</strong> {scan.address}</p>
                <p><strong>📅 Date:</strong> {scan.date}</p>
                <p><strong>⏰ Time:</strong> {scan.time}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledScanViewer;

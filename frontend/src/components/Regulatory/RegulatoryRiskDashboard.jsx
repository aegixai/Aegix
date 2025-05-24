// ✅ RegulatoryRiskDashboard.jsx – Unified & Updated Main View for Regulatory Intelligence
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RegulatoryAIBox from "./RegulatoryAIBox";
import RegulatoryFilterSidebar from "./RegulatoryFilterSidebar";
import RegulatoryTrendsChart from "./RegulatoryTrendsChart";
import RegulatoryWorldMap from "./RegulatoryWorldMap";
import RegulatoryAlertsPanel from "./RegulatoryAlertsPanel";
import RegulatoryExportPDF from "./RegulatoryExportPDF";

const RegulatoryRiskDashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">⚖️ Regulatory Intelligence Dashboard</h1>

      {/* 🔍 תובנות AI */}
      <RegulatoryAIBox />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 📂 סרגל צד לסינון לפי תחום או אזור */}
        <div className="lg:col-span-1">
          <RegulatoryFilterSidebar />
        </div>

        {/* 📈 אזור התוכן */}
        <div className="lg:col-span-3 space-y-6">
          {/* מגמות רגולציה לאורך זמן */}
          <RegulatoryTrendsChart />

          {/* מפת העולם עם נקודות רגולציה */}
          <RegulatoryWorldMap />

          {/* הסבר כללי וייצוא PDF */}
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-300 mb-4">
                Monitoring ongoing legislative updates, regulatory signals, and compliance risk triggers across jurisdictions.
              </p>
              <RegulatoryExportPDF />
            </CardContent>
          </Card>

          {/* כרטיסי ההתראות */}
          <Card>
            <CardContent className="p-6">
              <RegulatoryAlertsPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryRiskDashboard;

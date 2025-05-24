// ✅ RegulatoryExportPDF.jsx – כפתור להורדת רגולציות כ-PDF
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RegulatoryExportPDF = () => {
  const handleExport = async () => {
    try {
      const res = await fetch("/data/regulatory_alerts.json");
      const data = await res.json();

      const doc = new jsPDF();
      doc.text("Regulatory Alerts Report", 14, 14);
      const tableData = data.map((alert) => [
        alert.title,
        alert.source,
        alert.date,
        alert.description.slice(0, 100) + "...",
      ]);

      doc.autoTable({
        head: [["Title", "Source", "Date", "Summary"]],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
      });

      doc.save("regulatory_alerts.pdf");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
    >
      📥 Export Regulatory Alerts to PDF
    </button>
  );
};

export default RegulatoryExportPDF;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const IntelReportView = () => {
  const [entries, setEntries] = useState([]);
  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/api/reports/view");
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to load report:", err);
      }
    };
    fetchReport();
  }, []);

  const handleExportToPDF = () => {
    if (entries.length === 0) {
      alert("אין תוכן לייצוא");
      return;
    }
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("intel_image_report.pdf");
    });
  };

  return (
    <Card className="max-w-6xl mx-auto p-6 mt-10 bg-zinc-900 text-white shadow-xl rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-2">📄 דוח בדיקות מקוריות</h2>

        <Button
          variant="ghost"
          className="text-sm text-zinc-400 hover:text-white mb-4"
          onClick={() => window.history.back()}
        >
          ← חזור לדף הקודם
        </Button>

        <Button
          onClick={handleExportToPDF}
          className="mb-4 ml-4"
        >
          📄 ייצוא PDF
        </Button>

        {entries.length === 0 ? (
          <p className="text-zinc-400">אין נתונים להצגה עדיין.</p>
        ) : (
          <div ref={reportRef} className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-zinc-300">
              <thead className="text-xs uppercase border-b border-zinc-700">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">תמונה</th>
                  <th className="px-2 py-2">מקור</th>
                  <th className="px-2 py-2">תוצאה</th>
                  <th className="px-2 py-2">ציון</th>
                  <th className="px-2 py-2">תאריך</th>
                  <th className="px-2 py-2">הרחבת סריקה</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item, idx) => (
                  <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800">
                    <td className="px-2 py-2">{idx + 1}</td>
                    <td className="px-2 py-2">
                      <img
                        src={`http://localhost:5000/uploads/${item.source}`}
                        alt="preview"
                        className="h-6 w-auto rounded shadow"
                      />
                    </td>
                    <td className="px-2 py-2">{item.source}</td>
                    <td className="px-2 py-2">{item.result}</td>
                    <td className="px-2 py-2">{item.score}</td>
                    <td className="px-2 py-2">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : "—"}
                    </td>
                    <td className="px-2 py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/reverse-search?image=${item.source}`)}
                      >
                        🔍 הרחבת סריקה
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelReportView;

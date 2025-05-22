import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// ודא שהקומפוננטות הללו קיימות בנתיבים אלו בפרויקט שלך
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // ודא ש-Badge מיוצא כ-named export
import { Skeleton } from "@/components/ui/skeleton"; // ודא ש-Skeleton קיים
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// רישום קומפוננטות Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const LegalExposurePanel = () => {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [focusTerms, setFocusTerms] = useState([]);
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(null); // מצב שגיאה
  const navigate = useNavigate();

  // אפקט לטעינת focusTerms מפרמטרי ה-URL
  useEffect(() => {
    const focusParam = searchParams.get("focus");
    const terms = focusParam ? focusParam.split(",") : [];
    setFocusTerms(terms);
  }, [searchParams]);

  // אפקט לטעינת נתונים
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // שימו לב: החלף את ה-URL ל-API האמיתי שלך
        const res = await axios.get(`https://api.example.com/legal/${companyId}`);
        const data = res.data || [];
        setCases(data);
        // פילטור התיקים על בסיס focusTerms
        if (focusTerms.length === 0) {
          setFilteredCases(data);
        } else {
          const filtered = data.filter((c) =>
            focusTerms.some((term) =>
              c.description?.toLowerCase().includes(term.toLowerCase())
            )
          );
          setFilteredCases(filtered);
        }
      } catch (err) {
        console.warn("Failed to load live legal data, using mock fallback.");
        setError("Failed to fetch data from API. Loading fallback data.");
        try {
          // ודא שהקובץ legal_cases.json קיים בתיקייה public/data/legal
          const fallback = await fetch("/data/legal/legal_cases.json");
          const data = await fallback.json();
          setCases(data);
          // פילטור התיקים על בסיס focusTerms גם בנתוני הפולבק
          if (focusTerms.length === 0) {
            setFilteredCases(data);
          } else {
            const filtered = data.filter((c) =>
              focusTerms.some((term) =>
                c.description?.toLowerCase().includes(term.toLowerCase())
              )
            );
            setFilteredCases(filtered);
          }
        } catch (fallbackError) {
          console.error("Failed to load fallback data:", fallbackError);
          setError("Failed to load any data. Please check your network and data sources.");
          setCases([]); // נקה נתונים אם גם הפולבק נכשל
          setFilteredCases([]);
        }
      } finally {
        setLoading(false); // סיים מצב טעינה
      }
    };
    fetchData();
  }, [companyId, focusTerms]);

  // פונקציה לייצוא PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Legal Exposure for ${companyId}`, 14, 20); // כותרת ה-PDF
    autoTable(doc, {
      startY: 30,
      head: [["Type", "Description", "Status", "Exposure", "Date"]], // כותרות טבלה
      body: filteredCases.map((c) => [ // נתוני טבלה
        c.type || "", c.description || "", c.status || "", c.exposure || "", c.date || "",
      ]),
      styles: {
        font: "sans-serif",
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [30, 41, 59], // צבע רקע לכותרות הטבלה (bg-gray-800 ב-RGB)
        textColor: [255, 255, 255]
      },
      altRowStyles: {
        fillColor: [30, 41, 59] // צבע רקע לשורות מתחלפות (bg-gray-800 ב-RGB)
      },
      theme: 'grid'
    });
    doc.save(`${companyId}_legal_exposure.pdf`); // שם קובץ ה-PDF
  };

  // פונקציה להכנת נתונים לתרשים העוגה
  const getPieData = () => {
    const typeCounts = {};
    filteredCases.forEach((c) => {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });

    // הרחבת מערך הצבעים למגוון גדול יותר
    const colors = [
      "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF", "#F7464A",
      "#E67E22", "#2ECC71", "#7F8C8D", "#9B59B6", "#3498DB", "#C0392B",
      "#1ABC9C", "#D35400", "#F1C40F", "#8E44AD"
    ];

    return {
      labels: Object.keys(typeCounts),
      datasets: [{
        label: "# תיקים",
        data: Object.values(typeCounts),
        backgroundColor: Object.keys(typeCounts).map((_, i) => colors[i % colors.length]), // שימוש חוזר בצבעים אם יש יותר סוגים מצבעים
        borderColor: "rgba(255,255,255,0.8)",
        borderWidth: 1,
      }],
    };
  };

  // פונקציה לבחירת וריאנט התגית (Badge) לפי סטטוס
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Open":
        return "destructive"; // אדום
      case "InProgress":
        // ודא שווריאנט 'warning' מוגדר ב-Badge שלך (או השתמש ב-className ישירות)
        return "warning"; // כתום/צהוב
      case "Closed":
        // ודא שווריאנט 'success' מוגדר ב-Badge שלך (או השתמש ב-className ישירות)
        return "success"; // ירוק
      default:
        return "secondary"; // ברירת מחדל
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* כותרת הדף */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 flex items-center gap-3">
          <span className="text-blue-400">⚖️</span> Legal Exposure: {companyId}
        </h1>

        {/* כפתורי ניווט וייצוא */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/company-profile/${companyId}`)}
            className="text-white border-gray-700 hover:bg-gray-800 transition-colors"
          >
            ← חזור לפרופיל החברה
          </Button>
          <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700 transition-colors">
            📤 ייצוא PDF
          </Button>
        </div>

        {/* הצגת פילטרים פעילים (אם ישנם) */}
        {focusTerms.length > 0 && (
          <div className="mb-6 flex items-center flex-wrap gap-2">
            <span className="text-gray-400 text-lg">Filtered by:</span>
            {focusTerms.map((term) => (
              <Badge key={term} variant="outline" className="bg-blue-900 text-blue-200 border-blue-700">
                {term}
              </Badge>
            ))}
          </div>
        )}

        {/* מצבי טעינה/שגיאה/נתונים */}
        {loading ? (
          // שלד טעינה (Skeleton Loader)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-gray-700 mb-2" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          // הודעת שגיאה
          <div className="bg-red-900 text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          // הצגת נתונים כאשר אין שגיאה והטעינה הסתיימה
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* סעיף תרשים העוגה */}
            <Card className="lg:col-span-1 bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Case Type Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[300px] p-4">
                {filteredCases.length > 0 && Object.keys(getPieData().labels).length > 0 ? (
                  <Pie data={getPieData()} options={{ maintainAspectRatio: false, responsive: true }} />
                ) : (
                  <p className="text-gray-400 text-center">No data available to display chart.</p>
                )}
              </CardContent>
            </Card>

            {/* סעיף רשימת התיקים המשפטיים */}
            <div className="lg:col-span-2">
              {filteredCases.length > 0 ? (
                <div className="grid gap-6">
                  {filteredCases.map((c, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800 border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl font-bold text-blue-300">{c.type || "N/A"}</CardTitle>
                          <Badge className={getStatusBadgeVariant(c.status)}>
                            {c.status || "Unknown"}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">📅 {c.date || "N/A"}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-200 text-base mb-3">{c.description || "No description provided."}</p>
                        <div className="grid grid-cols-2 gap-2 text-gray-400 text-sm mb-3">
                          <p><strong>Exposure:</strong> <span className="text-red-300">{c.exposure || "N/A"}</span></p>
                          <p><strong>Notes:</strong> {c.notes || "No notes."}</p>
                        </div>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-400 underline transition-colors"
                          >
                            🔗 View Original Source
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // הודעה כאשר אין תיקים משפטיים לאחר פילטור
                <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400 border border-gray-700">
                  <p>No legal cases found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalExposurePanel;
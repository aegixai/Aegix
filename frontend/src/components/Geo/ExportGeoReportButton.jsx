import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportGeoReportButton = () => {
  const exportToPDF = async () => {
    const reportElement = document.getElementById("geo-report");
    if (!reportElement) return alert("Report not found.");

    // Backup styles
    const originalBg = reportElement.style.backgroundColor;
    const originalColor = reportElement.style.color;

    // Temporary visual adjustments for print
    reportElement.style.backgroundColor = "#ffffff";
    reportElement.style.color = "#000000";

    // Hide elements you don't want in PDF
    const buttons = reportElement.querySelectorAll("button, select");
    buttons.forEach(btn => btn.style.display = "none");

    // Create PDF
    const canvas = await html2canvas(reportElement, {
      useCORS: true,
      scale: 2,
      scrollY: -window.scrollY
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Header
    pdf.setFontSize(14);
    pdf.text("AEGIX Geo Intelligence Report", 14, 15);
    pdf.setFontSize(10);
    pdf.text("Generated on: " + new Date().toLocaleString(), 14, 22);
    pdf.addImage(imgData, "PNG", 10, 30, pdfWidth - 20, pdfHeight - 40);

    pdf.save("AEGIX_Geo_Report.pdf");

    // Restore visibility and styles
    buttons.forEach(btn => btn.style.display = "");
    reportElement.style.backgroundColor = originalBg;
    reportElement.style.color = originalColor;
  };

  return (
    <button
      onClick={exportToPDF}
      className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      📄 Export to PDF
    </button>
  );
};

export default ExportGeoReportButton;

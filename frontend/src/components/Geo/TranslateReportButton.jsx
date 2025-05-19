import React from "react";

const TranslateReportButton = () => {
  const translateAll = (lang) => {
    alert("Translation to " + lang + " is not implemented yet in frontend.");
  };

  return (
    <div className="mb-4">
      <label className="mr-2">🌐 Translate to:</label>
      <select onChange={(e) => translateAll(e.target.value)} className="bg-gray-700 text-white p-2 rounded">
        <option value="en">English</option>
        <option value="he">עברית</option>
        <option value="ar">العربية</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
};

export default TranslateReportButton;

// ✅ RegulatoryFilterSidebar.jsx – סיידבר סינון לפי קטגוריה
import React from "react";

const categories = [
  "All",
  "AI",
  "Finance",
  "Privacy",
  "Environment",
  "Cybersecurity",
  "Healthcare",
  "Taxation",
];

const RegulatoryFilterSidebar = ({ selected, onFilterChange }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md w-64">
      <h2 className="text-lg font-semibold text-white mb-3">📂 Filter by Category</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onFilterChange(cat)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors 
                ${selected === cat ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegulatoryFilterSidebar;

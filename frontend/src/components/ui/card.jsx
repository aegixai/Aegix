// 📁 /src/components/ui/card.jsx
import React from "react";

export const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-gray-900 text-white shadow ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }) => (
  <div className={`border-b px-4 py-2 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-xl font-semibold text-white">{children}</h3>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`px-4 py-3 ${className}`}>
    {children}
  </div>
);

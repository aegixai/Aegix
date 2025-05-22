import React from "react";
import clsx from "clsx";

const badgeVariants = {
  default: "bg-gray-700 text-white",
  outline: "border border-gray-500 text-white",
  destructive: "bg-red-600 text-white",
  warning: "bg-yellow-500 text-black",
  success: "bg-green-600 text-white",
  secondary: "bg-gray-600 text-white",
};

export const Badge = ({ children, className = "", variant = "default" }) => {
  return (
    <span
      className={clsx(
        "text-xs font-medium px-2 py-1 rounded inline-block",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
    >
      {children}
    </span>
  );
};

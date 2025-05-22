import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  );
};

export { Skeleton };

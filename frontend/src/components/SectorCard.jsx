import React from "react";

const SectorCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default SectorCard;

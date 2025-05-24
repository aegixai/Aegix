import React from "react";

const Separator = ({ className = "" }) => {
  return (
    <div className={"w-full h-px bg-gray-700 my-4 " + className} />
  );
};

export { Separator };

"use client";

import React from "react";

interface HeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {description && (
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;

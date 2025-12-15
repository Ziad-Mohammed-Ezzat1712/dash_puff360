import React from "react";

export default function Overview() {
  const stats = [
    { title: "Total Sales", value: "$12,430" },
    { title: "Orders", value: "124" },
    { title: "Customers", value: "89" },
    { title: "Products", value: "57" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <h3 className="text-gray-500 text-sm">{s.title}</h3>
            <p className="text-2xl font-bold text-cyan-600 mt-2">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

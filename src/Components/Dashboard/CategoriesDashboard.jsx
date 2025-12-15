import React, { useState } from "react";

export default function CategoriesDashboard() {
  const [categories] = useState([
    { id: 1, name: "E-Liquids", products: 24 },
    { id: 2, name: "Vape Devices", products: 15 },
    { id: 3, name: "Pods", products: 9 },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {cat.name}
            </h3>
            <p className="text-gray-500">{cat.products} Products</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/products/getallproducts.php?nocache=${Date.now()}`
        );

        // لو الريسبونس array مباشر
        if (Array.isArray(res.data.data)) {
          setProductCount(res.data.data.length);
        } 
        
        else {
          setProductCount(0);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductCount(0);
      }
    };

    fetchProducts();
  }, []);

  const stats = [
    { title: "Total Sales", value: "$0,00" },
    { title: "Orders", value: "0" },
    { title: "Customers", value: "0" },
    { title: "Products", value: productCount.toString() },
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
            <p className="text-2xl font-bold text-[#440707] mt-2">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";

export default function OrdersDashboard() {
  const orders = [
    { id: "ORD123", customer: "Ahmed Ali", total: "$180", status: "Delivered" },
    { id: "ORD124", customer: "Sara Mostafa", total: "$90", status: "Pending" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Orders</h2>
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">{o.total}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      o.status === "Delivered"
                        ? "bg-green-600"
                        : o.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

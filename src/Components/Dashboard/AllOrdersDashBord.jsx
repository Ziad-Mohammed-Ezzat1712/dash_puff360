import React from "react";

export default function AllOrdersDashBord() {
  const orders = [
    { id: 1, customer: "Ahmed", total: "$120", status: "Pending" },
    { id: 2, customer: "Sara", total: "$85", status: "Delivered" },
  ];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#9BC2AF]">All Orders</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#9BC2AF  ] text-white">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b hover:bg-gray-100 transition"
            >
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3">{order.total}</td>
              <td className="p-3">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

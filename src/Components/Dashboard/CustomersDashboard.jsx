import React from "react";

export default function CustomersDashboard() {
  const customers = [
    { id: 1, name: "Ali Mohamed", email: "ali@example.com", orders: 5 },
    { id: 2, name: "Noor Hassan", email: "noor@example.com", orders: 2 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Customers</h2>
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

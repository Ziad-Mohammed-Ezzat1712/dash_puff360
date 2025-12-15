import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";

export default function DiscountsList({ onEdit }) {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(
        `https://dashboard.splash-e-liquid.com/discounts/getAllDiscounts.php?nocache=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        setDiscounts(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Stop / Activate Discount
const handleStop = async (id, currentStatus) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    const res = await axios.post(
      "https://dashboard.splash-e-liquid.com/discounts/stopDiscount.php",
      qs.stringify({
        id: id,                       // المفتاح الصحيح حسب Postman
        is_active: currentStatus ? 0 : 1,  // لو شغال نخليه 0، لو متوقف نخليه 1
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", res.data);

    if (res.data.status) {
      fetchDiscounts(); // refresh table
    } else {
      alert(res.data.message || "Action failed");
    }
  } catch (err) {
    console.error("Stop request error:", err.response?.data || err.message);
    alert("Server error");
  }
};



  useEffect(() => {
    if (token) fetchDiscounts();
    else setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">All Discounts</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Uses</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {discounts.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border p-2">{item.code}</td>
                <td className="border p-2">{item.type}</td>
                <td className="border p-2">{item.value}</td>
                <td className="border p-2">
                  {item.used_times} / {item.max_uses}
                </td>
                <td className="border p-2">
                  {item.is_active ? "Active" : "Inactive"}
                </td>

                <td className="border p-2 flex gap-2 justify-center">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    Edit
                  </button>

                  {/* Stop / Activate */}
               <button
  onClick={() => handleStop(item.id, item.is_active)}
  className={`px-3 py-1 rounded text-white ${
    item.is_active ? "bg-red-600" : "bg-green-600"
  }`}
>
  {item.is_active ? "Stop" : "Activate"}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {discounts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No discounts found
          </p>
        )}
      </div>
    </div>
  );
}

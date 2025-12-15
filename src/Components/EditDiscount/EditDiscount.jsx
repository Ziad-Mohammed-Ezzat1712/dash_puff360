import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";

export default function EditDiscount({ discount, onClose, onUpdated }) {
  const [form, setForm] = useState({});
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (discount) {
      setForm({
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        max_uses: discount.max_uses,
        max_uses_per_user: discount.max_uses_per_user,
        min_order_total: discount.min_order_total,
        start_date: discount.start_date?.replace(" ", "T"),
        end_date: discount.end_date?.replace(" ", "T"),
        allowed_category_en: discount.allowed_category_en,
        allowed_brand_en: discount.allowed_brand_en,
        is_active: discount.is_active,
      });
    }
  }, [discount]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Unauthorized");
      return;
    }

    try {
      const res = await axios.post(
        "https://dashboard.splash-e-liquid.com/discounts/updateDiscount.php",
        qs.stringify(form),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        onUpdated();
        onClose();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error(
        "Update failed:",
        error.response?.data || error.message
      );
    }
  };

  if (!discount) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Edit Discount</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="code"
            value={form.code || ""}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="fixed">Fixed</option>
            <option value="percent">Percent</option>
          </select>

          <input
            type="number"
            name="value"
            value={form.value || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="max_uses"
            value={form.max_uses || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="max_uses_per_user"
            value={form.max_uses_per_user || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="min_order_total"
            value={form.min_order_total || ""}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date || ""}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="col-span-2 bg-black text-white py-2 rounded"
          >
            Update Discount
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

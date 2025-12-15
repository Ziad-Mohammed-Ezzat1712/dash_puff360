import React, { useState } from "react";
import axios from "axios";
import qs from "qs";

export default function AddDiscount() {
  const [form, setForm] = useState({
    code: "",
    type: "fixed",
    value: "",
    max_uses: "",
    max_uses_per_user: "",
    min_order_total: "",
    start_date: "",
    end_date: "",
    allowed_category_en: "",
    allowed_brand_en: "",
    is_active: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Unauthorized: No token found");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://dashboard.splash-e-liquid.com/discounts/addDiscount.php",
        qs.stringify(form),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        setMessage("✅ Coupon created successfully");
        setForm({
          code: "",
          type: "fixed",
          value: "",
          max_uses: "",
          max_uses_per_user: "",
          min_order_total: "",
          start_date: "",
          end_date: "",
          allowed_category_en: "",
          allowed_brand_en: "",
          is_active: 1,
        });
      } else {
        setMessage(res.data.message || "❌ Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "❌ API Error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Add Discount Coupon</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          required
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
          placeholder="Discount Value"
          value={form.value}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="max_uses"
          placeholder="Max Uses"
          value={form.max_uses}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="max_uses_per_user"
          placeholder="Max Uses Per User"
          value={form.max_uses_per_user}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="min_order_total"
          placeholder="Minimum Order Total"
          value={form.min_order_total}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <input
          type="datetime-local"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="datetime-local"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="allowed_category_en"
          placeholder="Allowed Category (EN)"
          value={form.allowed_category_en}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="allowed_brand_en"
          placeholder="Allowed Brand (EN)"
          value={form.allowed_brand_en}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded col-span-2 hover:opacity-90"
        >
          {loading ? "Saving..." : "Add Coupon"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium">{message}</p>
      )}
    </div>
  );
}

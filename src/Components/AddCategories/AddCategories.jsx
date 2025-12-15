
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddCategories() {
  const [form, setForm] = useState({ color_en: "", color_ar: "" });
  const [Category, setColors] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  // Fetch all colors
  const fetchCategory = async () => {
    try {
      console.log("Fetching colors...");
      const res = await axios.get(
        `https://dashboard.splash-e-liquid.com/category/getAllCategory.php?nocache=${Date.now()}`,
        { headers: { Authorization: token } }
      );
      console.log("Fetch Response:", res.data);
      if (res.data.status) setColors(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return setMessage("❌ لا يوجد توكن");

    const formData = new FormData();
    formData.append("name_en", form.name_en);
    formData.append("name_ar", form.name_ar);
    if (editingId) formData.append("id", editingId);

    const url = editingId
      ? "https://dashboard.splash-e-liquid.com/category/updateCategory.php"
      : "https://dashboard.splash-e-liquid.com/category/addCategory.php";

    try {
      console.log("Submitting to:", url);
      console.log("Form Data:", formData.get("name_en"), formData.get("name_ar"), formData.get("id"));

      const res = await axios.post(url, formData, {
        headers: { Authorization: token },
      });

      console.log("Submit Response:", res.data);

      if (res.data.status) {
        setMessage(editingId ? "✅ تم تحديث اللون" : "✅ تم إضافة اللون");
        setForm({ name_en: "", name_ar: "" });
        setEditingId(null);
        fetchCategory();
      } else {
        setMessage("❌ فشل العملية");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setMessage("❌ خطأ في السيرفر");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا اللون؟")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      console.log("Deleting color ID:", id);
      const res = await axios.post(
        "https://dashboard.splash-e-liquid.com/category/deleteCategory.php",
        formData,
        { headers: { Authorization: token } }
      );

      console.log("Delete Response:", res.data);
      if (res.data.status) {
        setMessage("✅ تم حذف اللون");
        fetchCategory();
      } else {
        setMessage("❌ فشل الحذف");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setMessage("❌ خطأ في السيرفر");
    }
  };

  // Edit
  const handleEdit = (Category) => {
    console.log("Editing Category:", Category);
    setForm({ name_en: Category.name_en, name_ar: Category.name_ar });
    setEditingId(Category.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {editingId ? "Edit Category" : "Add Category"}
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Category (English)"
          className="border p-3 rounded"
          value={form.name_en}
          onChange={(e) => setForm({ ...form, name_en: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="الصنف بالعربي"
          className="border p-3 rounded"
          value={form.name_ar}
          onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
          required
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-[#440707] hover:bg-[#580606] text-white py-3 font-medium rounded mt-4"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {message && <p className="mb-4 text-lg font-medium">{message}</p>}

      {/* Colors Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
           
            <th className="border p-2">English</th>
            <th className="border p-2">Arabic</th>
          
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Category.map((Category) => (
            <tr key={Category.id}>
             
              <td className="border font-medium text-center  p-2">{Category.name_en}</td>
              <td className="border font-medium text-center  p-2">{Category.name_ar}</td>
             
              <td className="border font-medium p-2 flex gap-2">
             
               <button
                  onClick={() => handleEdit(Category)}
                  className="bg-yellow-500 w-[50%] cursor-pointer hover:bg-yellow-600 text-white py-1 px-2 rounded-2xl"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(Category.id)}
                  className="bg-red-600 w-[50%] cursor-pointer hover:bg-red-700 text-white py-1 px-2 rounded-2xl"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

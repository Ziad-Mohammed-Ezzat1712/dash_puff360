import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddBrand() {
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    image: null,
  });

  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  // Fetch all brands
  const fetchBrands = async () => {
    try {
      console.log("Fetching brands...");
      const res = await axios.get(
        `https://dashboard.splash-e-liquid.com/brand/getBrands.php?nocache=${Date.now()}`,
        { headers: { Authorization: token } }
      );

      console.log("Brands Response:", res.data);

      if (res.data.status) {
        setBrands(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Brands Error:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Submit Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", form.name_en);
    formData.append("name_ar", form.name_ar);
    if (form.image) formData.append("cover", form.image);

    if (editingId) formData.append("id", editingId);

    const url = editingId
      ? "https://dashboard.splash-e-liquid.com/brand/updateBrand.php"
      : "https://dashboard.splash-e-liquid.com/brand/addBrand.php";

    console.log("Submitting to:", url);
    console.log("Form Data:", formData.get("name_en"), formData.get("name_ar"), formData.get("cover"));

    try {
      const res = await axios.post(url, formData, {
        headers: { Authorization: token },
      });

      console.log("Submit Response:", res.data);

      if (res.data.status) {
        setMessage(editingId ? "✅ تم تحديث البراند" : "✅ تم إضافة البراند");
        setForm({ name_en: "", name_ar: "", image: null });
        setEditingId(null);
        fetchBrands();
      } else {
        setMessage("❌ فشل العملية");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setMessage("❌ خطأ في السيرفر");
    }
  };

  // Delete brand
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا البراند؟")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      console.log("Deleting brand ID:", id);

      const res = await axios.post(
        "https://dashboard.splash-e-liquid.com/brand/deleteBrand.php",
        formData,
        { headers: { Authorization: token } }
      );

      console.log("Delete Response:", res.data);

      if (res.data.status) {
        setMessage("✅ تم حذف البراند");
        fetchBrands();
      } else {
        setMessage("❌ لا يمكن حذف البراند");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setMessage("❌ خطأ في السيرفر");
    }
  };

  // Edit brand
  const handleEdit = (brand) => {
    console.log("Editing Brand:", brand);

    setForm({
      name_en: brand.name_en,
      name_ar: brand.name_ar,
      image: null, // الصورة مش هتنزل من السيرفر – المستخدم يختار واحدة جديدة
    });

    setEditingId(brand.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {editingId ? "Edit Brand" : "Add Brand"}
      </h1>

      {/* FORM */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Brand Name (English)"
          className="border p-3 rounded"
          value={form.name_en}
          onChange={(e) => setForm({ ...form, name_en: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="اسم البراند"
          className="border p-3 rounded"
          value={form.name_ar}
          onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
          required
        />

        <input
          type="file"
          className="border p-3 rounded col-span-1 md:col-span-2"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-[#440707] hover:bg-[#580606] text-white py-3 font-medium rounded mt-4"
        >
          {editingId ? "Update Brand" : "Add Brand"}
        </button>
      </form>

      {message && <p className="mb-4 text-lg">{message}</p>}

      {/* TABLE */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
          
            <th className="border p-2">English</th>
            <th className="border p-2">Arabic</th>
            <th className="border p-2">Image</th>
          
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
             
              <td className="border  font-medium p-2">{brand.name_en}</td>
              <td className="border   font-medium p-2">{brand.name_ar}</td>

              <td className="border  font-medium p-2">
                {brand.image ? (
                  <img
                    src={`${brand.image}`}
                    alt="brand"
                    className="w-14 h-14 object-cover rounded"
                  />
                ) : (
                  "No Image"
                )}
              </td>

              

              <td className="border  font-medium py-5 px-2 flex gap-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="bg-yellow-500 w-[50%] cursor-pointer hover:bg-yellow-600 text-white py-1 px-2 rounded-2xl"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(brand.id)}
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

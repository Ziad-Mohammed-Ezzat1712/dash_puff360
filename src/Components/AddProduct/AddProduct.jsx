import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ====================== API LINKS ======================
const AddAPI = "https://dashboard.splash-e-liquid.com/products/addProducts.php";
const UpdateAPI = "https://dashboard.splash-e-liquid.com/products/updateProduct.php";
const DeleteAPI = "https://dashboard.splash-e-liquid.com/products/deleteProducts.php";
const GetAPI = "https://dashboard.splash-e-liquid.com/products/getallproducts.php";
const CategoryAPI = "https://dashboard.splash-e-liquid.com/category/getAllCategory.php";
const BrandAPI = "https://dashboard.splash-e-liquid.com/brand/getBrands.php";
const TypeAPI = "https://dashboard.splash-e-liquid.com/productType/getAllType.php";
const ColorAPI = "https://dashboard.splash-e-liquid.com/colors/getAllColors.php";

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    brand_en: "",
    brand_ar: "",
    price: "",
    stock: "",
    category_en: "",
    category_ar: "",
    imageFile: null, // Main product image
    liquid: {
      type_en: "",
      type_ar: "",
      flavor_en: "",
      flavor_ar: "",
      size_en: "",
      size_ar: "",
      nicotine_en: "",
      nicotine_ar: "",
      images: [],
    },
    device: [
      {
        type_en: "",
        type_ar: "",
        color_en: "",
        color_ar: "",
        images: [],
      },
    ],
  });

  // ====================== FETCH DATA ======================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(GetAPI);
      if (res.data.status) setProducts(res.data.data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CategoryAPI);
      if (res.data.status) setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(BrandAPI);
      if (res.data.status) setBrands(res.data.data);
    } catch (err) {
      toast.error("Failed to load brands");
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await axios.get(TypeAPI);
      if (res.data.status) setTypes(res.data.data);
    } catch (err) {
      toast.error("Failed to load types");
    }
  };

  const fetchColors = async () => {
    try {
      const res = await axios.get(ColorAPI);
      if (res.data.status) setColors(res.data.data);
    } catch (err) {
      toast.error("Failed to load colors");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchTypes();
    fetchColors();
  }, []);

  // ====================== CATEGORY CHANGE ======================
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const cat = categories.find((c) => c.id.toString() === selectedId);
    if (!cat) return;

    const english = cat.name_en.toLowerCase();
    const arabic = cat.name_ar;

    const isLiquid = english === "liquid" || arabic === "سائل";
    const isDevice = english === "device" || arabic === "جهاز";

    setForm({
      ...form,
      category_en: english,
      category_ar: arabic,
      liquid: isLiquid ? form.liquid : {
        type_en: "",
        type_ar: "",
        flavor_en: "",
        flavor_ar: "",
        size_en: "",
        size_ar: "",
        nicotine_en: "",
        nicotine_ar: "",
        images: [],
      },
      device: isDevice ? form.device : [{ type_en: "", type_ar: "", color_en: "", color_ar: "", images: [] }],
    });
  };

  // ====================== ADD / UPDATE ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageFile) {
      toast.error("Main product image is required");
      return;
    }
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("No token found");
      return;
    }
    const fd = new FormData();
    fd.append("name_en", form.name_en);
    fd.append("name_ar", form.name_ar);
    fd.append("description_en", form.description_en);
    fd.append("description_ar", form.description_ar);
    fd.append("brand_en", form.brand_en);
    fd.append("brand_ar", form.brand_ar);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("category_en", form.category_en);
    fd.append("category_ar", form.category_ar);
    fd.append("image", form.imageFile);

    const isLiquid = form.category_en === "liquid";
    const isDevice = form.category_en === "device";

    if (isLiquid) {
      fd.append("type_en", form.liquid.type_en);
      fd.append("type_ar", form.liquid.type_ar);
      fd.append("flavor_en", form.liquid.flavor_en);
      fd.append("flavor_ar", form.liquid.flavor_ar);
      fd.append("size_en", form.liquid.size_en);
      fd.append("size_ar", form.liquid.size_ar);
      fd.append("nicotine_en", form.liquid.nicotine_en);
      fd.append("nicotine_ar", form.liquid.nicotine_ar);
      form.liquid.images.forEach((file) => fd.append("flavor_images[]", file));
    }

    if (isDevice) {
      form.device.forEach((dc) => {
        fd.append("type_en", dc.type_en || "");
        fd.append("type_ar", dc.type_ar || "");
        fd.append("color_en[]", dc.color_en);
        fd.append("color_ar[]", dc.color_ar);
        dc.images.forEach((file) => fd.append("color_images[]", file));
      });
    }

    try {
      let res;
      if (isEditing) {
        fd.append("product_id", editId);
        res = await axios.post(UpdateAPI, fd, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(AddAPI, fd, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.status) {
        toast.success(isEditing ? "Product updated successfully" : "Product added successfully");
  const updatedProducts = isEditing
    ? products.map((p) => (p.product_id === editId ? res.data.data : p))
    : [...products, res.data.data];
  setProducts(updatedProducts);


        setForm({
          name_en: "",
          name_ar: "",
          description_en: "",
          description_ar: "",
          brand_en: "",
          brand_ar: "",
          price: "",
          stock: "",
          category_en: "",
          category_ar: "",
          imageFile: null,
          liquid: { type_en: "", type_ar: "", flavor_en: "", flavor_ar: "", size_en: "", size_ar: "", nicotine_en: "", nicotine_ar: "", images: [] },
          device: [{ type_en: "", type_ar: "", color_en: "", color_ar: "", images: [] }],
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("API Error");
    }
  };

  // ====================== DELETE ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("product_id", id);
    try {
      const res = await axios.post(DeleteAPI, fd, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      if (res.data.status) {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p.product_id !== id));
      } else toast.error("Delete failed");
    } catch (err) {
      toast.error("API Error");
    }
  };

  // ====================== EDIT MODE ======================
  const handleEdit = (p) => {
    setIsEditing(true);
    setEditId(p.product_id);

    const isLiquid = p.category_key === "liquid";
    const isDevice = p.category_key === "device";

    setForm({
      name_en: p.name_en || "",
      name_ar: p.name_ar || "",
      description_en: p.description_en || "",
      description_ar: p.description_ar || "",
      brand_en: p.brand?.name_en || "",
      brand_ar: p.brand?.name_ar || "",
      price: p.price || "",
      stock: p.stock || "",
      category_en: p.category?.name_en.toLowerCase() || "",
      category_ar: p.category?.name_ar || "",
      imageFile: null,
      liquid: isLiquid
        ? { type_en: p.liquid?.type_en || "", type_ar: p.liquid?.type_ar || "", flavor_en: p.liquid?.flavor_en || "", flavor_ar: p.liquid?.flavor_ar || "", size_en: p.liquid?.size_en || "", size_ar: p.liquid?.size_ar || "", nicotine_en: p.liquid?.nicotine_en || "", nicotine_ar: p.liquid?.nicotine_ar || "", images: [] }
        : { type_en: "", type_ar: "", flavor_en: "", flavor_ar: "", size_en: "", size_ar: "", nicotine_en: "", nicotine_ar: "", images: [] },
      device: isDevice
        ? p.device.map((d) => ({ type_en: d.type_en || "", type_ar: d.type_ar || "", color_en: d.color_en || "", color_ar: d.color_ar || "", images: [] }))
        : [{ type_en: "", type_ar: "", color_en: "", color_ar: "", images: [] }],
    });
  };

  const isLiquidForm = form.category_en === "liquid";
  const isDeviceForm = form.category_en === "device";

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? "Edit Product" : "Add Product"}</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Name EN/AR */}
        <input type="text" placeholder="Name EN" className="border p-3 rounded" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} required />
        <input type="text" placeholder="Name AR" className="border p-3 rounded" value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} required />

        {/* Description EN/AR */}
        <textarea placeholder="Description EN" className="border p-3 rounded" value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} required />
        <textarea placeholder="Description AR" className="border p-3 rounded" value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} required />

       {/* Brand English */}
<select
  className="border p-3 rounded"
  value={form.brand_en}
  onChange={e =>
    setForm({ ...form, brand_en: e.target.value })
  }
  required
>
  <option value="">Select Brand (EN)</option>
  {brands.map(b => (
    <option key={b.id} value={b.name_en}>{b.name_en}</option>
  ))}
</select>

{/* Brand Arabic */}
<select
  className="border p-3 rounded"
  value={form.brand_ar}
  onChange={e =>
    setForm({ ...form, brand_ar: e.target.value })
  }
  required
>
  <option value="">اختر الماركة (AR)</option>
  {brands.map(b => (
    <option key={b.id} value={b.name_ar}>{b.name_ar}</option>
  ))}
</select>


        {/* Price & Stock */}
        <input type="number" placeholder="Price" className="border p-3 rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input type="number" placeholder="Stock" className="border p-3 rounded" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />

       {/* Category English */}
<select
  className="border p-3 rounded"
  value={form.category_en}
  onChange={e =>
    setForm({ ...form, category_en: e.target.value })
  }
  required
>
  <option value="">Select Category (EN)</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.name_en}>{cat.name_en}</option>
  ))}
</select>

{/* Category Arabic */}
<select
  className="border p-3 rounded"
  value={form.category_ar}
  onChange={e =>
    setForm({ ...form, category_ar: e.target.value })
  }
  required
>
  <option value="">اختر الفئة (AR)</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.name_ar}>{cat.name_ar}</option>
  ))}
</select>


        {/* Main Product Image */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium">Main Product Image *</label>
          <input type="file" accept="image/*" className="border p-3 rounded" onChange={e => setForm({ ...form, imageFile: e.target.files[0] })} required />
        </div>

        {/* Liquid Fields */}
        {isLiquidForm && (
          <>
            {/* Type */}
          {/* نوع انجليزي */}
<select
  className="border p-3 rounded"
  value={form.liquid.type_en}
  onChange={e =>
    setForm({ ...form, liquid: { ...form.liquid, type_en: e.target.value } })
  }
  required
>
  <option value="">Select Type (EN)</option>
  {types.map(t => (
    <option key={t.id} value={t.name_en}>{t.name_en}</option>
  ))}
</select>

{/* نوع عربي */}
<select
  className="border p-3 rounded"
  value={form.liquid.type_ar}
  onChange={e =>
    setForm({ ...form, liquid: { ...form.liquid, type_ar: e.target.value } })
  }
  required
>
  <option value="">اختر النوع (AR)</option>
  {types.map(t => (
    <option key={t.id} value={t.name_ar}>{t.name_ar}</option>
  ))}
</select>


            <input placeholder="Flavor EN" className="border p-3 rounded" value={form.liquid.flavor_en} onChange={e => setForm({ ...form, liquid: { ...form.liquid, flavor_en: e.target.value } })} required />
            <input placeholder="Flavor AR" className="border p-3 rounded" value={form.liquid.flavor_ar} onChange={e => setForm({ ...form, liquid: { ...form.liquid, flavor_ar: e.target.value } })} required />
            <input placeholder="Size EN" className="border p-3 rounded" value={form.liquid.size_en} onChange={e => setForm({ ...form, liquid: { ...form.liquid, size_en: e.target.value } })} required />
            <input placeholder="Size AR" className="border p-3 rounded" value={form.liquid.size_ar} onChange={e => setForm({ ...form, liquid: { ...form.liquid, size_ar: e.target.value } })} required />
            <input placeholder="Nicotine EN" className="border p-3 rounded" value={form.liquid.nicotine_en} onChange={e => setForm({ ...form, liquid: { ...form.liquid, nicotine_en: e.target.value } })} required />
            <input placeholder="Nicotine AR" className="border p-3 rounded" value={form.liquid.nicotine_ar} onChange={e => setForm({ ...form, liquid: { ...form.liquid, nicotine_ar: e.target.value } })} required />

            {/* Optional flavor images */}
            <label className="block mb-1 font-medium">Flavor Images (optional)</label>
            <input type="file" multiple accept="image/*" className="border p-3 rounded" onChange={e => setForm({ ...form, liquid: { ...form.liquid, images: Array.from(e.target.files) } })} />
          </>
        )}

        {/* Device Fields */}
        {isDeviceForm && form.device.map((dc, idx) => (
          <div key={idx} className="border p-3 rounded flex flex-col gap-2">
        

            {/* Color English */}
<select
  className="border p-2 rounded"
  value={dc.color_en}
  onChange={e => {
    const newDevice = [...form.device];
    newDevice[idx].color_en = e.target.value;
    setForm({ ...form, device: newDevice });
  }}
  required
>
  <option value="">Select Color (EN)</option>
  {colors.map(c => (
    <option key={c.id} value={c.color_en}>{c.color_en}</option>
  ))}
</select>

{/* Color Arabic */}
<select
  className="border p-2 rounded"
  value={dc.color_ar}
  onChange={e => {
    const newDevice = [...form.device];
    newDevice[idx].color_ar = e.target.value;
    setForm({ ...form, device: newDevice });
  }}
  required
>
  <option value="">اختر اللون (AR)</option>
  {colors.map(c => (
    <option key={c.id} value={c.color_ar}>{c.color_ar}</option>
  ))}
</select>

            {/* Optional device images */}
            <label className="block mb-1 font-medium">Device Images (optional)</label>
            <input type="file" multiple accept="image/*" className="border p-2 rounded" onChange={e => { const newDevice = [...form.device]; newDevice[idx].images = Array.from(e.target.files); setForm({ ...form, device: newDevice }); }} />
          </div>
        ))}

        <button type="submit" className="col-span-1 md:col-span-2 bg-[#440707] hover:bg-[#580606] text-white py-3 rounded mt-4">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}

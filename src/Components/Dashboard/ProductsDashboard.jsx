import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";

export default function ProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [deviceColors, setDeviceColors] = useState([]);

  const [deviceImageFiles, setDeviceImageFiles] = useState({});
  const [liquidImageFiles, setLiquidImageFiles] = useState([]);

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `https://dashboard.splash-e-liquid.com/products/getallproducts.php?nocache=${Date.now()}`
      );
      if (res.data.status) {setProducts(res.data.data)
         console.log(res.data.data);
         
        };
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectors = async () => {
    try {
      const [b, t, c] = await Promise.all([
        axios.get("https://dashboard.splash-e-liquid.com/brand/getBrands.php"),
        axios.get("https://dashboard.splash-e-liquid.com/productType/getAllType.php"),
        axios.get("https://dashboard.splash-e-liquid.com/colors/getAllColors.php"),
      ]);

      setBrands(b.data.data || []);
      setTypes(t.data.data || []);
      setDeviceColors(c.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSelectors();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("No admin token");
    try {
      await axios.post(
        "https://dashboard.splash-e-liquid.com/products/deleteProducts.php",
        qs.stringify({ product_id: id }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // ================= EDIT =================
  const openEditPopup = (item) => {
    setEditItem(JSON.parse(JSON.stringify(item)));
    setDeviceImageFiles({});
    setLiquidImageFiles([]);
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("product_id", editItem.product_id);
      formData.append("name_en", editItem.name_en);
      formData.append("name_ar", editItem.name_ar);
      formData.append("description_en", editItem.description_en);
      formData.append("description_ar", editItem.description_ar);
      formData.append("price", editItem.price);
      formData.append("stock", editItem.stock);
      formData.append("size_en", editItem.size_en);
      formData.append("size_ar", editItem.size_ar);

      // Brand & Type
      if (editItem.brand?.id) formData.append("brand_id", editItem.brand.id);
      if (editItem.type?.id) formData.append("type_id", editItem.type.id);

      // Main image
      if (editItem.imageFile) {
        formData.append("image", editItem.imageFile);
      }

      // Device & Liquid JSON
      formData.append("device", JSON.stringify(editItem.device || []));
      formData.append("liquid", JSON.stringify(editItem.liquid || {}));

      // Device images
      Object.keys(deviceImageFiles).forEach((idx) => {
        deviceImageFiles[idx].forEach((file) => {
          formData.append(`color_images`, file);
        });
      });

      // Liquid images
      liquidImageFiles.forEach((file) => {
        formData.append("flavor_images", file);
      });

   const token = localStorage.getItem("adminToken"); // جلب التوكن من localStorage
await axios.post(
  "https://dashboard.splash-e-liquid.com/products/updateProduct.php",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

      alert("Updated Successfully");
      setShowPopup(false);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name EN</th>
              <th className="border p-2">Name AR</th>
              <th className="border p-2">Desc EN</th>
              <th className="border p-2">Desc AR</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Product Info</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.product_id} className="align-top">
                <td className="border p-2">
                  <img src={p.image} className="w-16 h-16 rounded object-cover" />
                </td>
                <td className="border p-2">{p.name_en}</td>
                <td className="border p-2">{p.name_ar}</td>
                <td className="border p-2">{p.description_en}</td>
                <td className="border p-2">{p.description_ar}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">{p.category?.name_en}</td>

                <td className="border p-2 space-y-2">
                  <div><strong>Brand:</strong> {p.brand?.name_en}</div>

                  {p.category_key === "device" &&
                    p.device.map((d, i) => (
                      <div key={i} className="border p-2 rounded">
                        <div><strong>Color:</strong> {d.color_en}</div>
                        <div className="flex gap-1 mt-1">
                          {d.images.map((img, idx) => (
                            <img key={idx} src={img} className="w-10 h-10 rounded" />
                          ))}
                        </div>
                      </div>
                    ))}

                  {p.category_key === "liquid" && p.liquid && (
                    <>
                      <div><strong>Type:</strong> {p.liquid.type_en}</div>
                      <div><strong>Flavor:</strong> {p.liquid.flavor_en}</div>
                      <div><strong>Size:</strong> {p.liquid.size_en}</div>
                      <div><strong>Nicotine:</strong> {p.liquid.nicotine_en}</div>
                      <div className="flex gap-1">
                        {p.liquid.images.map((img, idx) => (
                          <img key={idx} src={img} className="w-10 h-10 rounded" />
                        ))}
                      </div>
                    </>
                  )}
                </td>

                <td className="border p-2">
                  <button
                    onClick={() => openEditPopup(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= EDIT POPUP ================= */}
      {showPopup && editItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start p-6 overflow-auto">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded w-full max-w-3xl space-y-3"
          >
            <h2 className="text-xl font-bold mb-2">Edit Product</h2>

            {/* BASIC INFO */}
            <label className="block mb-1 font-medium">Name_EN</label>
            <input
              name="name_en"
              value={editItem.name_en || ""}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Name EN"
            />
             <label className="block mb-1 font-medium">Name_AR</label>
            <input
              name="name_ar"
              value={editItem.name_ar || ""}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Name AR"
            />
             <label className="block mb-1 font-medium">Description_EN</label>
            <textarea
              name="description_en"
              value={editItem.description_en || ""}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Description EN"
            />
             <label className="block mb-1 font-medium">Description_AR</label>
            <textarea
              name="description_ar"
              value={editItem.description_ar || ""}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Description AR"
            />
            <div className="grid grid-cols-2 gap-3">
               <div><label className="block mb-1 font-medium">price</label>
              <input
                type="number"
                name="price"
                value={editItem.price || ""}
                onChange={handleChange}
                className="border p-2 w-full"
                placeholder="Price"
              /></div>
               <div><label className="block mb-1 font-medium">stock</label>
              <input
                type="number"
                name="stock"
                value={editItem.stock || ""}
                onChange={handleChange}
                className="border p-2 w-full"
                placeholder="Stock"
              /></div>
            </div>

            {/* MAIN IMAGE */}
            <label className="block mb-1 font-medium">Main Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditItem({ ...editItem, imageFile: e.target.files[0] })
              }
              className="border p-2 w-full"
            />
            {(editItem.imageFile || editItem.image) && (
              <img
                src={
                  editItem.imageFile
                    ? URL.createObjectURL(editItem.imageFile)
                    : editItem.image
                }
                className="w-24 h-24 object-cover rounded"
              />
            )}

            {/* BRAND */}
            <div className="grid grid-cols-2 gap-2">
          <div>    <label className="block mb-1 font-medium">Brand_EN</label>
              <select
                value={editItem.brand?.id || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    brand: {
                      ...editItem.brand,
                      id: e.target.value,
                      name_en: brands.find((b) => b.id == e.target.value)?.name_en,
                    },
                  })
                }
                className="border p-2 w-full"
              >
                <option value="">Brand EN</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name_en}</option>
                ))}
              </select></div>
<div> <label className="block mb-1 font-medium">Brand_AR</label>
              <select
                value={editItem.brand?.id || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    brand: {
                      ...editItem.brand,
                      id: e.target.value,
                      name_ar: brands.find((b) => b.id == e.target.value)?.name_ar,
                    },
                  })
                }
                className="border p-2 w-full"
              >
                <option value="">Brand AR</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name_ar}</option>
                ))}
              </select></div>
            </div>

            {/* TYPE */}
            <div className="grid grid-cols-2 gap-2">
          <div>   <label className="block mb-1 font-medium">Type_EN</label>
              <select
                value={editItem.type?.id || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    type: {
                      ...editItem.type,
                      id: e.target.value,
                      name_en: types.find((t) => t.id == e.target.value)?.name_en,
                    },
                  })
                }
                className="border p-2 w-full"
              >
                <option value="">Type EN</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name_en}</option>
                ))}
              </select></div>
<div>   <label className="block mb-1 font-medium">Type_AR</label>
              <select
                value={editItem.type?.id || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    type: {
                      ...editItem.type,
                      id: e.target.value,
                      name_ar: types.find((t) => t.id == e.target.value)?.name_ar,
                    },
                  })
                }
                className="border p-2 w-full"
              >
                <option value="">Type AR</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name_ar}</option>
                ))}
              </select></div>
            </div>

            {/* DEVICE */}
            {editItem.category_key === "device" &&
              editItem.device.map((d, idx) => (
                <div key={idx} className="border p-3 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={d.color_id || ""}
                      onChange={(e) => {
                        const dev = [...editItem.device];
                        dev[idx].color_id = e.target.value;
                        dev[idx].color_en = deviceColors.find(c => c.id == e.target.value)?.color_en;
                        setEditItem({ ...editItem, device: dev });
                      }}
                      className="border p-2 w-full"
                    >
                      <option value="">Color EN</option>
                      {deviceColors.map((c) => (
                        <option key={c.id} value={c.id}>{c.color_en}</option>
                      ))}
                    </select>

                    <select
                      value={d.color_id || ""}
                      onChange={(e) => {
                        const dev = [...editItem.device];
                        dev[idx].color_id = e.target.value;
                        dev[idx].color_ar = deviceColors.find(c => c.id == e.target.value)?.color_ar;
                        setEditItem({ ...editItem, device: dev });
                      }}
                      className="border p-2 w-full"
                    >
                      <option value="">Color AR</option>
                      {deviceColors.map((c) => (
                        <option key={c.id} value={c.id}>{c.color_ar}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setDeviceImageFiles({
                        ...deviceImageFiles,
                        [idx]: Array.from(e.target.files),
                      })
                    }
                    className="border p-2 w-full"
                  />

                  {/* OLD IMAGES */}
                  <div className="flex gap-2 flex-wrap">
                    {d.images.map((img, i) => (
                      <img key={i} src={img} className="w-16 h-16 rounded object-cover" />
                    ))}
                  </div>

                  {/* NEW PREVIEW */}
                  <div className="flex gap-2 flex-wrap">
                    {(deviceImageFiles[idx] || []).map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} className="w-16 h-16 rounded object-cover border" />
                    ))}
                  </div>
                </div>
              ))}

            {/* LIQUID */}
            {editItem.category_key === "liquid" && editItem.liquid && (
              <div className="border p-3 rounded space-y-2">
                <label className="block mb-1 font-medium">Size_EN</label>
                <input
                  value={editItem.liquid.size_en || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, size_en: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Size EN"
                />
                <label className="block mb-1 font-medium">Size_AR</label>
                <input
                  value={editItem.liquid.size_ar || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, size_ar: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Size AR"
                />
<label className="block mb-1 font-medium">Nicotine_EN</label>
                <input
                  value={editItem.liquid.nicotine_en || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, nicotine_en: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Nicotine EN"
                />
                <label className="block mb-1 font-medium">Nicotine_AR</label>
                <input
                  value={editItem.liquid.nicotine_ar || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, nicotine_ar: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Nicotine AR"
                />
<label className="block mb-1 font-medium">Flavor_EN</label>
                <input
                  value={editItem.liquid.flavor_en || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, flavor_en: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Flavor EN"
                />
                <label className="block mb-1 font-medium">Flavor_AR</label>
                <input
                  value={editItem.liquid.flavor_ar || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      liquid: { ...editItem.liquid, flavor_ar: e.target.value },
                    })
                  }
                  className="border p-2 w-full"
                  placeholder="Flavor AR"
                />

           {/* IMAGES */}
<label className="block mb-1 font-medium">IMAGES</label>
<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => setLiquidImageFiles(Array.from(e.target.files))} // يستبدل الصور القديمة
  className="border p-2 w-full"
/>
<div className="flex gap-2 flex-wrap mt-2">
  {/* الصور القديمة من editItem */}
  {editItem.liquid.images.map((img, i) => (
    <div key={i} className="relative">
      <img
        src={img}
        className="w-16 h-16 rounded object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const newImgs = [...editItem.liquid.images];
          newImgs.splice(i, 1);
          setEditItem({
            ...editItem,
            liquid: { ...editItem.liquid, images: newImgs },
          });
        }}
        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}

  {/* الصور الجديدة */}
  {liquidImageFiles.map((file, i) => (
    <div key={i} className="relative">
      <img
        src={URL.createObjectURL(file)}
        className="w-16 h-16 rounded object-cover border"
      />
      <button
        type="button"
        onClick={() => {
          const newFiles = [...liquidImageFiles];
          newFiles.splice(i, 1);
          setLiquidImageFiles(newFiles);
        }}
        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}
</div>

              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

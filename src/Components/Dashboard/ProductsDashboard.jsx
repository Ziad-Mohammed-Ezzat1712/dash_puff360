import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductsTable from "../ProductsTable/ProductsTable";

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
      if (res.data.status) {
        setProducts(res.data.data);
        console.log(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectors = async () => {
    try {
      const [b, t, c] = await Promise.all([
        axios.get(
          `https://dashboard.splash-e-liquid.com/brand/getBrands.php?nocache=${Date.now()}`
        ),
        axios.get(
          `https://dashboard.splash-e-liquid.com/productType/getAllType.php?nocache=${Date.now()}`
        ),
        axios.get(
          `https://dashboard.splash-e-liquid.com/colors/getAllColors.php?nocache=${Date.now()}`
        ),
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
    if (!token) return alert("No token");

    try {
      await axios.post(
        "https://dashboard.splash-e-liquid.com/products/deleteProducts.php",
        new URLSearchParams({ product_id: id }),
        { headers: { Authorization: `Bearer ${token}` } }
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

  // ================= SUBMIT =================
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("No token");

    try {
      const formData = new FormData();

      // BASIC
      formData.append("product_id", editItem.product_id);
      formData.append("name_en", editItem.name_en);
      formData.append("name_ar", editItem.name_ar);
      formData.append("description_en", editItem.description_en);
      formData.append("description_ar", editItem.description_ar);
      formData.append("price", editItem.price);
      formData.append("stock", editItem.stock);

      // BRAND (KEYS)
      formData.append("brand_en", editItem.brand?.name_en || "");
      formData.append("brand_ar", editItem.brand?.name_ar || "");

      // MAIN IMAGE
      if (editItem.imageFile) {
        formData.append("image", editItem.imageFile);
      }

      // ========== LIQUID ==========
      if (editItem.category_key === "liquid") {
        formData.append("flavor_en", editItem.liquid.flavor_en);
        formData.append("flavor_ar", editItem.liquid.flavor_ar);
        formData.append("size_en", editItem.liquid.size_en);
        formData.append("size_ar", editItem.liquid.size_ar);
        formData.append("nicotine_en", editItem.liquid.nicotine_en);
        formData.append("nicotine_ar", editItem.liquid.nicotine_ar);

        // TYPE (KEY)
        formData.append("type_en", editItem.type?.name_en || "");
        formData.append("type_ar", editItem.type?.name_ar || "");

        liquidImageFiles.forEach((file) => {
          formData.append("flavor_images[]", file);
        });

        editItem.liquid.images.forEach((img) => {
          formData.append("old_flavor_images[]", img);
        });
      }

     // ========== DEVICE ==========
if (editItem.category_key === "device" && editItem.device.length > 0) {
  editItem.device.forEach((device, index) => {
    // Append color keys
    formData.append(`color_en[${index}]`, device.color_en);
    formData.append(`color_ar[${index}]`, device.color_ar);

    // NEW COLOR IMAGES
    if (deviceImageFiles[index] && deviceImageFiles[index].length > 0) {
      deviceImageFiles[index].forEach((file) => {
        formData.append(`color_images[${index}][]`, file);
      });
    }

    // OLD COLOR IMAGES
    if (device.images && device.images.length > 0) {
      device.images.forEach((img) => {
        formData.append(`old_color_images[${index}][]`, img);
      });
    }
  });
}


      await axios.post(
        "https://dashboard.splash-e-liquid.com/products/updateProduct.php",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Updated ✅");
      setShowPopup(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  // ================= UI =================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductsTable
          products={products}
          onEdit={openEditPopup}
          onDelete={handleDelete}
        />
      )}

      {/* EDIT POPUP */}
      {showPopup && editItem && (
        <div className="fixed inset-0 bg-black/50 p-6 overflow-auto">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded w-full max-w-4xl mx-auto space-y-4"
          >
            <h2 className="text-2xl font-bold">Edit Product</h2>

            {/* ================= BASIC INFO ================= */}
            <div className="grid grid-cols-2 gap-4">
              <div className="  ">
                {" "}
                <label className="block mb-1 font-medium">Name En</label>
                <input
                  value={editItem.name_en || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name_en: e.target.value })
                  }
                  className="border w-full p-2"
                  placeholder="Name EN"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Name AR</label>
                <input
                  value={editItem.name_ar || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name_ar: e.target.value })
                  }
                  className="border w-full p-2"
                  placeholder="Name AR"
                />
              </div>
            </div>
            <label className="block mb-1 font-medium">Description EN </label>
            <textarea
              value={editItem.description_en || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, description_en: e.target.value })
              }
              className="border p-2 w-full"
              placeholder="Description EN"
            />
            <label className="block mb-1 font-medium">Description AR </label>
            <textarea
              value={editItem.description_ar || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, description_ar: e.target.value })
              }
              className="border p-2 w-full"
              placeholder="Description AR"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                {" "}
                <label className="block mb-1 font-medium">Price </label>
                <input
                  type="number"
                  value={editItem.price || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, price: e.target.value })
                  }
                  className="border p-2 w-full"
                  placeholder="Price"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock </label>
                <input
                  type="number"
                  value={editItem.stock || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, stock: e.target.value })
                  }
                  className="border p-2 w-full"
                  placeholder="Stock"
                />
              </div>
            </div>

            {/* ================= MAIN IMAGE ================= */}
            <div>
              <label className="font-medium">Main Image</label>
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
                  className="w-24 h-24 mt-2 rounded object-cover"
                />
              )}
            </div>

            {/* ================= BRAND ================= */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Brand EN </label>
                <select
                  value={editItem.brand?.name_en || ""}
                  onChange={(e) => {
                    const brand = brands.find(
                      (b) => b.name_en === e.target.value
                    );
                    setEditItem({ ...editItem, brand });
                  }}
                  className="border p-2 w-full"
                >
                  <option value="">Brand EN</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name_en}>
                      {b.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {" "}
                <label className="block mb-1 font-medium">Brand AR </label>
                <select
                  value={editItem.brand?.name_ar || ""}
                  onChange={(e) => {
                    const brand = brands.find(
                      (b) => b.name_ar === e.target.value
                    );
                    setEditItem({ ...editItem, brand });
                  }}
                  className="border p-2 w-full"
                >
                  <option value="">Brand AR</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name_ar}>
                      {b.name_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ================= TYPE (LIQUID ONLY) ================= */}
            {editItem.category_key === "liquid" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Type AR </label>
                  <select
                    value={editItem.type?.name_en || ""}
                    onChange={(e) => {
                      const type = types.find(
                        (t) => t.name_en === e.target.value
                      );
                      setEditItem({ ...editItem, type });
                    }}
                    className="border p-2 w-full"
                  >
                    <option value="">Type EN</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.name_en}>
                        {t.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Type AR </label>
                  <select
                    value={editItem.type?.name_ar || ""}
                    onChange={(e) => {
                      const type = types.find(
                        (t) => t.name_ar === e.target.value
                      );
                      setEditItem({ ...editItem, type });
                    }}
                    className="border p-2 w-full"
                  >
                    <option value="">Type AR</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.name_ar}>
                        {t.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* ================= DEVICE ================= */}
            {editItem.category_key === "device" &&
              editItem.device.map((d, idx) => (
                <div key={idx} className="border p-4 rounded space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      {" "}
                      <label className="block mb-1 font-medium">
                        Color EN{" "}
                      </label>
                      <select
                        value={d.color_en || ""}
                        onChange={(e) => {
                          const color = deviceColors.find(
                            (c) => c.color_en === e.target.value
                          );
                          const dev = [...editItem.device];
                          dev[idx] = { ...dev[idx], ...color };
                          setEditItem({ ...editItem, device: dev });
                        }}
                        className="border p-2 w-full"
                      >
                        <option value="">Color EN</option>
                        {deviceColors.map((c) => (
                          <option key={c.id} value={c.color_en}>
                            {c.color_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">
                        Color AR{" "}
                      </label>
                      <select
                        value={d.color_ar || ""}
                        onChange={(e) => {
                          const color = deviceColors.find(
                            (c) => c.color_ar === e.target.value
                          );
                          const dev = [...editItem.device];
                          dev[idx] = { ...dev[idx], ...color };
                          setEditItem({ ...editItem, device: dev });
                        }}
                        className="border p-2 w-full"
                      >
                        <option value="">Color AR</option>
                        {deviceColors.map((c) => (
                          <option key={c.id} value={c.color_ar}>
                            {c.color_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="block mb-1 font-medium">
                    Color Images{" "}
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setDeviceImageFiles({
                        ...deviceImageFiles,
                        [idx]: Array.from(e.target.files),
                      })
                    }
                    className="border p-2 w-full"
                  />

                  <div className="flex gap-2 flex-wrap">
                    {d.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              ))}

            {/* ================= LIQUID ================= */}
            {editItem.category_key === "liquid" && editItem.liquid && (
              <div className="border p-4 rounded space-y-4">
                {["size", "nicotine", "flavor"].map((f) => (
                  <div key={f} className="space-y-2">
                    {/* Title */}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1  font-medium">
                          {f} EN
                        </label>
                        <input
                          value={editItem.liquid[`${f}_en`] || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              liquid: {
                                ...editItem.liquid,
                                [`${f}_en`]: e.target.value,
                              },
                            })
                          }
                          className="border p-2 w-full"
                        />
                      </div>

                      <div>
                        <label className="block mb-1  font-medium">
                          {f} AR
                        </label>
                        <input
                          value={editItem.liquid[`${f}_ar`] || ""}
                          onChange={(e) =>
                            setEditItem({
                              ...editItem,
                              liquid: {
                                ...editItem.liquid,
                                [`${f}_ar`]: e.target.value,
                              },
                            })
                          }
                          className="border p-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Liquid Images */}
                <div>
                  <label className="block mb-1 font-medium">
                    Flavor Images
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setLiquidImageFiles(Array.from(e.target.files))
                    }
                    className="border p-2 w-full"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {editItem.liquid.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

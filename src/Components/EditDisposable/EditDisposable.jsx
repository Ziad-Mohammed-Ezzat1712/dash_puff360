

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditDisposable({ editItem, onClose, refreshProducts }) {
  const adminToken = localStorage.getItem("adminToken");

  const initialVariant = {
    variant_id: "",
    flavor_en: "",
    flavor_ar: "",
    size_en: "",
    size_ar: "",
    nicotine_en: "",
    nicotine_ar: "",
    price_var: "",
    stock_var: "",
    style_en: "",
    style_ar: "",
number_of_puffs:"",
    flavor_images: [],
    previewImages: [],
    old_flavor_images: [],
  };

  // ================= Dropdown Data =================

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [brandRes, typeRes, styleRes] = await Promise.all([
          axios.get(`/api/brand/getBrands.php?nocache=${Date.now()}`),
          axios.get(`/api/productType/getAllType.php?nocache=${Date.now()}`),
          axios.get(`/api/vapingStyles/getAllVapingStyles.php?nocache=${Date.now()}`),
        ]);

        setBrands(brandRes.data.data || []);
        setTypes(typeRes.data.data || []);
        setStyles(styleRes.data.data || []);
      } catch {
        toast.error("Error loading dropdown data ❌");
      }
    };

    fetchDropdowns();
  }, []);

  // ================= State =================

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (!editItem) return;

    console.log("EDIT ITEM DATA:", editItem);

    setProductData({
      name_en: editItem.data?.product_name_en || "",
      name_ar: editItem.data?.product_name_ar || "",
      description_en: editItem.data?.description_en || "",
      description_ar: editItem.data?.description_ar || "",
            category_en: editItem.data?.category_en || "disposable",
      category_ar: editItem.data?.category_ar || "ديسبوسابول",
      brand_en: editItem.data?.brand_en || "",
      brand_ar: editItem.data?.brand_ar || "",
      type_en: editItem.data?.type_en || "",
      type_ar: editItem.data?.type_ar || "",
      image: null,
      previewImage: editItem.data?.image || null,
    });

    setVariants(
      editItem.disposable?.length
        ? editItem.disposable.map((v) => ({
            variant_id: v.variant_id || "",
            flavor_en: v.flavor_en || "",
            flavor_ar: v.flavor_ar || "",
            size_en: v.size_en || "",
            size_ar: v.size_ar || "",
            nicotine_en: v.nicotine_en || "",
            nicotine_ar: v.nicotine_ar || "",
            price_var: v.price || "",
            stock_var: v.stock || "",
            style_en: v.style_en || "",
            style_ar: v.style_ar || "",
            number_of_puffs: v.number_of_puffs || "",
            flavor_images: [],
            previewImages: [],
            old_flavor_images: v.images || [],
          }))
        : [initialVariant]
    );
  }, [editItem]);

  // ================= Handlers =================

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setProductData({
        ...productData,
        image: files[0],
        previewImage: URL.createObjectURL(files[0]),
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;

    const updated = [...variants];

    if (files) {
      updated[index].flavor_images = Array.from(files);
      updated[index].previewImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
    } else {
      updated[index][name] = value;
    }

    setVariants(updated);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, initialVariant]);
  };

  const removeOldImage = (variantIndex, imgIndex) => {
    const updated = [...variants];
    updated[variantIndex].old_flavor_images.splice(imgIndex, 1);
    setVariants(updated);
  };

  // ================= Submit =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key !== "previewImage" && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    formData.append("product_id", editItem.data?.product_id);

variants.forEach((variant, index) => {

  formData.append(`variant_id[${index}]`, variant.variant_id || "");

  [
    "flavor_en",
    "flavor_ar",
    "size_en",
    "size_ar",
    "nicotine_en",
    "nicotine_ar",
    "price_var",
    "stock_var",
    "style_en",
    "style_ar",
  ].forEach((field) => {
    formData.append(`${field}[${index}]`, variant[field] || "");
  });

formData.append(`num_puffs`, variant.number_of_puffs || "");

  variant.flavor_images.forEach((img) => {
    formData.append(`flavor_images[${index}][]`, img);
  });

  variant.old_flavor_images.forEach((img) => {
    formData.append(`old_flavor_images[${index}][]`, img);
  });

});
    // debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.post("/api/products/updateProduct.php", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product Updated Successfully ✅");

      refreshProducts();
      onClose();

    } catch (err) {

      console.log(err);
      toast.error("Update Failed ❌");

    }

    setLoading(false);
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-6">

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6"
      >

        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Edit disposable Product
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 font-bold text-xl"
        >
          ×
        </button>

        {/* ================= Basic Info ================= */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name_en"
            value={productData.name_en || ""}
            onChange={handleProductChange}
            placeholder="Name EN"
            className="border p-2 rounded-lg"
          />

          <input
            name="name_ar"
            value={productData.name_ar || ""}
            onChange={handleProductChange}
            placeholder="Name AR"
            className="border p-2 rounded-lg"
          />

          <select
            value={productData.brand_en || ""}
            onChange={(e) => {
              const selected = brands.find((b) => b.name_en === e.target.value);

              setProductData({
                ...productData,
                brand_id: selected?.id || "",
brand_en: selected?.name_en || "",
brand_ar: selected?.name_ar || "",
            
              });
            }}
            className="border p-2 rounded-lg"
          >
            <option value="">Select Brand</option>

            {brands.map((b) => (
              <option key={b.id} value={b.name_en}>
                {b.name_en}
              </option>
            ))}
          </select>

          <select
            value={productData.type_en || ""}
            onChange={(e) => {
              const selected = types.find((t) => t.name_en === e.target.value);

              setProductData({
                ...productData,
            type_id: selected?.id || "",
type_en: selected?.name_en || "",
type_ar: selected?.name_ar || "",
              });
            }}
            className="border p-2 rounded-lg"
          >
            <option value="">Select Type</option>

            {types.map((t) => (
              <option key={t.id} value={t.name_en}>
                {t.name_en}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description_en"
          value={productData.description_en || ""}
          onChange={handleProductChange}
          placeholder="Description EN"
          className="border p-2 rounded-lg w-full"
        />

        <textarea
          name="description_ar"
          value={productData.description_ar || ""}
          onChange={handleProductChange}
          placeholder="Description AR"
          className="border p-2 rounded-lg w-full"
        />

        {/* main image */}

        <input type="file" onChange={handleProductChange} />

        {productData.previewImage && (
          <img
            src={productData.previewImage}
            className="w-24 h-24 rounded object-cover"
            alt=""
          />
        )}

        {/* ================= Variants ================= */}

        {variants.map((variant, index) => (

          <div key={index} className="border rounded-xl p-4 bg-gray-50">

            <h3 className="font-bold mb-2">Variant {index + 1}</h3>

            <div className="grid md:grid-cols-3 gap-2">

              {[
                "flavor_en",
                "flavor_ar",
                "size_en",
                "size_ar",
                "nicotine_en",
                "nicotine_ar",
                "price_var",
                "stock_var",
                "number_of_puffs",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={variant[field] || ""}
                  onChange={(e) => handleVariantChange(index, e)}
                  placeholder={field}
                  className="border p-2 rounded"
                />
              ))}

              <select
                value={variant.style_en || ""}
                onChange={(e) => {

                  const selected = styles.find(
                    (s) => s.style_en === e.target.value
                  );

                  const updated = [...variants];

                  updated[index].style_id = selected?.style_id || "";
                  updated[index].style_en = selected?.style_en || "";
                  updated[index].style_ar = selected?.style_ar || "";

                  setVariants(updated);

                }}
                className="border p-2 rounded"
              >
                <option value="">Select Style</option>

                {styles.map((s) => (
                  <option key={s.id} value={s.style_en}>
                    {s.style_ar}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="file"
              multiple
              onChange={(e) => handleVariantChange(index, e)}
            />

            <div className="flex gap-2 mt-2 flex-wrap">

              {variant.old_flavor_images.map((img, i) => (
                <div key={i} className="relative">

                  <img
                    src={img}
                    className="w-16 h-16 object-cover rounded"
                    alt=""
                  />

                  <button
                    type="button"
                    onClick={() => removeOldImage(index, i)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                  >
                    X
                  </button>

                </div>
              ))}

              {variant.previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-16 h-16 object-cover rounded"
                  alt=""
                />
              ))}
            </div>
          </div>

        ))}

        <button
          type="button"
          onClick={addVariant}
          className="bg-blue-900 text-white px-4 py-1 rounded"
        >
          + Add Variant
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#830808] text-white py-2 rounded-xl"
        >
          {loading ? "Updating Product..." : "Update Product"}
        </button>

      </form>
    </div>
  );
}



// num_puffs: v.number_of_puffs || "", // ✅ اسم الحقل في الريسبونس
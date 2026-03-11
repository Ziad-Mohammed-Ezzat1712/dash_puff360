

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditAccessories({ editItem, onClose, refreshProducts }) {
  const adminToken = localStorage.getItem("adminToken");

  const initialVariant = {
    variant_id: "",
    color_en: "",
    color_ar: "",
    price: "",
    stock: "",
    images: [],
    previewImages: [],
    old_images: [],
  };

  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    category_en: "accessories",
    category_ar: "اكسسوارات",
    brand_en: "",
    brand_ar: "",
   
    image: null,
    previewImage: null,
  });

  const [variants, setVariants] = useState([initialVariant]);

  // ================= Dropdowns =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, colorRes] = await Promise.all([
          axios.get(`https://dashboard.splash-e-liquid.com/brand/getBrands.php?nocache=${Date.now()}`),
          axios.get(`https://dashboard.splash-e-liquid.com/colors/getAllColors.php?nocache=${Date.now()}`),
        ]);

        setBrands(brandRes.data.data || []);
        setColors(colorRes.data.data || []);
      } catch {
        toast.error("Dropdown Load Error ❌");
      }
    };

    fetchData();
  }, []);

  // ================= Load Product =================
  useEffect(() => {
    if (!editItem) return;

    setProductData({
      name_en: editItem.data?.product_name_en || "",
      name_ar: editItem.data?.product_name_ar || "",
      description_en: editItem.data?.description_en || "",
      description_ar: editItem.data?.description_ar || "",
      category_en: editItem.data?.category_en || "accessories",
      category_ar: editItem.data?.category_ar || "اكسسوارات",
      brand_en: editItem.data?.brand_en || "",
      brand_ar: editItem.data?.brand_ar || "",
       image: null,
      previewImage: editItem.data?.image || null,
    });

    setVariants(
      editItem.accessories?.length
        ? editItem.accessories.map((v) => ({
            variant_id: v.variant_id || "",
            color_en: v.color_en || "",
            color_ar: v.color_ar || "",
            price: v.price || "",
            stock: v.stock || "",
            images: [],
            previewImages: [],
            old_images: v.images || [],
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
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...variants];
    if (files) {
      updated[index].images = Array.from(files);
      updated[index].previewImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
    } else {
      updated[index][name] = value;
    }
    setVariants(updated);
  };

  const addVariant = () => setVariants([...variants, initialVariant]);
const removeVariant = (index) => {
  setVariants((prev) => prev.filter((_, i) => i !== index));
};


  const removeOldImage = (variantIndex, imgIndex) => {
    const updated = [...variants];
    updated[variantIndex].old_images.splice(imgIndex, 1);
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
      formData.append(`color_en[${index}]`, variant.color_en);
      formData.append(`color_ar[${index}]`, variant.color_ar);
      formData.append(`price_var[${index}]`, variant.price);
      formData.append(`stock_var[${index}]`, variant.stock);

      variant.images.forEach((img) => {
        formData.append(`color_images[${index}][]`, img);
      });

      variant.old_images.forEach((img) => {
        formData.append(`old_color_images[${index}][]`, img);
      });
    });

    try {
      await axios.post("https://dashboard.splash-e-liquid.com/products/updateProduct.php", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("accessories Updated Successfully 🔥");
      refreshProducts();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Update Failed ❌");
    }

    setLoading(false);
  };

  // ================= Render =================
  return (
    <div className="max-h-[90vh] overflow-y-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8"
      >
        <h2 className="text-3xl font-bold border-b pb-4">Edit accessories Product</h2>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="name_en"
            value={productData.name_en}
            onChange={handleProductChange}
            placeholder="Name EN"
            className="border p-3 rounded-lg"
          />

          <input
            name="name_ar"
            value={productData.name_ar}
            onChange={handleProductChange}
            placeholder="Name AR"
            className="border p-3 rounded-lg"
          />

 

   
        </div>

 {/* brand */}
        <div className="grid md:grid-cols-1 gap-6">
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
            className="border p-3 rounded-lg"
          >
            <option>Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name_en}>
                {brand.name_en}
              </option>
            ))}
          </select>
        </div>
        {/* Description */}
        <div className="grid md:grid-cols-2 gap-6">
          <textarea
            name="description_en"
            value={productData.description_en}
            onChange={handleProductChange}
            placeholder="Description EN"
            className="border p-3 rounded-lg h-28"
          />

          <textarea
            name="description_ar"
            value={productData.description_ar}
            onChange={handleProductChange}
            placeholder="Description AR"
            className="border p-3 rounded-lg h-28"
          />
        </div>

        {/* Main Image */}
        <input type="file" onChange={handleProductChange} />
        {productData.previewImage && (
          <img
            src={productData.previewImage}
            className="w-32 h-32 object-cover mt-4 rounded"
            alt=""
          />
        )}

        {/* Variants */}
        {variants.map((variant, index) => (
          <div key={index} className="border p-6 rounded-xl bg-gray-50">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Variant {index + 1}</h3>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={variant.color_en || ""}
                onChange={(e) => {
                  const selected = colors.find((c) => c.color_en === e.target.value);
                  const updated = [...variants];
                   updated[index].color_id = selected?.color_id || "";
                  updated[index].color_en = selected?.color_en || "";
                  updated[index].color_ar = selected?.color_ar || "";
                  setVariants(updated);
                }}
                className="border p-2 rounded"
              >
                <option>Select Color</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.color_en}>
                    {color.color_en}
                  </option>
                ))}
              </select>

              <input
                name="price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Price"
                className="border p-2 rounded"
              />

              <input
                name="stock"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Stock"
                className="border p-2 rounded"
              />
            </div>

            {/* Images */}
            <input type="file" multiple onChange={(e) => handleVariantChange(index, e)} />

            <div className="flex gap-3 mt-3 flex-wrap">
              {/* Old Images */}
              {variant.old_images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeOldImage(index, i)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                  >
                    X
                  </button>
                </div>
              ))}

              {/* New Images */}
              {variant.previewImages.map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg"
        >
          + Add Variant
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-800 text-white py-3 rounded-xl"
        >
          {loading ? "Updating accessories..." : "Update accessories"}
        </button>
      </form>
    </div>
  );
}
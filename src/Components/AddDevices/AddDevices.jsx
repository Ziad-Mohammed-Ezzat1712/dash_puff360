import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddDevices() {
  const adminToken = localStorage.getItem("adminToken");

  const initialVariant = {
    color_en: "",
    color_ar: "",
    price: "",
    stock: "",
    images: [],
    previewImages: [],
  };

  const BrandAPI = `https://dashboard.splash-e-liquid.com/brand/getBrands.php?nocache=${Date.now()}`;
  const TypeAPI = `https://dashboard.splash-e-liquid.com/productType/getAllType.php?nocache=${Date.now()}`;
  const ColorAPI = `https://dashboard.splash-e-liquid.com/colors/getAllColors.php?nocache=${Date.now()}`;
  const SubCategoryAPI = `https://dashboard.splash-e-liquid.com/subCategory/getAllSubCategory.php?nocache=${Date.now()}`;

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [brandRes, typeRes, colorRes, subCatRes] = await Promise.all([
          axios.get(BrandAPI),
          axios.get(TypeAPI),
          axios.get(ColorAPI),
          axios.get(SubCategoryAPI),
        ]);
        setBrands(brandRes.data.data || []);
        setTypes(typeRes.data.data || []);
        setColors(colorRes.data.data || []);
        setSubCategories(subCatRes.data.data || []);
      } catch {
        toast.error("Dropdown load error ❌");
      }
    };
    fetchDropdowns();
  }, []);

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    category_en: "device",
    category_ar: "جهاز",
    brand_en: "",
    brand_ar: "",
    sub_category_en: "",
    sub_category_ar: "",
    image: null,
    previewImage: null,
  });

  const [variants, setVariants] = useState([initialVariant]);

  const [errors, setErrors] = useState({
    name_en: false,
    name_ar: false,
    image: false,
  });

  // product change
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProductData({
        ...productData,
        image: files[0],
        previewImage: URL.createObjectURL(files[0]),
      });
      setErrors({ ...errors, image: false });
    } else {
      setProductData({ ...productData, [name]: value });
      setErrors({ ...errors, [name]: false });
    }
  };

  // variant change
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
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const resetForm = () => {
    setProductData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      category_en: "device",
      category_ar: "جهاز",
      brand_en: "",
      brand_ar: "",
      sub_category_en: "",
      sub_category_ar: "",
      image: null,
      previewImage: null,
    });
    setVariants([initialVariant]);
    setErrors({ name_en: false, name_ar: false, image: false });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== Validation =====
    const newErrors = {
      name_en: !productData.name_en.trim(),
      name_ar: !productData.name_ar.trim(),
      image: !productData.image,
    };
    setErrors(newErrors);

    const errorFields = [];
    if (newErrors.name_en) errorFields.push("Name EN");
    if (newErrors.name_ar) errorFields.push("Name AR");
    if (newErrors.image) errorFields.push("Main Image");

    if (errorFields.length > 0) {
      toast.error(`Required: ${errorFields.join(", ")}`);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key !== "previewImage") formData.append(key, productData[key]);
    });

    variants.forEach((variant, index) => {
      formData.append(`color_en[${index}]`, variant.color_en);
      formData.append(`color_ar[${index}]`, variant.color_ar);
      formData.append(`color_price[${index}]`, variant.price);
      formData.append(`color_stock[${index}]`, variant.stock);
      variant.images.forEach((img) =>
        formData.append(`color_images[${index}][]`, img)
      );
    });

    try {
      await axios.post("https://dashboard.splash-e-liquid.com/products/addProducts.php", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Device Added Successfully 🔥");
      resetForm();
    } catch (err) {
      toast.error("Something went wrong ❌");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8"
      >
        <h2 className="text-3xl font-bold border-b pb-4">Add Device Product</h2>

        {/* basic info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="name_en"
            value={productData.name_en}
            onChange={handleProductChange}
            placeholder="Name EN"
            className={`border p-3 rounded-lg ${
              errors.name_en ? "border-red-500" : "border-black"
            }`}
          />

          <input
            name="name_ar"
            value={productData.name_ar}
            onChange={handleProductChange}
            placeholder="Name AR"
            className={`border p-3 rounded-lg ${
              errors.name_ar ? "border-red-500" : "border-black"
            }`}
          />

          {/* brand */}
          <select
            onChange={(e) => {
              const selected = brands.find((b) => b.name_en === e.target.value);
              setProductData({
                ...productData,
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

          {/* sub category */}
          <select
            onChange={(e) => {
              const selected = subCategories.find(
                (sc) => sc.sub_category_en === e.target.value
              );
              setProductData({
                ...productData,
                sub_category_en: selected?.sub_category_en || "",
                sub_category_ar: selected?.sub_category_ar || "",
              });
            }}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.sub_category_en}>
                {sub.sub_category_en}
              </option>
            ))}
          </select>
        </div>

        {/* description */}
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

        {/* main image */}
        <input
          type="file"
          onChange={handleProductChange}
          className={`${errors.image ? "border border-red-500" : ""}`}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">Main image is required</p>
        )}
        {productData.previewImage && (
          <img
            src={productData.previewImage}
            className="w-32 h-32 object-cover mt-4 rounded"
          />
        )}

        {/* variants */}
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
                onChange={(e) => {
                  const selected = colors.find((c) => c.color_en === e.target.value);
                  const updated = [...variants];
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

            <input
              type="file"
              multiple
              onChange={(e) => handleVariantChange(index, e)}
            />

            <div className="flex gap-3 mt-3 flex-wrap">
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
          className="w-full bg-red-800 cursor-pointer text-white py-3 rounded-xl"
        >
          {loading ? "Adding Device..." : "Add Device"}
        </button>
      </form>
    </div>
  );
}
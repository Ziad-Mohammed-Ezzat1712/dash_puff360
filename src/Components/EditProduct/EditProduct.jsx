import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditProduct({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [brandImage, setBrandImage] = useState(null);
  const [deviceImages, setDeviceImages] = useState([]);
  const [flavorImages, setFlavorImages] = useState([]);

  useEffect(() => {
    if (product) {
      setForm({
        name_en: product.name_en,
        name_ar: product.name_ar,
        description_en: product.description_en,
        description_ar: product.description_ar,
        price: product.price,
        stock: product.stock,
        brand_name_en: product.brand?.name_en || "",
        brand_name_ar: product.brand?.name_ar || "",
      });

      setMainImage(product.image || null);
      setBrandImage(product.brand?.image || null);
      setDeviceImages(
        product.device?.map((d) => d.images || []).flat() || []
      );
      setFlavorImages(product.liquid?.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, setter, multiple = false) => {
    if (multiple) {
      const files = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setter(files);
    } else {
      setter(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // هنا هيتربط بالـ API بعد كده
    console.log("EDIT DATA", {
      product_id: product.product_id,
      ...form,
      mainImage,
      brandImage,
      deviceImages,
      flavorImages,
    });

    onUpdated();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="name_en"
              value={form.name_en || ""}
              onChange={handleChange}
              placeholder="Name EN"
              className="input"
            />
            <input
              name="name_ar"
              value={form.name_ar || ""}
              onChange={handleChange}
              placeholder="Name AR"
              className="input"
            />
          </div>

          {/* Descriptions */}
          <textarea
            name="description_en"
            value={form.description_en || ""}
            onChange={handleChange}
            placeholder="Description EN"
            className="input"
          />
          <textarea
            name="description_ar"
            value={form.description_ar || ""}
            onChange={handleChange}
            placeholder="Description AR"
            className="input"
          />

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              placeholder="Price"
              className="input"
            />
            <input
              type="number"
              name="stock"
              value={form.stock || ""}
              onChange={handleChange}
              placeholder="Stock"
              className="input"
            />
          </div>

          {/* Brand */}
          <div className="border rounded p-3 space-y-2">
            <p className="font-semibold">Brand Info</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="brand_name_en"
                value={form.brand_name_en || ""}
                onChange={handleChange}
                placeholder="Brand EN"
                className="input"
              />
              <input
                name="brand_name_ar"
                value={form.brand_name_ar || ""}
                onChange={handleChange}
                placeholder="Brand AR"
                className="input"
              />
            </div>
            <div>
              <p className="text-sm mb-1">Brand Image:</p>
              {brandImage && (
                <img
                  src={brandImage}
                  className="w-16 h-16 rounded object-cover mb-1"
                />
              )}
              <input
                type="file"
                onChange={(e) => handleImageChange(e, setBrandImage)}
              />
            </div>
          </div>

          {/* Main Image */}
          <div>
            <p className="text-sm mb-1">Main Image:</p>
            {mainImage && (
              <img
                src={mainImage}
                className="w-32 h-32 rounded object-cover mb-1"
              />
            )}
            <input
              type="file"
              onChange={(e) => handleImageChange(e, setMainImage)}
            />
          </div>

          {/* Device / Liquid Info */}
          {product.category_key === "device" && (
            <div className="border rounded p-3 space-y-2">
              <p className="font-semibold">Device Colors Images</p>
              <div className="flex gap-2 overflow-x-auto mb-2">
                {deviceImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-16 h-16 rounded object-cover border"
                  />
                ))}
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(e, setDeviceImages, true)}
              />
            </div>
          )}

          {product.category_key === "liquid" && (
            <div className="border rounded p-3 space-y-2">
              <p className="font-semibold">Flavor Images</p>
              <div className="flex gap-2 overflow-x-auto mb-2">
                {flavorImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-16 h-16 rounded object-cover border"
                  />
                ))}
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(e, setFlavorImages, true)}
              />
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

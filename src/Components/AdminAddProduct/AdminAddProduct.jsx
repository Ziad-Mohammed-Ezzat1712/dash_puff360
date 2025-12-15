import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

export default function AdminAddProduct() {
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [colorImages, setColorImages] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [colorFiles, setColorFiles] = useState([]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAddColorImages = () => {
    if (!colorInput || colorFiles.length === 0) return;
    setColorImages((prev) => [
      ...prev,
      { color: colorInput.toLowerCase().trim(), images: [...colorFiles] },
    ]);
    setColorInput('');
    setColorFiles([]);
  };

  const removeColorGroup = (index) => {
    const updated = [...colorImages];
    updated.splice(index, 1);
    setColorImages(updated);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      sizes: '',
      stock: '',
      admin_rating: '',
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      for (const key in values) formData.append(key, values[key]);
      if (coverImage) formData.append('cover_image', coverImage);

      const colorsArray = colorImages.map((item) => item.color);
      const colorImageMap = {};
      colorImages.forEach((item) => {
        colorImageMap[item.color] = item.images.length;
        item.images.forEach((img) => formData.append('images[]', img));
      });

      formData.append('colors', JSON.stringify(colorsArray));
      formData.append('color_images_map', JSON.stringify(colorImageMap));

      try {
        const { data } = await axios.post(
          'http://localhost/traffic/clothing%20store/products/addProduct.php',
          formData
        );
        alert('Product added successfully!');
        console.log(data);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
  });

  return (
    <div className="my-12 px-4">
      <h1 className="text-4xl text-[#9BC2AF] font-bold mb-8 text-center">
        Add New Product
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-[#E5E7EB]"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <input
            name="name"
            placeholder="Product Name"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
          <input
            name="brand"
            placeholder="Brand"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
          <input
            name="category"
            placeholder="Category"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
          <input
            name="sizes"
            placeholder="Sizes (e.g. L,M,XL)"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={formik.handleChange}
          rows={4}
          className="border border-[#606160] p-3 w-full mt-4 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
        />

        <input
          name="admin_rating"
          type="number"
          step="0.1"
          placeholder="Admin Rating (e.g. 4.5)"
          onChange={formik.handleChange}
          className="border border-[#606160] p-2 w-full mt-4 rounded-md focus:ring-2 focus:ring-[#9BC2AF] outline-none"
        />

        {/* Cover Image Upload */}
        <div className="mt-6">
          <label className="block font-semibold text-[#606160] mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0 file:text-sm file:font-semibold
            file:bg-[#9BC2AF] file:text-white hover:file:bg-[#88AF9A] transition"
          />
          {coverPreview && (
            <div className="mt-3 relative w-36 h-36">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null);
                  setCoverPreview(null);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-0.5 text-sm"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Color + Images Upload */}
        <div className="mt-8">
          <label className="block font-semibold text-[#606160] mb-2">
            Add Color Variants
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Color (e.g. Red)"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="border border-[#606160] p-2 rounded-md flex-1 focus:ring-2 focus:ring-[#9BC2AF] outline-none"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setColorFiles(Array.from(e.target.files))}
              className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4
              file:rounded-md file:border-0 file:font-semibold
              file:bg-[#9BC2AF] file:text-white hover:file:bg-[#88AF9A] transition"
            />
            <button
              type="button"
              onClick={handleAddColorImages}
              className="bg-[#9BC2AF] text-white px-4 py-2 rounded-md hover:bg-[#88AF9A] transition"
            >
              Add
            </button>
          </div>

          {/* Display color groups */}
          {colorImages.map((group, idx) => (
            <div
              key={idx}
              className="mt-4 border border-gray-200 p-3 rounded-lg bg-[#F9FAFB]"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-[#606160]">
                  Color: {group.color}
                </p>
                <button
                  type="button"
                  onClick={() => removeColorGroup(idx)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="w-20 h-20 object-cover rounded border"
                    alt="color"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-[#9BC2AF] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#88AF9A] transition shadow-md"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

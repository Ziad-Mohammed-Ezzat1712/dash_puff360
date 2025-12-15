import React from "react";
import { useFormik } from "formik";
import axios from "axios";

export default function AdminAddShipping() {
  const formik = useFormik({
    initialValues: {
      governorate: "",
      price: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        // ✅ بعدين تقدر تضيف هنا API حقيقية
        // const { data } = await axios.post("API_URL_HERE", values);
        console.log("Shipping Added:", values);
        alert("Shipping info added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding shipping:", error);
      }
    },
  });

  return (
    <div className="my-12 px-4">
      <h1 className="text-4xl text-[#9BC2AF] font-bold mb-8 text-center">
        Add Shipping Info
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-[#E5E7EB]"
      >
        {/* Governorate */}
        <div className="mb-5">
          <label
            htmlFor="governorate"
            className="block font-semibold text-[#606160] mb-2"
          >
            Governorate Name
          </label>
          <input
            id="governorate"
            name="governorate"
            placeholder="e.g. Cairo"
            value={formik.values.governorate}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
        </div>

        {/* Shipping Price */}
        <div className="mb-8">
          <label
            htmlFor="price"
            className="block font-semibold text-[#606160] mb-2"
          >
            Shipping Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="e.g. 50"
            value={formik.values.price}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#9BC2AF] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#88AF9A] transition shadow-md"
          >
            Add Shipping
          </button>
        </div>
      </form>
    </div>
  );
}

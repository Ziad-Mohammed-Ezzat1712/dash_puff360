
import React from "react";
import { useFormik } from "formik";
import axios from "axios";

export default function AddDiscount() {
  const formik = useFormik({
    initialValues: {
      code: "",
      type: "fixed",
      duration_minutes: "",
      value: "",
      usage_limit: "",
      is_spinner: "0",
      min_amount: "",
      description: "",
      label: "",
      probability: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        // ✅ لاحقًا تضيف هنا لينك الـ API الحقيقي
        // await axios.post("API_URL_HERE", values);
        console.log("Discount Added:", values);
        alert("Discount added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding discount:", error);
      }
    },
  });

  return (
    <div className="my-12 px-4">
      <h1 className="text-4xl text-[#9BC2AF] font-bold mb-8 text-center">
        Add Discount
      </h1>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Code */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">Code</label>
          <input
            name="code"
            placeholder="e.g. ITEMfdxmdcdmfm"
            value={formik.values.code}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF] outline-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">Type</label>
          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          >
            <option value="fixed">Fixed</option>
            <option value="percent">Percent</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Duration (minutes)
          </label>
          <input
            name="duration_minutes"
            type="number"
            placeholder="e.g. 2880"
            value={formik.values.duration_minutes}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Value */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Value
          </label>
          <input
            name="value"
            type="number"
            placeholder="e.g. 20"
            value={formik.values.value}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Usage Limit */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Usage Limit
          </label>
          <input
            name="usage_limit"
            type="number"
            placeholder="e.g. 10"
            value={formik.values.usage_limit}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Spinner */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Is Spinner
          </label>
          <select
            name="is_spinner"
            value={formik.values.is_spinner}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Min Amount
          </label>
          <input
            name="min_amount"
            type="number"
            placeholder="e.g. 100"
            value={formik.values.min_amount}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Probability */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">
            Probability
          </label>
          <input
            name="probability"
            type="number"
            placeholder="e.g. 5"
            value={formik.values.probability}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Label */}
        <div>
          <label className="block font-semibold text-[#606160] mb-2">Label</label>
          <input
            name="label"
            placeholder="e.g. discount10%"
            value={formik.values.label}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF]"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-[#606160] mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="summer discount"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="border border-[#606160] p-2 rounded-md w-full focus:ring-2 focus:ring-[#9BC2AF] min-h-[80px]"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-[#9BC2AF] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#88AF9A] transition shadow-md"
          >
            Add Discount
          </button>
        </div>
      </form>
    </div>
  );
}

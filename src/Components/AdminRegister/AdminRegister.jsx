import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const url = "https://dashboard.splash-e-liquid.com/auth/adminAuth/adminRegister.php";
    const data = qs.stringify(form);

    try {
      const res = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log(res.data);
      if (res.data.status === true) {
        toast.success(res.data.message ||"✅ Registration successful! You can now login.");
        setTimeout(() => navigate("/dashboardlayout"), 1200);
      } else {
        toast.error(res.data.message || "❌ Registration failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Registration error!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-300 text-[#440707] rounded-2xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#440707] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#440707] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#440707] outline-none"
          />
          <button
            type="submit"
            className="w-full bg-[#440707] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#5a0e0e] transition shadow-2xl"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a
            href="/"
            className="text-[#440707] font-semibold cursor-pointer"
          >
            Login
          </a>
        </p>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      </div>
    </div>
  );
}

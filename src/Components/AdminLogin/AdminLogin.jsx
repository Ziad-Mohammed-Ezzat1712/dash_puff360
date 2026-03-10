import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = "https://dashboard.splash-e-liquid.com/auth/adminAuth/login.php";
    const data = qs.stringify(form);

    try {
      const res = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // console.log(res.data);
      // console.log(res.data.data.token);
      if (res.data.status === true) {
        const { token } = res.data.data;
        const { name, email, id } = res.data.data?.admin;
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminName", name);
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminId", id);

        toast.success(res.data.message ||"✅ Login successful!");
        setTimeout(() => navigate("/dashboardlayout"), 1200);
      } else {
        toast.error(res.data.message || "❌ Login failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login error!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-300 text-[#440707] rounded-2xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/adminRegister"
            className="text-[#440707] font-semibold cursor-pointer"
          >
            Register
          </a>
        </p>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      </div>
    </div>
  );
}

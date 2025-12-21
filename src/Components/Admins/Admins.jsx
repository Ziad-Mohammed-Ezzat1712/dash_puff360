import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Trash2 } from "lucide-react";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken"); // التوكن المخزن

  // جلب الأدمنز
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://dashboard.splash-e-liquid.com/auth/adminAuth/getAllAdmins.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status) {
        setAdmins(res.data.data);
      } else {
        alert(res.data.message || "Failed to fetch admins");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Error fetching admins. Check token."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // حذف أدمن
  const deleteAdmin = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (!confirmDelete) return;

    try {
      const formData = new FormData();
      formData.append("id", id);

      const res = await axios.post(
        `https://dashboard.splash-e-liquid.com/auth/adminAuth/deleteAdmin.php`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        alert("Admin deleted successfully");
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      } else {
        alert(res.data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Error deleting admin. Check token."
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admins</h2>

      {loading ? (
        <p>Loading...</p>
      ) : admins.length === 0 ? (
        <p>No admins found</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
       
              <th className="p-2 ">Name</th>
              <th className="p-2 ">Email</th>
           
              <th className="p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="text-center">
                
                <td className="p-2  flex items-center justify-center gap-2">
                  <User size={18} /> {admin.name}
                </td>
                <td className="p-2 ">{admin.email}</td>
                
                <td className="p-2 ">
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="flex items-center gap-1 mx-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

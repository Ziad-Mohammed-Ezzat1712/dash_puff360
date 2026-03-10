


 import React, { useEffect, useState } from "react";
 import axios from "axios";

 import toast from "react-hot-toast";

import EditDevices from "../EditDevices/EditDevices";
import DevicesTable from "../DevicesTable/DevicesTable";
import PodTable from "../PodTable/PodTable";
 
 
 export default function PodProducts() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showEditPopup, setShowEditPopup] = useState(false);
   const [editItem, setEditItem] = useState(null);
 
   // ================= FETCH PRODUCTS =================
   const fetchProducts = async () => {
     try {
       const res = await axios.get(`/api/products/getallproducts.php?nocache=${Date.now()}`);
     if (res.data.status) {
       setProducts(res.data.data) ;
        console.log(res.data.data);
     }
     } catch (err) {
       console.log(err);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchProducts();
   }, []);
 
 const handleDelete = async (id) => {
   if (!window.confirm("Are you sure?")) return;
 
   const token = localStorage.getItem("adminToken");
 
   const formData = new FormData();
   formData.append("product_id", id);
 
   try {
     const res = await axios.post(
       "/api/products/deleteProducts.php",
       formData,
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
 
     console.log(res.data);
 
     setProducts((prev) =>
       prev.filter((p) => p.data.product_id !== id)
     );
 
     toast.success("Deleted ✅");
   } catch (err) {
     console.log(err.response?.data);
     toast.error("Delete failed ❌");
   }
 };
   // ================= OPEN EDIT POPUP =================
   const openEditPopup = (item) => {
     setEditItem(item);
     setShowEditPopup(true);
   };
 
   // ================= CLOSE EDIT POPUP =================
   const closeEditPopup = () => {
     setEditItem(null);
     setShowEditPopup(false);
   };
 
   return (
     <div className="p-6">
       <h1 className="text-3xl font-bold mb-6">Liquid Products Dashboard</h1>
 
       {loading ? (
         <p>Loading...</p>
       ) : (
         <PodTable products={products} onEdit={openEditPopup} onDelete={handleDelete} />
       )}
 
       {/* ================= EDIT POPUP ================= */}
       {showEditPopup && editItem && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white w-full max-w-6xl p-6 rounded-2xl shadow-xl relative">
             <button
               className="absolute top-4 right-4 text-red-500 font-bold text-xl"
               onClick={closeEditPopup}
             >
               &times;
             </button>
 
             <EditDevices
               editItem={editItem}
               onClose={closeEditPopup}
               refreshProducts={fetchProducts}
             />
           </div>
         </div>
       )}
     </div>
   );
 }
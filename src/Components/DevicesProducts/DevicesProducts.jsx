
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductsTable from "../ProductsTable/ProductsTable";
// import LiquidTable from "../LiquidTable/LiquidTable";
// import SaltTable from "../SaltTable/SaltTable";
// import DevicesTable from '../DevicesTable/DevicesTable';

// export default function DevicesProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showPopup, setShowPopup] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [brands, setBrands] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [vapingStyle, setVapingStyle] = useState([]);
//   const [deviceColors, setDeviceColors] = useState([]);
//   const [deviceImageFiles, setDeviceImageFiles] = useState({});
//   const [liquidImageFiles, setLiquidImageFiles] = useState([]);
//   const [saltImageFiles, setSaltImageFiles] = useState([]);
//   const [disposableImageFiles, setDisposableImageFiles] = useState([]);
//   const [accessoriesImageFiles, setAccessoriesImageFiles] = useState({});

//   // ================= FETCH =================
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(
//         `https://dashboard.splash-e-liquid.com/products/getallproducts.php?nocache=${Date.now()}`,
//       );
//       if (res.data.status) {
//         setProducts(res.data.data);
//         console.log(res.data.data);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSelectors = async () => {
//     try {
//       const [b, t, c, v] = await Promise.all([
//         axios.get(`https://dashboard.splash-e-liquid.com/brand/getBrands.php?nocache=${Date.now()}`),
//         axios.get(`https://dashboard.splash-e-liquid.com/productType/getAllType.php?nocache=${Date.now()}`),
//         axios.get(`https://dashboard.splash-e-liquid.com/colors/getAllColors.php?nocache=${Date.now()}`),
//         axios.get(
//           `https://dashboard.splash-e-liquid.com/vapingStyles/getAllVapingStyles.php?nocache=${Date.now()}`,
//         ),
//       ]);

//       setBrands(b.data.data || []);
//       setTypes(t.data.data || []);
//       setDeviceColors(c.data.data || []);
//       setVapingStyle(v.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchSelectors();
//   }, []);

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     const token = localStorage.getItem("adminToken");
//     if (!token) return alert("No token");

//     try {
//       await axios.post(
//         "https://dashboard.splash-e-liquid.com/products/deleteProducts.php",
//         new URLSearchParams({ product_id: id }),
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setProducts((prev) => prev.filter((p) => p.product_id !== id));
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   // ================= EDIT =================
//   const openEditPopup = (item) => {
//     setEditItem(JSON.parse(JSON.stringify(item)));
//     setDeviceImageFiles({});
//     setLiquidImageFiles([]);
//     setSaltImageFiles([]);
//     setDisposableImageFiles([]);
//     setAccessoriesImageFiles([]);
//     setShowPopup(true);
//   };

//   // ================= SUBMIT =================
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("adminToken");
//     if (!token) return alert("No token");
//     setLoading(true); // تشغيل اللودينج
//     try {
//       const formData = new FormData();

//       // BASIC
//       formData.append("product_id", editItem.product_id);
//       formData.append("name_en", editItem.name_en);
//       formData.append("name_ar", editItem.name_ar);
//       formData.append("description_en", editItem.description_en);
//       formData.append("description_ar", editItem.description_ar);
//       formData.append("price", editItem.price);
//       formData.append("stock", editItem.stock);

//       // BRAND (KEYS)
//       formData.append("brand_en", editItem.brand?.name_en || "");
//       formData.append("brand_ar", editItem.brand?.name_ar || "");
//       formData.append("style_en", editItem.vaping_style?.name_en || "");
//       formData.append("style_ar", editItem.vaping_style?.name_ar || "");
//       // MAIN IMAGE
//       if (editItem.imageFile) {
//         formData.append("image", editItem.imageFile);
//       }

//       // ========== LIQUID ==========
//       if (editItem.category_key === "liquid") {
//         formData.append("flavor_en", editItem.liquid.flavor_en);
//         formData.append("flavor_ar", editItem.liquid.flavor_ar);
//         formData.append("size_en", editItem.liquid.size_en);
//         formData.append("size_ar", editItem.liquid.size_ar);
//         formData.append("nicotine_en", editItem.liquid.nicotine_en);
//         formData.append("nicotine_ar", editItem.liquid.nicotine_ar);

//         // TYPE (KEY)
//         formData.append("type_en", editItem.type?.name_en || "");
//         formData.append("type_ar", editItem.type?.name_ar || "");

//         liquidImageFiles.forEach((file) => {
//           formData.append("flavor_images[]", file);
//         });

//         editItem.liquid.images.forEach((img) => {
//           formData.append("old_flavor_images[]", img);
//         });
//       }

//       // ========== SALT ==========
//       if (editItem.category_key === "salt") {
//         formData.append("flavor_en", editItem.salt.flavor_en);
//         formData.append("flavor_ar", editItem.salt.flavor_ar);
//         formData.append("size_en", editItem.salt.size_en);
//         formData.append("size_ar", editItem.salt.size_ar);
//         formData.append("nicotine_en", editItem.salt.nicotine_en);
//         formData.append("nicotine_ar", editItem.salt.nicotine_ar);

//         // TYPE (KEY)
//         formData.append("type_en", editItem.type?.name_en || "");
//         formData.append("type_ar", editItem.type?.name_ar || "");

//         saltImageFiles.forEach((file) => {
//           formData.append("flavor_images[]", file);
//         });

//         editItem.salt.images.forEach((img) => {
//           formData.append("old_flavor_images[]", img);
//         });
//       }
//       // ========== DISPOSABLE ==========
//       if (editItem.category_key === "disposable") {
//         formData.append("flavor_en", editItem.disposable.flavor_en);
//         formData.append("flavor_ar", editItem.disposable.flavor_ar);
//         formData.append("size_en", editItem.disposable.size_en);
//         formData.append("size_ar", editItem.disposable.size_ar);
//         formData.append("nicotine_en", editItem.disposable.nicotine_en);
//         formData.append("nicotine_ar", editItem.disposable.nicotine_ar);
//         formData.append("num_puffs", editItem.num_puffs);
//         // TYPE (KEY)
//         formData.append("type_en", editItem.type?.name_en || "");
//         formData.append("type_ar", editItem.type?.name_ar || "");

//         disposableImageFiles.forEach((file) => {
//           formData.append("flavor_images[]", file);
//         });

//         editItem.disposable.images.forEach((img) => {
//           formData.append("old_flavor_images[]", img);
//         });
//       }

//       // ========== DEVICE ==========
//       if (editItem.category_key === "device" && editItem.device.length > 0) {
//         editItem.device.forEach((device, index) => {
//           // Append color keys
//           formData.append(`color_en[${index}]`, device.color_en);
//           formData.append(`color_ar[${index}]`, device.color_ar);

//           // NEW COLOR IMAGES
//           if (deviceImageFiles[index] && deviceImageFiles[index].length > 0) {
//             deviceImageFiles[index].forEach((file) => {
//               formData.append(`color_images[${index}][]`, file);
//             });
//           }

//           // OLD COLOR IMAGES
//           if (device.images && device.images.length > 0) {
//             device.images.forEach((img) => {
//               formData.append(`old_color_images[${index}][]`, img);
//             });
//           }
//         });
//       }

//       // ========== accessories ==========
//       if (
//         editItem.category_key === "accessories" &&
//         editItem.accessories.length > 0
//       ) {
//         editItem.accessories.forEach((accessories, index) => {
//           // Append color keys
//           formData.append(`color_en[${index}]`, accessories.color_en);
//           formData.append(`color_ar[${index}]`, accessories.color_ar);

//           // NEW COLOR IMAGES
//           if (
//             accessoriesImageFiles[index] &&
//             accessoriesImageFiles[index].length > 0
//           ) {
//             accessoriesImageFiles[index].forEach((file) => {
//               formData.append(`color_images[${index}][]`, file);
//             });
//           }

//           // OLD COLOR IMAGES
//           if (accessories.images && accessories.images.length > 0) {
//             accessories.images.forEach((img) => {
//               formData.append(`old_color_images[${index}][]`, img);
//             });
//           }
//         });
//       }

//       await axios.post("https://dashboard.splash-e-liquid.com/products/updateProduct.php", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("Updated ✅");
//       setShowPopup(false);
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//       alert("Update failed ❌");
//     } finally {
//       setLoading(false); // إيقاف اللودينج
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Device's Products Dashboard</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <DevicesTable
//           products={products}
//           onEdit={openEditPopup}
//           onDelete={handleDelete}
//         />

//       )}

//       {/* EDIT POPUP */}
//       {showPopup && editItem && (
//         <div className="fixed inset-0 bg-black/50 p-6 overflow-auto">
//           <form
//             onSubmit={handleEditSubmit}
//             className="bg-white p-6 rounded w-full max-w-4xl mx-auto space-y-4"
//           >
//             <h2 className="text-2xl font-bold">Edit Product</h2>

//             {/* ================= BASIC INFO ================= */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="  ">
//                 {" "}
//                 <label className="block mb-1 font-medium">Name En</label>
//                 <input
//                   value={editItem.name_en || ""}
//                   onChange={(e) =>
//                     setEditItem({ ...editItem, name_en: e.target.value })
//                   }
//                   className="border w-full p-2"
//                   placeholder="Name EN"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Name AR</label>
//                 <input
//                   value={editItem.name_ar || ""}
//                   onChange={(e) =>
//                     setEditItem({ ...editItem, name_ar: e.target.value })
//                   }
//                   className="border w-full p-2"
//                   placeholder="Name AR"
//                 />
//               </div>
//             </div>
//             <label className="block mb-1 font-medium">Description EN </label>
//             <textarea
//               value={editItem.description_en || ""}
//               onChange={(e) =>
//                 setEditItem({ ...editItem, description_en: e.target.value })
//               }
//               className="border p-2 w-full"
//               placeholder="Description EN"
//             />
//             <label className="block mb-1 font-medium">Description AR </label>
//             <textarea
//               value={editItem.description_ar || ""}
//               onChange={(e) =>
//                 setEditItem({ ...editItem, description_ar: e.target.value })
//               }
//               className="border p-2 w-full"
//               placeholder="Description AR"
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 {" "}
//                 <label className="block mb-1 font-medium">Price </label>
//                 <input
//                   type="number"
//                   value={editItem.price || ""}
//                   onChange={(e) =>
//                     setEditItem({ ...editItem, price: e.target.value })
//                   }
//                   className="border p-2 w-full"
//                   placeholder="Price"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Stock </label>
//                 <input
//                   type="number"
//                   value={editItem.stock || ""}
//                   onChange={(e) =>
//                     setEditItem({ ...editItem, stock: e.target.value })
//                   }
//                   className="border p-2 w-full"
//                   placeholder="Stock"
//                 />
//               </div>
//             </div>

//             {/* ================= MAIN IMAGE ================= */}
//             <div>
//               <label className="font-medium">Main Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   setEditItem({ ...editItem, imageFile: e.target.files[0] })
//                 }
//                 className="border p-2 w-full"
//               />

//               {(editItem.imageFile || editItem.image) && (
//                 <img
//                   src={
//                     editItem.imageFile
//                       ? URL.createObjectURL(editItem.imageFile)
//                       : editItem.image
//                   }
//                   className="w-24 h-24 mt-2 rounded object-cover"
//                 />
//               )}
//             </div>

//             {/* ================= BRAND ================= */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block mb-1 font-medium">Brand EN </label>
//                 <select
//                   value={editItem.brand?.name_en || ""}
//                   onChange={(e) => {
//                     const brand = brands.find(
//                       (b) => b.name_en === e.target.value,
//                     );
//                     setEditItem({ ...editItem, brand });
//                   }}
//                   className="border p-2 w-full"
//                 >
//                   <option value="">Brand EN</option>
//                   {brands.map((b) => (
//                     <option key={b.id} value={b.name_en}>
//                       {b.name_en}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 {" "}
//                 <label className="block mb-1 font-medium">Brand AR </label>
//                 <select
//                   value={editItem.brand?.name_ar || ""}
//                   onChange={(e) => {
//                     const brand = brands.find(
//                       (b) => b.name_ar === e.target.value,
//                     );
//                     setEditItem({ ...editItem, brand });
//                   }}
//                   className="border p-2 w-full"
//                 >
//                   <option value="">Brand AR</option>
//                   {brands.map((b) => (
//                     <option key={b.id} value={b.name_ar}>
//                       {b.name_ar}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* ================= TYPE and Vaping_Style (LIQUID ONLY) ================= */}
//             {editItem.category_key === "liquid" && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">Type EN </label>
//                     <select
//                       value={editItem.type?.name_en || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_en === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type EN</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_en}>
//                           {t.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Type AR </label>
//                     <select
//                       value={editItem.type?.name_ar || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_ar === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type AR</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_ar}>
//                           {t.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style EN{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_en || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_en === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style EN</option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_en}>
//                           {v.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style AR{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_ar || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_ar === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style AR </option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_ar}>
//                           {v.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ================= TYPE and Vaping_Style (salt ONLY) ================= */}
//             {editItem.category_key === "salt" && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">Type EN </label>
//                     <select
//                       value={editItem.type?.name_en || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_en === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type EN</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_en}>
//                           {t.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Type AR </label>
//                     <select
//                       value={editItem.type?.name_ar || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_ar === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type AR</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_ar}>
//                           {t.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style EN{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_en || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_en === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style EN</option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_en}>
//                           {v.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style AR{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_ar || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_ar === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style AR </option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_ar}>
//                           {v.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ================= TYPE and Vaping_Style (disposable ONLY) ================= */}
//             {editItem.category_key === "disposable" && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">Type EN </label>
//                     <select
//                       value={editItem.type?.name_en || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_en === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type EN</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_en}>
//                           {t.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">Type AR </label>
//                     <select
//                       value={editItem.type?.name_ar || ""}
//                       onChange={(e) => {
//                         const type = types.find(
//                           (t) => t.name_ar === e.target.value,
//                         );
//                         setEditItem({ ...editItem, type });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">Type AR</option>
//                       {types.map((t) => (
//                         <option key={t.id} value={t.name_ar}>
//                           {t.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style EN{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_en || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_en === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style EN</option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_en}>
//                           {v.name_en}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium">
//                       vaping_style AR{" "}
//                     </label>
//                     <select
//                       value={editItem.vaping_style?.name_ar || ""}
//                       onChange={(e) => {
//                         const vapingStyles = vapingStyle.find(
//                           (v) => v.name_ar === e.target.value,
//                         );
//                         setEditItem({
//                           ...editItem,
//                           vaping_style: vapingStyles,
//                         });
//                       }}
//                       className="border p-2 w-full"
//                     >
//                       <option value="">vaping_style AR </option>
//                       {vapingStyle.map((v) => (
//                         <option key={v.id} value={v.name_ar}>
//                           {v.name_ar}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ================= DEVICE ================= */}
//             {editItem.category_key === "device" &&
//               editItem.device.map((d, idx) => (
//                 <div key={idx} className="border p-4 rounded space-y-3">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       {" "}
//                       <label className="block mb-1 font-medium">
//                         Color EN{" "}
//                       </label>
//                       <select
//                         value={d.color_en || ""}
//                         onChange={(e) => {
//                           const color = deviceColors.find(
//                             (c) => c.color_en === e.target.value,
//                           );
//                           const dev = [...editItem.device];
//                           dev[idx] = { ...dev[idx], ...color };
//                           setEditItem({ ...editItem, device: dev });
//                         }}
//                         className="border p-2 w-full"
//                       >
//                         <option value="">Color EN</option>
//                         {deviceColors.map((c) => (
//                           <option key={c.id} value={c.color_en}>
//                             {c.color_en}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block mb-1 font-medium">
//                         Color AR{" "}
//                       </label>
//                       <select
//                         value={d.color_ar || ""}
//                         onChange={(e) => {
//                           const color = deviceColors.find(
//                             (c) => c.color_ar === e.target.value,
//                           );
//                           const dev = [...editItem.device];
//                           dev[idx] = { ...dev[idx], ...color };
//                           setEditItem({ ...editItem, device: dev });
//                         }}
//                         className="border p-2 w-full"
//                       >
//                         <option value="">Color AR</option>
//                         {deviceColors.map((c) => (
//                           <option key={c.id} value={c.color_ar}>
//                             {c.color_ar}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <label className="block mb-1 font-medium">
//                     Color Images{" "}
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) =>
//                       setDeviceImageFiles({
//                         ...deviceImageFiles,
//                         [idx]: Array.from(e.target.files),
//                       })
//                     }
//                     className="border p-2 w-full"
//                   />

//                   <div className="flex gap-2 flex-wrap">
//                     {d.images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img}
//                         className="w-16 h-16 rounded object-cover"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             {/* ================= ACCESSORIES ================= */}
//             {editItem.category_key === "accessories" &&
//               editItem.accessories.map((a, idx) => (
//                 <div key={idx} className="border p-4 rounded space-y-3">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block mb-1 font-medium">Color EN</label>
//                       <select
//                         value={a.color_en || ""}
//                         onChange={(e) => {
//                           const color = deviceColors.find(
//                             (c) => c.color_en === e.target.value,
//                           );
//                           const acc = [...editItem.accessories];
//                           acc[idx] = { ...acc[idx], ...color };
//                           setEditItem({ ...editItem, accessories: acc });
//                         }}
//                         className="border p-2 w-full"
//                       >
//                         <option value="">Color EN</option>
//                         {deviceColors.map((c) => (
//                           <option key={c.id} value={c.color_en}>
//                             {c.color_en}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block mb-1 font-medium">Color AR</label>
//                       <select
//                         value={a.color_ar || ""}
//                         onChange={(e) => {
//                           const color = deviceColors.find(
//                             (c) => c.color_ar === e.target.value,
//                           );
//                           const acc = [...editItem.accessories];
//                           acc[idx] = { ...acc[idx], ...color };
//                           setEditItem({ ...editItem, accessories: acc });
//                         }}
//                         className="border p-2 w-full"
//                       >
//                         <option value="">Color AR</option>
//                         {deviceColors.map((c) => (
//                           <option key={c.id} value={c.color_ar}>
//                             {c.color_ar}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <label className="block mb-1 font-medium">Color Images</label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) =>
//                       setAccessoriesImageFiles({
//                         ...accessoriesImageFiles,
//                         [idx]: Array.from(e.target.files),
//                       })
//                     }
//                     className="border p-2 w-full"
//                   />

//                   <div className="flex gap-2 flex-wrap">
//                     {a.images?.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img}
//                         className="w-16 h-16 rounded object-cover"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}

//             {/* ================= LIQUID ================= */}
//             {editItem.category_key === "liquid" && editItem.liquid && (
//               <div className="border p-4 rounded space-y-4">
//                 {["size", "nicotine", "flavor"].map((f) => (
//                   <div key={f} className="space-y-2">
//                     {/* Title */}

//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <label className="block mb-1  font-medium">
//                           {f} EN
//                         </label>
//                         <input
//                           value={editItem.liquid[`${f}_en`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               liquid: {
//                                 ...editItem.liquid,
//                                 [`${f}_en`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>

//                       <div>
//                         <label className="block mb-1  font-medium">
//                           {f} AR
//                         </label>
//                         <input
//                           value={editItem.liquid[`${f}_ar`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               liquid: {
//                                 ...editItem.liquid,
//                                 [`${f}_ar`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Liquid Images */}
//                 <div>
//                   <label className="block mb-1 font-medium">
//                     Flavor Images
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) =>
//                       setLiquidImageFiles(Array.from(e.target.files))
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>

//                 <div className="flex gap-2 flex-wrap">
//                   {editItem.liquid.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       className="w-16 h-16 rounded object-cover"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* ================= salt ================= */}
//             {editItem.category_key === "salt" && editItem.salt && (
//               <div className="border p-4 rounded space-y-4">
//                 {["size", "nicotine", "flavor"].map((f) => (
//                   <div key={f} className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       {/* English */}
//                       <div>
//                         <label className="block mb-1 font-medium">{f} EN</label>
//                         <input
//                           value={editItem.salt[`${f}_en`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               salt: {
//                                 ...editItem.salt,
//                                 [`${f}_en`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>

//                       {/* Arabic */}
//                       <div>
//                         <label className="block mb-1 font-medium">{f} AR</label>
//                         <input
//                           value={editItem.salt[`${f}_ar`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               salt: {
//                                 ...editItem.salt,
//                                 [`${f}_ar`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Salt Images Upload */}
//                 <div>
//                   <label className="block mb-1 font-medium">
//                     Flavor Images
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) =>
//                       setSaltImageFiles(Array.from(e.target.files))
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>

//                 {/* Existing Images */}
//                 <div className="flex gap-2 flex-wrap">
//                   {editItem.salt.images?.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       className="w-16 h-16 rounded object-cover"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* ================= disposable ================= */}
//             {editItem.category_key === "disposable" && editItem.disposable && (
//               <div className="border p-4 rounded space-y-4">
//                 {["size", "nicotine", "flavor"].map((f) => (
//                   <div key={f} className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       {/* English */}
//                       <div>
//                         <label className="block mb-1 font-medium">{f} EN</label>
//                         <input
//                           value={editItem.disposable[`${f}_en`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               disposable: {
//                                 ...editItem.disposable,
//                                 [`${f}_en`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>

//                       {/* Arabic */}
//                       <div>
//                         <label className="block mb-1 font-medium">{f} AR</label>
//                         <input
//                           value={editItem.disposable[`${f}_ar`] || ""}
//                           onChange={(e) =>
//                             setEditItem({
//                               ...editItem,
//                               disposable: {
//                                 ...editItem.disposable,
//                                 [`${f}_ar`]: e.target.value,
//                               },
//                             })
//                           }
//                           className="border p-2 w-full"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <label className="block mb-1 font-medium">NUM_PUFFS </label>
//                 <input
//                   value={editItem.num_puffs || ""}
//                   onChange={(e) =>
//                     setEditItem({ ...editItem, num_puffs: e.target.value })
//                   }
//                   className="border w-full p-2"
//                   placeholder="NUM_PUFFS"
//                 />
//                 {/* disposable Images Upload */}
//                 <div>
//                   <label className="block mb-1 font-medium">
//                     Flavor Images
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={(e) =>
//                       setDisposableImageFiles(Array.from(e.target.files))
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>

//                 {/* Existing Images */}
//                 <div className="flex gap-2 flex-wrap">
//                   {editItem.disposable.images?.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       className="w-16 h-16 rounded object-cover"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* ================= ACTIONS ================= */}
//             <div className="flex justify-between pt-4">
//               <button
//                 type="button"
//                 onClick={() => setShowPopup(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-6 py-2 rounded text-white 
//     ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600"}`}
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-2">
//                     <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     Saving...
//                   </div>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
//  }


 import React, { useEffect, useState } from "react";
 import axios from "axios";

 import toast from "react-hot-toast";

import EditDevices from "../EditDevices/EditDevices";
import DevicesTable from "../DevicesTable/DevicesTable";
 
 
 export default function DevicesProducts() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showEditPopup, setShowEditPopup] = useState(false);
   const [editItem, setEditItem] = useState(null);
 
   // ================= FETCH PRODUCTS =================
   const fetchProducts = async () => {
     try {
       const res = await axios.get(`https://dashboard.splash-e-liquid.com/products/getallproducts.php?nocache=${Date.now()}`);
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
       "https://dashboard.splash-e-liquid.com/products/deleteProducts.php",
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
       <h1 className="text-3xl font-bold mb-6">Devices Products Dashboard</h1>
 
       {loading ? (
         <p>Loading...</p>
       ) : (
         <DevicesTable products={products} onEdit={openEditPopup} onDelete={handleDelete} />
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
// import React from "react";
// import { Pencil, Trash2 } from "lucide-react";

// export default function PodTable({ products = [], onEdit, onDelete }) {

//   // فلترة أي منتج عنده liquid فعلاً
//   const deviceProducts = products.filter(
//     (product) => Array.isArray(product.device) && product.device.length >= 0 && product.data?.sub_category_en === "Pod"
//   );

//   if (deviceProducts.length === 0) {
//     return (
//       <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
//         لا يوجد منتجات device حالياً
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow">
//       <table className="w-full text-sm text-left">
//         <thead className="bg-gray-100 text-gray-700">
//            <tr>
//             <th className="p-3">الصورة</th>
//             <th className="p-3">اسم المنتج</th>
//             <th className="p-3">الوصف</th>
//             <th className="p-3">الصنف</th>
//             <th className="p-3">الصنف الفرعي</th>
//             <th className="p-3">البراند</th>
//             <th className="p-3">معلومات المنتج</th>
//             <th className="p-3 text-center">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {deviceProducts.map((product) => (
//             <tr
//               key={product.data.product_id}
//               className="border-b hover:bg-gray-50 align-top"
//             >
//               {/* الصورة */}
//               <td className="p-3">
//                 <img
//                   src={product.data?.image}
//                   alt={product.data?.product_name_en}
//                   className="w-16 h-16 rounded object-cover"
//                 />
//               </td>

//               {/* الاسم */}
//               <td className="p-3 font-semibold">
//                 {product.data?.product_name_en}
//                 <div className="text-xs text-gray-500">
//                   {product.data?.product_name_ar}
//                 </div>
//               </td>
//      {/* الوصف */}
//               <td className="p-3 max-w-xs">
//                 <p className="truncate">{product.data?.description_en}</p>
//               </td>

//               {/* الصنف */}
//               <td className="p-3">
//                 <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
//                   {product.data?.category_en}
//                 </span>
//               </td>

//               {/* الصنف الفرعي */}
//               <td className="p-3">
//                 <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
//                   {product.data?.sub_category_en}
//                 </span>
//               </td>
//      {/* البراند */}
//               <td className="p-3">
//                 {product.data ? (
//                   <div className="flex items-center gap-2">
//                     <div className="text-xs">
//                       <p className="font-semibold">{product.data?.brand_en}</p>
//                       <p className="text-gray-500">{product.data?.brand_ar}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <span className="text-xs text-gray-400">No Brand</span>
//                 )}
//               </td>
//               {/* تفاصيل الفليفرز */}
//               <td className="p-3 space-y-3">
//                 {product.device.map((item) => (
//                   <div
//                     key={item.variant_id}
//                     className=" rounded-lg  text-[16px]"
//                   >
//                     <p><b>color:</b> {item.color_en}</p>
//                     <p><b>Price:</b> {item.price} EGP</p>
//                     <p><b>Stock:</b> {item.stock}</p>

//                     <div className="flex gap-2 mt-2">
//                       {item.images?.map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           alt="color"
//                           className="w-14 h-14 rounded object-cover"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </td>

//               {/* أكشن */}
//               <td className="p-3 text-center">
//                 <div className="flex justify-center gap-2">
//                   <button
//                     onClick={() => onEdit(product)}
//                     className="p-2 rounded bg-green-100 text-green-700"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={() => onDelete(product.data.product_id)}
//                     className="p-2 rounded bg-red-100 text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function PodTable({ products = [], onEdit, onDelete }) {

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  // التحكم في اظهار الـ variants
  const [expandedProducts, setExpandedProducts] = useState({});

  // فلترة المنتجات (Pod فقط)
  const deviceProducts = products.filter(
    (product) =>
      Array.isArray(product.device) &&
      product.device.length >= 0 &&
      product.data?.sub_category_en === "Pod"
  );

  // حساب المنتجات في الصفحة
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = deviceProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(deviceProducts.length / productsPerPage);

  // toggle variants
  const toggleVariants = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  if (deviceProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        لا يوجد منتجات Pod حالياً
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">الصورة</th>
            <th className="p-3">اسم المنتج</th>
            <th className="p-3">الوصف</th>
            <th className="p-3">الصنف</th>
            <th className="p-3">الصنف الفرعي</th>
            <th className="p-3">البراند</th>
            <th className="p-3">معلومات المنتج</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((product) => {

            const isExpanded = expandedProducts[product.data.product_id];

            const visibleVariants = isExpanded
              ? product.device
              : product.device.slice(0, 2);

            return (
              <tr
                key={product.data.product_id}
                className="border-b hover:bg-gray-50 align-top"
              >
                {/* الصورة */}
                <td className="p-3">
                  <img
                    src={product.data?.image}
                    alt={product.data?.product_name_en}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>

                {/* الاسم */}
                <td className="p-3 font-semibold">
                  {product.data?.product_name_en}
                  <div className="text-xs text-gray-500">
                    {product.data?.product_name_ar}
                  </div>
                </td>

                {/* الوصف */}
                <td className="p-3 max-w-xs">
                  <p className="truncate">{product.data?.description_en}</p>
                </td>

                {/* الصنف */}
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {product.data?.category_en}
                  </span>
                </td>

                {/* الصنف الفرعي */}
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {product.data?.sub_category_en}
                  </span>
                </td>

                {/* البراند */}
                <td className="p-3">
                  {product.data ? (
                    <div className="flex items-center gap-2">
                      <div className="text-xs">
                        <p className="font-semibold">{product.data?.brand_en}</p>
                        <p className="text-gray-500">{product.data?.brand_ar}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No Brand</span>
                  )}
                </td>

                {/* تفاصيل variants */}
                <td className="p-3 space-y-3">

                  {visibleVariants.map((item) => (
                    <div
                      key={item.variant_id}
                      className="rounded-lg border p-2 text-[16px]"
                    >
                      <p><b>Color:</b> {item.color_en}</p>
                      <p><b>Price:</b> {item.price} EGP</p>
                      <p><b>Stock:</b> {item.stock}</p>

                      <div className="flex gap-2 mt-2">
                        {item.images?.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="color"
                            className="w-14 h-14 rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {product.device.length > 2 && (
                    <button
                      onClick={() => toggleVariants(product.data.product_id)}
                      className="text-blue-600 text-xs"
                    >
                      {isExpanded
                        ? "Show Less"
                        : `Show ${product.device.length - 2} More`}
                    </button>
                  )}

                </td>

                {/* الأكشن */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded bg-green-100 text-green-700"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(product.data.product_id)}
                      className="p-2 rounded bg-red-100 text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 p-4">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}
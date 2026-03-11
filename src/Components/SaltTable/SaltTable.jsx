import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function SaltTable({ products = [], onEdit, onDelete }) {

  // Pagination للمنتجات
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  // التحكم في إظهار الفليفرز
  const [expandedProducts, setExpandedProducts] = useState({});

  // search state
  const [search, setSearch] = useState("");

  // فلترة المنتجات
  const saltProducts = products.filter(
    (product) => Array.isArray(product.salt) && product.salt.length >= 0
  );

  // فلترة السيرش
  const filteredProducts = saltProducts.filter((product) => {

    const searchText = search.toLowerCase();

    const nameEn = product.data?.product_name_en?.toLowerCase() || "";
    const nameAr = product.data?.product_name_ar?.toLowerCase() || "";

    const descEn = product.data?.description_en?.toLowerCase() || "";
    const descAr = product.data?.description_ar?.toLowerCase() || "";

    const typeEn = product.data?.type_en?.toLowerCase() || "";
    const typeAr = product.data?.type_ar?.toLowerCase() || "";

    const brandEn = product.data?.brand_en?.toLowerCase() || "";
    const brandAr = product.data?.brand_ar?.toLowerCase() || "";

    const flavorMatch = product.salt.some((item) =>
      item.flavor_en?.toLowerCase().includes(searchText) ||
      item.flavor_ar?.toLowerCase().includes(searchText)
    );

    return (
      nameEn.includes(searchText) ||
      nameAr.includes(searchText) ||
      descEn.includes(searchText) ||
      descAr.includes(searchText) ||
      typeEn.includes(searchText) ||
      typeAr.includes(searchText) ||
      brandEn.includes(searchText) ||
      brandAr.includes(searchText) ||
      flavorMatch
    );
  });

  // حساب المنتجات لكل صفحة
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // toggle للـ variants
  const toggleVariants = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  if (saltProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        لا يوجد منتجات salt حالياً
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">

      {/* Search */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search by name, flavor, brand, type..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-80 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">الصورة</th>
              <th className="p-3">اسم المنتج</th>
              <th className="p-3">الوصف</th>
              <th className="p-3">الصنف</th>
              <th className="p-3">النوع</th>
              <th className="p-3">البراند</th>
              <th className="p-3">معلومات المنتج</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((product) => {

              const isExpanded = expandedProducts[product.data.product_id];

              const visibleVariants = isExpanded
                ? product.salt
                : product.salt.slice(0, 2);

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
                    <div className="text-xs text-gray-500">
                      {product.data?.description_ar}
                    </div>
                  </td>

                  {/* الصنف */}
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {product.data?.category_en}
                    </span>
                     <div className="text-xs px-2 py-1 text-gray-500">
                      {product.data?.category_ar}
                    </div>
                  </td>

                  {/* النوع */}
                  <td className="p-3">
                    {product.data ? (
                      <div className="flex items-center gap-2">
                        <div className="text-xs">
                          <p className="font-semibold">{product.data?.type_en}</p>
                          <p className="text-gray-500">{product.data?.type_ar}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No Type</span>
                    )}
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

                  {/* الفليفرز */}
                  <td className="p-3 space-y-3">
                    {visibleVariants.map((item) => (
                      <div
                        key={item.variant_id}
                        className="rounded-lg border p-2 text-[16px]"
                      >
                        <p><b>Flavor_EN:</b> {item.flavor_en}</p>
                        <p><b>Flavor_AR:</b> {item.flavor_ar}</p>
                        <p><b>Size_EN:</b> {item.size_en}</p>
                        <p><b>Size_AR:</b> {item.size_ar}</p>
                        <p><b>Nicotine_EN:</b> {item.nicotine_en}</p>
                        <p><b>Nicotine_AR:</b> {item.nicotine_ar}</p>
                        <p><b>Style_EN:</b> {item.style_en}</p>
                        <p><b>Style_AR:</b> {item.style_ar}</p>
                        <p><b>Price:</b> {item.price} EGP</p>
                        <p><b>Stock:</b> {item.stock}</p>

                        <div className="flex gap-2 mt-2">
                          {item.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="flavor"
                              className="w-14 h-14 rounded object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                    {product.salt.length > 2 && (
                      <button
                        onClick={() =>
                          toggleVariants(product.data.product_id)
                        }
                        className="text-blue-600 text-xs"
                      >
                        {isExpanded
                          ? "Show Less"
                          : `Show ${product.salt.length - 2} More`}
                      </button>
                    )}
                  </td>

                  {/* أكشن */}
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
      </div>

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
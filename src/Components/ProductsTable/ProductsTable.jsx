import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductsTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">الصورة</th>
            <th className="p-3">اسم المنتج</th>
            <th className="p-3">الوصف</th>
            <th className="p-3">الصنف</th>
            <th className="p-3">البراند</th>
            <th className="p-3">معلومات المنتج</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.product_id}
              className="border-b hover:bg-gray-50 align-top"
            >
              {/* الصورة الرئيسية */}
              <td className="p-3">
                <img
                  src={product.image}
                  alt={product.name_en}
                  className="w-16 h-16 rounded object-cover"
                />
              </td>

              {/* اسم المنتج */}
              <td className="p-3 font-semibold">
                {product.name_en}
                <div className="text-xs text-gray-500">
                  {product.name_ar}
                </div>
              </td>

              {/* الوصف */}
              <td className="p-3 max-w-xs">
                <p className="truncate">{product.description_en}</p>
              </td>

              {/* الصنف */}
              <td className="p-3">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                  {product.category?.name_en}
                </span>
              </td>

              {/* البراند */}
              <td className="p-3">
                {product.brand ? (
                  <div className="flex items-center gap-2">
                    
                    <div className="text-xs">
                      <p className="font-semibold">
                        {product.brand.name_en}
                      </p>
                      <p className="text-gray-500">
                        {product.brand.name_ar}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No Brand</span>
                )}
              </td>

              {/* معلومات المنتج */}
              <td className="p-3 text-xs space-y-2">
                {/* Liquid */}
                {product.category_key === "liquid" && product.liquid && (
                  <>
                    <p><b>Flavor:</b> {product.liquid.flavor_en}</p>
                    <p><b>Size:</b> {product.liquid.size_en}</p>
                    <p><b>Nicotine:</b> {product.liquid.nicotine_en}</p>
                    <p><b>Type:</b> {product.liquid.type_en}</p>

                    {/* Flavor Images */}
                    {product.liquid.images?.length > 0 && (
                      <div className="flex gap-2 mt-1 overflow-x-auto">
                        {product.liquid.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="flavor"
                            className="w-10 h-10 rounded object-cover border"
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Device */}
                {product.category_key === "device" &&
                  product.device?.map((d, index) => (
                    <div key={index} className="space-y-1">
                      <p><b>Color:</b> {d.color_en}</p>

                      {/* Color Images */}
                      {d.images?.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {d.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="device-color"
                              className="w-10 h-10 rounded object-cover border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </td>

              {/* Actions */}
              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(product.product_id)}
                    className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

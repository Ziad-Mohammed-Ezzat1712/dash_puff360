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
              key={product.data.product_id}
              className="border-b hover:bg-gray-50 align-top"
            >
              {/* الصورة الرئيسية */}
              <td className="p-3">
                <img
                  src={product.data?.image}
                  alt={product.data?.name_en}
                  className="w-16 h-16 rounded object-cover"
                />
              </td>

              {/* اسم المنتج */}
              <td className="p-3 font-semibold">
                {product.data?.product_name_en}
                <div className="text-xs text-gray-500">{product.data?.product_name_ar}</div>
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

              {/* معلومات المنتج */}
              <td className="p-3 text-xs space-y-2">
                {/* Liquid */}
            
             
      {product.liquid && product.liquid.length > 0 && (
  product.liquid.map((item, index) => (
    <div key={item.variant_id} className="  rounded-xl mb-4">
      
      <h3 className="text-[16px] font-medium text-black">
       flavor : {item.flavor_en}
      </h3>

      <p className="text-[16px] font-medium text-black">
        Size: {item.size_en}
      </p>

      <p className="text-[16px] font-medium text-black">
        Nicotine: {item.nicotine_en}
      </p>
       <p className="text-[16px] font-medium text-black">
        Vaping Style: {item.style_en}
      </p>

      <p className="text-[16px] font-medium text-black ">
        Price: {item.price} EGP
      </p>

      <p className="text-[16px] font-medium text-black">
        Stock: {item.stock}
      </p>

      {/* عرض صور الفليفر */}
      <div className="flex gap-3 mt-3">
        {item.images && item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="flavor"
            className="w-20 h-20 object-cover rounded-lg"
          />
        ))}
      </div>

    </div>
  ))
)}
                {/* salt */}
                    {product.salt && product.salt.length > 0 && (
  product.salt.map((item, index) => (
    <div key={item.variant_id} className="  rounded-xl mb-4">
      
      <h3 className="text-[16px] font-medium text-black">
       flavor : {item.flavor_en}
      </h3>

      <p className="text-[16px] font-medium text-black">
        Size: {item.size_en}
      </p>

      <p className="text-[16px] font-medium text-black">
        Nicotine: {item.nicotine_en}
      </p>
       <p className="text-[16px] font-medium text-black">
        Vaping Style: {item.style_en}
      </p>

      <p className="text-[16px] font-medium text-black ">
        Price: {item.price} EGP
      </p>

      <p className="text-[16px] font-medium text-black">
        Stock: {item.stock}
      </p>

      {/* عرض صور الفليفر */}
      <div className="flex gap-3 mt-3">
        {item.images && item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="flavor"
            className="w-20 h-20 object-cover rounded-lg"
          />
        ))}
      </div>

    </div>
  ))
)}
                {/* disposable */}
                {product.category_key === "disposable" &&
                  product.disposable && (
                    <>
                      <p>
                        <b>Flavor:</b> {product.disposable.flavor_en}
                      </p>
                      <p>
                        <b>Size:</b> {product.disposable.size_en}
                      </p>
                      <p>
                        <b>Nicotine:</b> {product.disposable.nicotine_en}
                      </p>
                      <p>
                        <b>Type:</b> {product.disposable.type_en}
                      </p>
                      <p>
                        <b> Vape Style :</b> {product.vaping_style?.name_en}
                      </p>
                      <p>
                        <b>Puffs:</b> {product.num_puffs}
                      </p>

                      {/* Flavor Images */}
                      {product.disposable.images?.length > 0 && (
                        <div className="flex gap-2 mt-1 overflow-x-auto">
                          {product.disposable.images.map((img, i) => (
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
              {product.device && product.device.length > 0 && (
  product.device.map((item) => (
    <div key={item.variant_id} className="  rounded-xl mb-4">

      {/* اسم اللون */}
      <h3 className="text-[16px] font-medium text-black">
       Color: {item.color_en}
      </h3>

      {/* السعر */}
      <p className="text-[16px] font-medium text-black">
        Price: {item.price} EGP
      </p>

      {/* المخزون */}
      <p className="text-[16px] font-medium text-black">
        Stock: {item.stock}
      </p>

      {/* صور اللون */}
      <div className="flex gap-3 mt-4">
        {item.images && item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="device color"
            className="w-24 h-24 object-cover rounded-xl"
          />
        ))}
      </div>

    </div>
  ))
)}

                {/* accessories */}
                {product.category_key === "accessories" &&
                  product.accessories?.map((d, index) => (
                    <div key={index} className="space-y-1">
                      <p>
                        <b>Color:</b> {d.color_en}
                      </p>

                      {/* Color Images */}
                      {d.images?.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {d.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="accessories-color"
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
                    onClick={() => onDelete(product.data.product_id)}
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

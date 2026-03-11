import { useState } from "react";

export default function useTableSearch(products, variantsKey, itemsPerPage = 3) {

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((product) => {

    const searchText = search.toLowerCase();

    const nameEn = product.data?.product_name_en?.toLowerCase() || "";
    const nameAr = product.data?.product_name_ar?.toLowerCase() || "";

    const descEn = product.data?.description_en?.toLowerCase() || "";
    const descAr = product.data?.description_ar?.toLowerCase() || "";

    const typeEn = product.data?.type_en?.toLowerCase() || "";
    const typeAr = product.data?.type_ar?.toLowerCase() || "";

    const brandEn = product.data?.brand_en?.toLowerCase() || "";
    const brandAr = product.data?.brand_ar?.toLowerCase() || "";

    const flavorMatch = product[variantsKey]?.some((item) =>
      item.flavor_en?.toLowerCase().includes(searchText) ||
      item.flavor_ar?.toLowerCase().includes(searchText)
    );
    const colorMatch = product[variantsKey]?.some((item) =>
      item.color_en?.toLowerCase().includes(searchText) ||
      item.color_ar?.toLowerCase().includes(searchText)
    );
    const Puffs = product[variantsKey]?.some((item) =>
      item.number_of_puffs?.toLowerCase().includes(searchText) 
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
      colorMatch ||
      Puffs ||
      flavorMatch 
    );
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return {
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    currentProducts,
    totalPages,
  };
}
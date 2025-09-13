import React, { useEffect, useState } from "react";
import "./ViewProducts.css";
import SidebarFilter from "./SidebarFilter";
import ProductGrid from "./ProductGrid";
//import AxiosInstance from "../../../api/AxiosInstance";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import { useApiClients } from "../../../api/useApiClients";

const ViewProducts = () => {
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [filters, setFilters] = useState({
    category: [],
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      showLoader(0, 1500);

      try {
        const [categoryRes, productRes] = await Promise.all([
          wrapwowApi.get("/member/getCategoryNames"),
          wrapwowApi.get("/user/getProductList"),
        ]);

        const categoryResult = categoryRes.data;
        if (categoryResult.status === "1") {
          showPopup(categoryResult.message, "error");
        } else {
          const data = categoryResult.Categories;
          if (Array.isArray(data)) {
            const activeCategories = data.filter(
              (category) => category.categoryStatus === "ACTIVE"
            );
            setCategories(activeCategories);
          }
        }

        const productResult = productRes.data;
        if (productResult.status === "1") {
          showPopup(productResult.message, "error");
        } else {
          const data = productResult.Products;
          if (Array.isArray(data)) {
            const activeProducts = data.filter(
              (product) => product.productStatus === "ACTIVE"
            );
            setProducts(activeProducts);
          }
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Fetching data failed. Please try again."
            : "An error occurred. Please check your connection.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [showPopup]);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.category.length === 0 ||
      filters.category.includes(product.category);

    return categoryMatch;
  });

  return (
    <div className="vp-page">
      <UserHeader />
      <div className="vp-container">
        <SidebarFilter
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          className="vp-sidebar"
        />
        <ProductGrid products={filteredProducts} className="vp-products" />
      </div>
      <UserFooter />
    </div>
  );
};

export default ViewProducts;

import React, { useCallback, useEffect, useState } from "react";
import "./ManageProducts.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import { FaSort } from "react-icons/fa";
//import AxiosInstance from "../../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const ManageProducts = () => {
  const navigate = useNavigate();
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup;
  const { showLoader, hideLoader } = useLoading();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productStatus
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = useCallback(async () => {
    showLoader();
    try {
      const response = await wrapwowApi.get("/admin/getProductList");
      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        const data = result.Products;
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching admins failed. Please try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    } finally {
      hideLoader();
    }
  }, [showPopup]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleSort = (field) => {
    setSortAsc(field === sortField ? !sortAsc : true);
    setSortField(field);
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    } else {
      return sortAsc
        ? valA
            ?.toString()
            .toLowerCase()
            .localeCompare(valB?.toString().toLowerCase())
        : valB
            ?.toString()
            .toLowerCase()
            .localeCompare(valA?.toString().toLowerCase());
    }
  });

  const handleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const updateProductStatus = async (ids) => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    try {
      const response = await wrapwowApi.post("/admin/updateProductsStatus", {
        email,
        ids,
      });
      const result = response.data;

      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Status updated successfully", "success");
        fetchProducts();
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Updating product status failed, try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  const handleActiveDeact = (id) => {
    updateProductStatus([id]);
  };

  const handleMulActiveDeact = () => {
    if (selectedProducts.length === 0) {
      showPopup("Please select at least one product", "error");
      return;
    }
    updateProductStatus(selectedProducts);
  };

  const handleClick = (productId) => {
    navigate("/update-product", { state: { productId: productId } });
  };

  return (
    <div className="mp-page">
      <AdminHeader />
      <div className="mp-container">
        <Breadcrumbs
          labelMap={{
            "manage-products": "Products",
          }}
        />
        <div className="mp-title">Manage Products</div>
        <div className="mp-searchbar-container">
          <input
            type="text"
            className="mp-searchbar"
            placeholder="Search by name, category or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mp-buttons">
          <button className="mp-top-btn" onClick={handleMulActiveDeact}>
            Activate/Deactivate
          </button>
        </div>
        <div className="mp-product-header">
          <div className="mp-checkbox">
            <input
              type="checkbox"
              checked={
                filteredProducts.length > 0 &&
                filteredProducts.every((product) =>
                  selectedProducts.includes(product.id)
                )
              }
              onChange={(e) =>
                e.target.checked
                  ? setSelectedProducts([
                      ...new Set([
                        ...selectedProducts,
                        ...filteredProducts.map((p) => p.id),
                      ]),
                    ])
                  : setSelectedProducts(
                      selectedProducts.filter(
                        (id) => !filteredProducts.some((p) => p.id === id)
                      )
                    )
              }
            />
          </div>
          <div className="mp-header-name" onClick={() => toggleSort("name")}>
            Name{" "}
            <FaSort
              className={`mp-sort-icon ${sortField === "name" ? "active" : ""}`}
            />
          </div>
          <div
            className="mp-header-category"
            onClick={() => toggleSort("category")}
          >
            Category{" "}
            <FaSort
              className={`mp-sort-icon ${
                sortField === "category" ? "active" : ""
              }`}
            />
          </div>
          <div
            className="mp-header-stock"
            onClick={() => toggleSort("availableQty")}
          >
            Inventory{" "}
            <FaSort
              className={`mp-sort-icon ${
                sortField === "availableQty" ? "active" : ""
              }`}
            />
          </div>
          <div
            className="mp-header-ordered"
            onClick={() => toggleSort("totalOrderedQty")}
          >
            Total Ordered{" "}
            <FaSort
              className={`mp-sort-icon ${
                sortField === "totalOrderedQty" ? "active" : ""
              }`}
            />
          </div>
          <div
            className="mp-header-status"
            onClick={() => toggleSort("productStatus")}
          >
            Status{" "}
            <FaSort
              className={`ma-sort-icon ${
                sortField === "productStatus" ? "active" : ""
              }`}
            />
          </div>
          <div className="ma-header-action">Action</div>
        </div>

        {sortedProducts.map((product) => (
          <div
            key={product.productId}
            className="mp-product-card"
            onClick={() => handleClick(product.productId)}
          >
            <div className="mp-checkbox">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.productId)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => handleSelect(product.productId)}
              />
            </div>

            <div className="mp-product-name">{product.name}</div>
            <div className="mp-product-category">{product.category}</div>
            <div className="mp-product-stock">{product.availableQty}</div>
            <div className="mp-product-ordered">{product.totalOrderedQty}</div>
            <div className="mp-product-status">{product.productStatus}</div>

            <div className="mp-product-action">
              <button
                type="button"
                className="mp-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActiveDeact(product.productId);
                }}
              >
                {product.productStatus === "ACTIVE" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <AdminFooter />
    </div>
  );
};

export default ManageProducts;

import React, { useEffect, useState } from "react";
import "./DisplayProduct.css";
//import AxiosInstance from "../../../api/AxiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const DisplayProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;

  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();

  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    selectedPrice: null,
    quantity: 1,
  });

  const outOfStock = product.availableQty === 0;

  const ProductSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slideToScroll: 1,
  };

  useEffect(() => {
    if (!productId) {
      navigate("/products");
      return;
    }

    const fetchProduct = async () => {
      showLoader();
      try {
        const response = await wrapwowApi.get(
          `/user/getProductById?productId=${productId}`
        );
        const result = response.data;

        if (result.status === "1") {
          showPopup(result.message, "error");
        } else {
          const data = result.Product;
          setProduct(data);

          if (data.prices && data.prices.length > 0) {
            setFormData({
              selectedPrice: data.prices[0],
              quantity: data.availableQty === 0 ? 0 : 1,
            });
          }
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Fetching product failed. Please try again."
            : "An error occurred. Please check your connection.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchProduct();
  }, [productId, navigate, showPopup]);

  const handleAmountChange = (e) => {
    const finalPrice = parseFloat(e.target.value);
    const selected = product.prices.find((p) => p.finalPrice === finalPrice);
    if (selected) {
      setFormData((prev) => ({ ...prev, selectedPrice: selected }));
    }
  };

  const handleQuantityChange = (val) => {
    const value = Math.min(Math.max(val, 1), product.availableQty);
    setFormData((prev) => ({ ...prev, quantity: value }));
  };

  const handleAddToCart = async () => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    try {
      const response = await wrapwowApi.post("/user/addUpdateToCart", {
        email,
        productId: product.productId,
        priceId: formData.selectedPrice.priceId,
        quantity: formData.quantity,
      });
      const result = response.data;

      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Product Added to cart.", "success");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Updating user status failed, try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  const { selectedPrice, quantity } = formData;

  return (
    <div className="dp-page">
      <UserHeader />
      <div className="dp-container">
        <div className="dp-sub-conatiner">
          <Breadcrumbs
            labelMap={{
              "display-product": "Product #" + productId,
            }}
            extraPaths={[{ label: "Products", path: "/products" }]}
          />
          <div className="dp-product">
            <h1 className="dp-title">{product.name}</h1>
            <h3 className="dp-category">{product.category}</h3>

            <div className="dp-image-container">
              {product.images?.length > 1 ? (
                <Slider {...ProductSettings}>
                  {product.images.map((image) => (
                    <div key={image.imageId}>
                      <img
                        src={image.path}
                        alt={`Product ${product.name} ${image.imageId}`}
                        className="dp-image"
                      />
                    </div>
                  ))}
                </Slider>
              ) : product.images?.length === 1 ? (
                <img
                  src={product.images[0].path}
                  alt={`Product ${product.name}`}
                  className="dp-image"
                />
              ) : (
                <div className="dp-placeholder">
                  <img
                    src="/placeholder.jpg"
                    alt="No Image Available"
                    className="dp-image"
                  />
                </div>
              )}
            </div>

            <div className="dp-pricing-table">
              <h3 className="dp-sub-title">Available Denominations</h3>
              <table className="dp-price-table">
                <thead>
                  <tr>
                    <th>MRP</th>
                    <th>Discount</th>
                    <th>Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.prices?.map((price, index) => (
                    <tr key={index}>
                      <td>₹{price.price}</td>
                      <td>{price.discount}%</td>
                      <td>₹{price.finalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="dp-sub-title">Description</h2>
            <p className="dp-description">{product.description}</p>

            <h2 className="dp-sub-title">How to Claim</h2>
            <p className="dp-description">
              1. Go to the {product.name} website from your browser
            </p>
            <p className="dp-description">2. Login or create an account.</p>
            <p className="dp-description">3. Purchase a product.</p>
            <p className="dp-description">
              4. During checkout select the Gift Card option as payment method.
            </p>
            <p className="dp-description">
              5. Enter your Gift Card code received in your email.
            </p>
            <p className="dp-description">6. Click Redeem and done.</p>
          </div>
        </div>

        <div className="dp-billing">
          <h2 className="dp-billing-title">Purchase Now</h2>

          <p className="dp-trust-msg">
            ✔ 100% Secure • Instant Delivery • No Expiry
          </p>
          <p className="dp-delivery-info">
            🚚 Delivery: Instantly to your email
          </p>

          <p
            className={`dp-stock ${
              product.availableQty > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.availableQty > 0
              ? `${product.availableQty} in stock`
              : "Out of Stock"}
          </p>

          <div className="dp-form-group">
            <label className="dp-label" htmlFor="dp-amount">
              Select Amount
              <span className="dp-hint"> (Final price after discount)</span>
            </label>
            <select
              id="dp-amount"
              className="dp-input"
              value={selectedPrice?.finalPrice || ""}
              disabled={outOfStock}
              onChange={handleAmountChange}
            >
              {outOfStock ? (
                <option value="">Not Available</option>
              ) : (
                product.prices?.map((price, index) => (
                  <option key={index} value={price.finalPrice}>
                    ₹{price.finalPrice} — Save ₹
                    {(price.price - price.finalPrice).toFixed(0)}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="dp-form-group">
            <label className="dp-label" htmlFor="dp-quantity">
              Quantity
              <span className="dp-hint"> (Max: {product.availableQty})</span>
            </label>
            <div className="dp-quantity-wrapper">
              <button
                type="button"
                className="dp-quantity-btn"
                disabled={outOfStock}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                −
              </button>
              <input
                id="dp-quantity"
                className="dp-input dp-quantity-input"
                disabled={outOfStock}
                value={quantity}
                min={1}
                max={product.availableQty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setFormData((prev) => ({ ...prev, quantity: "" }));
                  } else if (!isNaN(val)) {
                    handleQuantityChange(parseInt(val));
                  }
                }}
              />
              <button
                type="button"
                className="dp-quantity-btn"
                disabled={outOfStock}
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="dp-actions">
            <button
              className="dp-btn dp-add-cart"
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          {selectedPrice && (
            <div className="dp-price-info">
              <p className="dp-price-text">
                <strong>Original Price:</strong> ₹{selectedPrice.price}
              </p>
              <p className="dp-price-text">
                <strong>Discount:</strong> {selectedPrice.discount}%
              </p>
              <p className="dp-price-text">
                <strong>Final Price:</strong> ₹
                {selectedPrice.finalPrice.toFixed(2)}
              </p>
              <p className="dp-price-text dp-total">
                <strong>Total Payable:</strong> ₹
                {(selectedPrice.finalPrice * quantity).toFixed(2)}
              </p>
              <p className="dp-price-text dp-you-save">
                <strong>You Save:</strong> ₹
                {(
                  (selectedPrice.price - selectedPrice.finalPrice) *
                  quantity
                ).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default DisplayProduct;

import React, { useCallback, useEffect, useState } from "react";
import "./Cart.css";
//import AxiosInstance from "../../../api/AxiosInstance";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const Cart = () => {
  const navigate = useNavigate();
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [cart, setCart] = useState([]);
  const isCartEmpty =
    !cart || cart.length === 0 || cart.every((item) => !item.product);

  const fetchCart = useCallback(async () => {
    showLoader();
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    try {
      const response = await wrapwowApi.get("/user/getCart", {
        params: { email },
      });
      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
        setCart([]);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        setCart(result.Cart);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching cart failed. Please try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    } finally {
      hideLoader();
    }
  }, [showPopup]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCartQuantity = async (cartId, quantity) => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    try {
      const response = await wrapwowApi.post("/user/updateCartQty", {
        email,
        cartId,
        quantity,
      });
      const result = response.data;

      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Cart updated", "success");
        fetchCart();
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Updating cart failed, try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price.price * item.quantity,
      0
    );
  };

  const calculateTotalDiscount = () => {
    return cart.reduce(
      (sum, item) =>
        sum + (item.price.price - item.price.finalPrice) * item.quantity,
      0
    );
  };

  const calculateGrandTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price.finalPrice * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const accountStatus = loginData?.accountStatus;
    if (accountStatus === "ACTIVE") {
      navigate("/checkout");
    } else {
      showPopup("User Account is Inactive.", "error");
    }
  };

  return (
    <div className="ct-page">
      <UserHeader />
      <div className="ct-container">
        <Breadcrumbs
          labelMap={{
            "/cart": "Cart",
          }}
        />

        <h2 className="ct-title">My Cart</h2>

        {isCartEmpty ? (
          <p className="ct-empty">Your cart is currently empty.</p>
        ) : (
          <>
            <div className="ct-cart-items">
              {cart.map((item) => (
                <div key={item.cartId} className="ct-cart-item">
                  <div className="ct-item-left">
                    <img
                      src={item.product.images[0]?.path}
                      alt={item.product.name}
                      className="ct-product-image"
                    />
                    <div>
                      <h3 className="ct-product-name">{item.product.name}</h3>
                      <p className="ct-product-category">
                        {item.product.category}
                      </p>
                    </div>
                  </div>

                  <div className="ct-item-center">
                    <div className="ct-info-block">
                      <label>Status</label>
                      <span>{item.product.productStatus}</span>
                    </div>
                    <div className="ct-info-block">
                      <label>Available</label>
                      <span>{item.product.availableQty}</span>
                    </div>
                    <div className="ct-info-block">
                      <label>Unit Price</label>
                      <span>₹{item.price.finalPrice}</span>
                    </div>
                    <div className="ct-info-block">
                      <label>Original</label>
                      <span className="ct-original-price">
                        ₹{item.price.price}
                      </span>
                      <p className="ct-discount">
                        ({item.price.discount}% off)
                      </p>
                    </div>
                    <div className="ct-info-block">
                      <label htmlFor={`qty-${item.cartId}`}>Quantity</label>
                      <select
                        id={`qty-${item.cartId}`}
                        className="ct-quantity-select"
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartQuantity(
                            item.cartId,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {Array.from(
                          { length: item.product.availableQty },
                          (_, i) => i + 1
                        ).map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ct-info-block ct-total">
                      <label>Total</label>
                      <span>₹{item.price.finalPrice * item.quantity}</span>
                    </div>
                  </div>

                  <div className="ct-actions">
                    <button
                      className="ct-delete-btn"
                      onClick={() => updateCartQuantity(item.cartId, 0)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {calculateGrandTotal() > 0 && (
              <div className="ct-billing-summary">
                <h3>Billing Summary</h3>
                <p>Subtotal: ₹{calculateSubtotal()}</p>
                <p>Total Discount: -₹{calculateTotalDiscount()}</p>
                <hr />
                <p className="ct-grand-total">
                  <strong>Grand Total:</strong> ₹{calculateGrandTotal()}
                </p>
                <button className="ct-checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <UserFooter />
    </div>
  );
};

export default Cart;

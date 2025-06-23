import React, { useCallback, useEffect, useState } from "react";
import "./Checkout.css";
import AxiosInstance from "../../../api/AxiosInstance";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const Checkout = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");

  const fetchCart = useCallback(
    async (email) => {
      showLoader();
      try {
        const response = await AxiosInstance.get("/user/getCart", {
          params: { email },
        });
        const result = response.data.resultString;
        if (result.resultStatus === "0") {
          showPopup(result.result, "error");
        } else {
          setCart(result.Cart);
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
    },
    [showPopup]
  );

  useEffect(() => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    setEmail(loginData?.email || "");
    fetchCart(loginData?.email);
  }, [fetchCart]);

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price.price * item.quantity, 0);

  const calculateTotalDiscount = () =>
    cart.reduce(
      (sum, item) =>
        sum + (item.price.price - item.price.finalPrice) * item.quantity,
      0
    );

  const calculateGrandTotal = () =>
    cart.reduce((sum, item) => sum + item.price.finalPrice * item.quantity, 0);

  const calculateTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      const response = await AxiosInstance.post("/user/checkout", {
        userEmail: email,
        totalAmount: calculateGrandTotal(),
        totalItems: calculateTotalItems(),
        items: cart.map((item) => ({
          productId: item.product.productId,
          productName: item.product.name,
          quantity: item.quantity,
          priceId: item.price.priceId,
          pricePerUnit: item.price.finalPrice,
          totalPrice: item.price.finalPrice * item.quantity,
        })),
      });
      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        showPopup(result.result, "success");
        navigate("/dashboard");
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching cart failed. Please try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  return (
    <div className="co-page">
      <UserHeader />
      <div className="co-container">
        <Breadcrumbs
          labelMap={{
            checkout: "Checkout",
          }}
          extraPaths={[{ label: "Cart", path: "/cart" }]}
        />

        <h2 className="co-title">Checkout</h2>

        {cart.length === 0 ? (
          <p className="co-empty">
            Your cart is empty. Add items before checkout.
          </p>
        ) : (
          <>
            <div className="co-cart-items">
              {cart.map((item) => (
                <div key={item.cartId} className="co-cart-item">
                  <div className="co-item-left">
                    <img
                      src={item.product.images[0]?.path}
                      alt={item.product.name}
                      className="co-product-image"
                    />
                    <div>
                      <h3 className="co-product-name">{item.product.name}</h3>
                      <p className="co-product-category">
                        {item.product.category}
                      </p>
                      <p className="co-qty">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="co-item-right">
                    <p>Unit Price: ₹{item.price.finalPrice}</p>
                    <p>Total: ₹{item.price.finalPrice * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="co-summary">
              <h3>Billing Summary</h3>
              <p>Total Items: {calculateTotalItems()}</p>
              <p>Subtotal: ₹{calculateSubtotal()}</p>
              <p>Discount: -₹{calculateTotalDiscount()}</p>
              <hr />
              <p className="co-grand-total">
                <strong>Grand Total:</strong> ₹{calculateGrandTotal()}
              </p>
              <button className="co-place-order-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
              <p className="co-delivery-info">
                🚚 <strong>Delivery:</strong> Instant digital delivery to your
                email
              </p>
              <p className="co-email-info">
                📧 <strong>Delivered to:</strong> {email}
              </p>
            </div>
          </>
        )}
      </div>
      <UserFooter />
    </div>
  );
};

export default Checkout;

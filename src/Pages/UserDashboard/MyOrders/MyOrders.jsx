import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import AxiosInstance from "../../../api/AxiosInstance";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const MyOrders = () => {
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      showLoader();
      const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
      const email = loginData?.email;

      try {
        const response = await AxiosInstance.get("/user/getOrders", {
          params: { email },
        });
        const result = response.data.resultString;
        if (result.resultStatus === "0") {
          showPopup(result.result, "error");
        } else {
          setOrders(result.orders);
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
    };

    fetchOrders();
  }, [showPopup]);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="co-page">
      <UserHeader />
      <div className="mo-container">
        <Breadcrumbs
          labelMap={{
            "my-orders": "My Orders",
          }}
        />
        <h2 className="mo-title">My Orders</h2>

        {orders.map((order) => (
          <div key={order.orderId} className="mo-order-card">
            <div
              className="mo-order-summary"
              onClick={() => toggleExpand(order.orderId)}
            >
              <div className="mo-order-left">
                <div>
                  <strong>Order ID:</strong> #{order.orderId}
                </div>
                <div>
                  <strong>Placed:</strong>{" "}
                  {new Date(order.orderTime).toLocaleString()}
                </div>
              </div>
              <div className="mo-order-center">
                <div>
                  <strong>Total:</strong> ₹{order.totalAmount}
                </div>
                <div>
                  <strong>Items:</strong> {order.totalItems}
                </div>
              </div>
              <div className="mo-order-right">
                <span
                  className={`mo-status-badge mo-status-${order.orderStatus.toLowerCase()}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div
                className={`mo-toggle-icon ${
                  expandedOrderId === order.orderId ? "expanded" : ""
                }`}
              >
                &#9662;
              </div>
            </div>

            {expandedOrderId === order.orderId && (
              <div className="mo-items-container">
                {order.items.map((item, index) => (
                  <div key={index} className="mo-item-card">
                    <img
                      className="mo-product-image"
                      src={item.product.images[0]?.path}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = "/default-image.png";
                      }}
                    />
                    <div className="mo-item-details">
                      <h4>{item.product.name}</h4>
                      <p>
                        <strong>Category:</strong> {item.product.category}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                    </div>
                    <div className="mo-item-details-2">
                      <p>
                        <strong>Price/Unit:</strong> ₹{item.pricePerUnit}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{item.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <UserFooter />
    </div>
  );
};

export default MyOrders;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./ProductPreviewModal.css";
import Slider from "react-slick";

const ProductPreviewModal = ({ product, onClose, onConfirm }) => {
  const [selectedPrice, setSelectedPrice] = useState(
    product?.prices?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product?.quantity === 0;

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    const found = product.prices.find(
      (price) => parseFloat(price.finalPrice) === value
    );
    if (found) setSelectedPrice(found);
  };

  const handleQuantityChange = (qty) => {
    if (qty >= 1 && qty <= product.quantity) {
      setQuantity(qty);
    }
  };

  const handleAddToCart = () => {
    alert("Add to cart clicked (demo)");
  };

  const finalPriceNum = selectedPrice
    ? parseFloat(selectedPrice.finalPrice) || 0
    : 0;
  const originalPriceNum = selectedPrice
    ? parseFloat(selectedPrice.price) || 0
    : 0;

  const ProductSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const modalContent = (
    <div className="ppm-modal-overlay">
      <div className="ppm-modal">
        <button className="ppm-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="ppm-product-page">
          {/* Product Info */}
          <div className="ppm-product">
            <h1 className="ppm-title">{product?.name}</h1>
            <h3 className="ppm-category">{product?.category}</h3>

            <div className="ppm-image-container">
              {product?.images?.length > 1 ? (
                <Slider {...ProductSettings}>
                  {product.images.map((image) => (
                    <div key={image.imageId}>
                      <img
                        src={image.path}
                        alt={`Product ${product.name} ${image.imageId}`}
                        className="ppm-image"
                      />
                    </div>
                  ))}
                </Slider>
              ) : product?.images?.length === 1 ? (
                <img
                  src={product.images[0].path}
                  alt={`Product ${product.name}`}
                  className="ppm-image"
                />
              ) : (
                <div className="ppm-placeholder">
                  <img
                    src="/placeholder.jpg"
                    alt="No Image Available"
                    className="ppm-image"
                  />
                </div>
              )}
            </div>

            {/* Pricing Table */}
            <div className="ppm-pricing-table">
              <h3 className="ppm-sub-title">Available Denominations</h3>
              <table className="ppm-price-table">
                <thead>
                  <tr>
                    <th>MRP</th>
                    <th>Discount</th>
                    <th>Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.prices?.map((price, index) => (
                    <tr key={index}>
                      <td>₹{price.price}</td>
                      <td>{price.discount}%</td>
                      <td>₹{parseFloat(price.finalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <h2 className="ppm-sub-title">Description</h2>
            <p className="ppm-description">{product?.description}</p>

            <h2 className="ppm-sub-title">How to Claim</h2>
            <ol className="ppm-description-list">
              <li>Go to the {product?.name} website from your browser</li>
              <li>Login or create an account.</li>
              <li>Purchase a product.</li>
              <li>Select the Gift Card option during checkout.</li>
              <li>Enter your Gift Card code from email.</li>
              <li>Click Redeem. Done.</li>
            </ol>
          </div>

          {/* Billing Section */}
          <div className="ppm-billing">
            <h2 className="ppm-billing-title">Purchase Now</h2>
            <p className="ppm-trust-msg">
              ✔ 100% Secure • Instant Delivery • No Expiry
            </p>
            <p className="ppm-delivery-info">
              🚚 Delivery: Instantly to your email
            </p>

            <p
              className={`ppm-stock ${
                outOfStock ? "out-of-stock" : "in-stock"
              }`}
            >
              {outOfStock ? "Out of Stock" : `${product.quantity} in stock`}
            </p>

            <div className="ppm-form-group">
              <label className="ppm-label">
                Select Amount <span className="ppm-hint">(after discount)</span>
              </label>
              <select
                className="ppm-input"
                value={selectedPrice?.finalPrice}
                disabled={outOfStock}
                onChange={handleAmountChange}
              >
                {product.prices.map((price, index) => (
                  <option key={index} value={price.finalPrice}>
                    ₹{price.finalPrice} — Save ₹
                    {(price.price - price.finalPrice).toFixed(0)}
                  </option>
                ))}
              </select>
            </div>

            <div className="ppm-form-group">
              <label className="ppm-label">
                Quantity{" "}
                <span className="ppm-hint">(Max: {product.quantity})</span>
              </label>
              <div className="ppm-quantity-wrapper">
                <button
                  type="button"
                  className="ppm-quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || outOfStock}
                >
                  −
                </button>
                <input
                  className="ppm-input ppm-quantity-input"
                  value={quantity}
                  disabled={outOfStock}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleQuantityChange(val);
                  }}
                />
                <button
                  type="button"
                  className="ppm-quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.quantity || outOfStock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="ppm-actions">
              <button
                className="ppm-btn ppm-add-cart"
                disabled={outOfStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>

            <div className="ppm-price-info">
              <p className="ppm-price-text">
                <strong>Original Price:</strong> ₹{originalPriceNum.toFixed(2)}
              </p>
              <p className="ppm-price-text">
                <strong>Discount:</strong> {selectedPrice?.discount}%
              </p>
              <p className="ppm-price-text">
                <strong>Final Price:</strong> ₹{finalPriceNum.toFixed(2)}
              </p>
              <p className="ppm-price-text ppm-total">
                <strong>Total Payable:</strong> ₹
                {(finalPriceNum * quantity).toFixed(2)}
              </p>
              <p className="ppm-price-text ppm-you-save">
                {" "}
                <strong>You Save:</strong> ₹
                {((originalPriceNum - finalPriceNum) * quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="ppm-actions">
          <button
            className="ppm-confirm-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
};

export default ProductPreviewModal;

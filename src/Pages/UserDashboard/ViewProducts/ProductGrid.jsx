import React, { useState, useMemo } from "react";
import Slider from "react-slick";
import "./ProductGrid.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("default");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleNavigate = (productId) => {
    navigate("/display-product", { state: { productId } });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.minPrice - b.minPrice);
      case "price-desc":
        return sorted.sort((a, b) => b.minPrice - a.minPrice);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "qty-desc":
        return sorted.sort((a, b) => b.availableQty - a.availableQty);
      case "qty-asc":
        return sorted.sort((a, b) => a.availableQty - b.availableQty);
      case "category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return products;
    }
  }, [products, sortOption]);

  return (
    <div className="pg-page">
      {/* Sort Dropdown */}
      <div className="pg-sort-container">
        <Breadcrumbs
          labelMap={{
            products: "Products",
          }}
        />
        <div>
          <label htmlFor="sortSelect">Sort by: </label>
          <select
            id="sortSelect"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="qty-desc">Quantity (High to Low)</option>
            <option value="qty-asc">Quantity (Low to High)</option>
            <option value="category">Category (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Product Cards */}
      <div className="pg-card-container">
        {sortedProducts.map((product) => (
          <div
            key={product.productId}
            className={`pg-card ${
              product.availableQty === 0 ? "pg-out-of-stock" : ""
            }`}
            onClick={() => handleNavigate(product.productId)}
          >
            <div
              className="pg-image-container"
              onClick={(e) => e.stopPropagation()}
            >
              {product.availableQty === 0 && (
                <div className="pg-overlay">Out of Stock</div>
              )}

              {product.images.length > 1 ? (
                <Slider {...settings}>
                  {product.images.map((image) => (
                    <div key={image.imageId}>
                      <img
                        src={image.path}
                        alt={`Product ${product.name} ${image.imageId}`}
                        className="pg-image"
                      />
                    </div>
                  ))}
                </Slider>
              ) : product.images.length === 1 ? (
                <img
                  src={product.images[0].path}
                  alt={`Product ${product.name}`}
                  className="pg-image"
                />
              ) : (
                <div className="pg-placeholder">
                  <img
                    src="/placeholder.jpg"
                    alt="No Image Available"
                    className="pg-image"
                  />
                </div>
              )}
            </div>

            <div className="pg-info-conatiner">
              <h4 className="pg-name">{product.name}</h4>
              <p className="pg-text">{product.category}</p>
              <p className="pg-text">
                Starting from{" "}
                <span className="pg-price">₹{product.minPrice}</span>
              </p>
              <p className="pg-buy-now">
                Buy Now <FaArrowRight />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

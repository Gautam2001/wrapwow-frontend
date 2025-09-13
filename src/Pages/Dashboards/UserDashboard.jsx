import React, { useEffect, useState } from "react";
import Carousel from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import "./UserDashboard.css";
//import AxiosInstance from "../../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import ad1 from "../../Assets/MMTAd.jpg";
import ad2 from "../../Assets/LifestyleAd.png";
import ad3 from "../../Assets/Ad1.jpg";
import ad4 from "../../Assets/Ad2.png";
import Slider from "react-slick";
import UserHeader from "../HeaderFooters/User/UserHeader";
import UserFooter from "../HeaderFooters/User/UserFooter";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../GlobalFunctions/GlobalLoader/LoadingContext";
import { useApiClients } from "../../api/useApiClients";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [categories, setCategories] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [mostExpensiveProducts, setMostExpensiveProducts] = useState([]);

  const AdSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slideToScroll: 1,
  };

  const ProductSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const [categoryRes, bestSellingRes, expensiveRes] = await Promise.all([
          wrapwowApi.get("/member/getCategories"),
          wrapwowApi.get("/user/getBestSellingProductList"),
          wrapwowApi.get("/user/getMostExpensiveProductList"),
        ]);

        const catResult = categoryRes.data;
        if (catResult.status === "1") {
          showPopup(catResult.message, "error");
        } else {
          const data = catResult.Categories;
          if (Array.isArray(data)) {
            const activeCategories = data.filter(
              (category) => category.categoryStatus === "ACTIVE"
            );
            setCategories(activeCategories);
          }
        }

        const bestResult = bestSellingRes.data;
        if (bestResult.status === "1") {
          showPopup(bestResult.message, "error");
        } else {
          const data = bestResult.Products;
          if (Array.isArray(data)) {
            const activeProducts = data.filter(
              (product) => product.productStatus === "ACTIVE"
            );
            setBestSellingProducts(activeProducts);
          }
        }

        const expensiveResult = expensiveRes.data;
        if (expensiveResult.status === "1") {
          showPopup(expensiveResult.message, "error");
        } else {
          const data = expensiveResult.Products;
          if (Array.isArray(data)) {
            const activeProducts = data.filter(
              (product) => product.productStatus === "ACTIVE"
            );
            setMostExpensiveProducts(activeProducts);
          }
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Something failed. Please try again."
            : "An error occurred. Check your connection.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [showPopup]);

  const handleCategoryClick = (e) => {
    const categoryId = e.currentTarget.value;
    navigate("/products", { state: { categoryId: categoryId } });
  };

  const handleNavigate = (productId) => {
    navigate("/display-product", { state: { productId } });
  };

  return (
    <div className="ud-page">
      <UserHeader />
      <div className="ud-container">
        <div className="ud-carousel">
          <Carousel {...AdSettings}>
            <div>
              <a href={ad1} target="_blank" rel="noopener noreferrer">
                <img src={ad1} alt="Ad 1" className="ud-carousel-image" />
              </a>
            </div>
            <div>
              <a href={ad2} target="_blank" rel="noopener noreferrer">
                <img src={ad2} alt="Ad 2" className="ud-carousel-image" />
              </a>
            </div>
          </Carousel>
        </div>

        <div className="ud-categories">
          {categories.map((category) => (
            <div key={category.categoryId} className="ud-category-card">
              <button
                onClick={handleCategoryClick}
                className="ud-category-button"
                value={category.categoryId}
                name="category"
              >
                <img
                  src={category.path}
                  alt={category.category}
                  className="ud-category-image"
                />
                <h4 className="ud-category-name">{category.category}</h4>
              </button>
            </div>
          ))}
        </div>

        <div className="ud-products">
          <div className="ud-product">
            <div className="ud-product-heading">
              <h2 className="ud-product-heading-title">Customer Favorites</h2>
              <p className="ud-product-heading-desc">
                The giftcards everyone’s loving
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/products");
              }}
              className="ud-product-button"
            >
              Explore All
              <FaArrowRight />
            </button>
          </div>
          <div className="ud-products-card">
            {bestSellingProducts.map((product) => (
              <div
                key={product.productId}
                className="ud-product-card"
                onClick={() => handleNavigate(product.productId)}
              >
                {/* Carousel or Image */}
                <div
                  className="ud-products-image-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.images.length > 1 ? (
                    <Slider {...ProductSettings}>
                      {product.images.map((image) => (
                        <div key={image.imageId}>
                          <img
                            src={image.path}
                            alt={`Product ${product.name} ${image.imageId}`}
                            className="ud-products-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : product.images.length === 1 ? (
                    <img
                      src={product.images[0].path}
                      alt={`Product ${product.name}`}
                      className="ud-products-image"
                    />
                  ) : (
                    <div className="ud-products-placeholder">
                      <img
                        src="/placeholder.jpg"
                        alt="No Image Available"
                        className="ud-products-image"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="ud-products-info-conatiner">
                  <h4 className="ud-products-name">{product.name}</h4>
                  <p className="ud-products-text">{product.category}</p>
                  <p className="ud-products-text">
                    Starting from{" "}
                    <span className="ud-products-price">
                      ₹{product.minPrice}
                    </span>
                  </p>
                  <p className="ud-products-buy-now">
                    Buy Now{"  "}
                    <FaArrowRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ud-advert">
          <div className="ud-advert-img-div">
            <a href={ad3} target="_blank" rel="noopener noreferrer">
              <img src={ad3} alt="Ad 2" className="ud-advert-image" />
            </a>
          </div>
          <div className="ud-advert-img-div">
            <a href={ad4} target="_blank" rel="noopener noreferrer">
              <img src={ad4} alt="Ad 2" className="ud-advert-image" />
            </a>
          </div>
        </div>

        <div className="ud-products">
          <div className="ud-product">
            <div className="ud-product-heading">
              <h2 className="ud-product-heading-title">Elite Collection</h2>
              <p className="ud-product-heading-desc">
                Elite Collection High-value giftcards for grand gestures
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/products");
              }}
              className="ud-product-button"
            >
              Explore All
              <FaArrowRight />
            </button>
          </div>
          <div className="ud-products-card">
            {mostExpensiveProducts.map((product) => (
              <div
                key={product.productId}
                className="ud-product-card"
                onClick={() => handleNavigate(product.productId)}
              >
                {/* Carousel or Image */}
                <div
                  className="ud-products-image-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.images.length > 1 ? (
                    <Slider {...ProductSettings}>
                      {product.images.map((image) => (
                        <div key={image.imageId}>
                          <img
                            src={image.path}
                            alt={`Product ${product.name} ${image.imageId}`}
                            className="ud-products-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : product.images.length === 1 ? (
                    <img
                      src={product.images[0].path}
                      alt={`Product ${product.name}`}
                      className="ud-products-image"
                    />
                  ) : (
                    <div className="ud-products-placeholder">
                      <img
                        src="/placeholder.jpg"
                        alt="No Image Available"
                        className="ud-products-image"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="ud-products-info-conatiner">
                  <h4 className="ud-products-name">{product.name}</h4>
                  <p className="ud-products-text">{product.category}</p>
                  <p className="ud-products-text">
                    Starting from{" "}
                    <span className="ud-products-price">
                      ₹{product.minPrice}
                    </span>
                  </p>
                  <p className="ud-products-buy-now">
                    Buy Now{"  "}
                    <FaArrowRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default UserDashboard;

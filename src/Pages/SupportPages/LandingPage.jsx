import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Carousel from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import ad1 from "../../Assets/MMTAd.jpg";
import ad2 from "../../Assets/LifestyleAd.png";
import ad3 from "../../Assets/Ad1.jpg";
import ad4 from "../../Assets/Ad2.png";
import Slider from "react-slick";
import LandingHeader from "../HeaderFooters/LandingPage/LandingHeader";
import LandingFooter from "../HeaderFooters/LandingPage/LandingFooter";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../GlobalFunctions/GlobalLoader/LoadingContext";
import { useApiClients } from "../../api/useApiClients";

const LandingPage = () => {
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

  const handleLoginRedirect = () => {
    showPopup("Please login to continue", "info");
  };

  useEffect(() => {
    const fetchLandingScreenData = async () => {
      showLoader(0);
      try {
        const response = await wrapwowApi.get("/member/landingPageData");
        const result = response.data;

        if (result.status === "1") {
          showPopup(result.message, "error");
        } else {
          const activeCategories = (result.Categories || []).filter(
            (category) => category.categoryStatus === "ACTIVE"
          );
          setCategories(activeCategories);

          const activeBestSellers = (result.BestSellingProducts || []).filter(
            (product) => product.productStatus === "ACTIVE"
          );
          setBestSellingProducts(activeBestSellers);

          const activeExpensive = (result.ExpensiveProducts || []).filter(
            (product) => product.productStatus === "ACTIVE"
          );
          setMostExpensiveProducts(activeExpensive);
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Fetching categories failed. Please try again."
            : "An error occurred. Please check your connection.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchLandingScreenData();
  }, [showPopup]);

  return (
    <div className="lp-page">
      <LandingHeader />
      <div className="lp-container">
        {/* Ads Carousel */}
        <div className="lp-carousel">
          <Carousel {...AdSettings}>
            {[ad1, ad2].map((ad, idx) => (
              <div key={idx}>
                <a href={ad} target="_blank" rel="noopener noreferrer">
                  <img
                    src={ad}
                    alt={`Ad ${idx + 1}`}
                    className="lp-carousel-image"
                  />
                </a>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Categories */}
        <div className="lp-categories">
          {categories.map((category) => (
            <div key={category.categoryId} className="lp-category-card">
              <button
                className="lp-category-button"
                onClick={handleLoginRedirect}
              >
                <img
                  src={category.path}
                  alt={category.category}
                  className="lp-category-image"
                />
                <h4 className="lp-category-name">{category.category}</h4>
              </button>
            </div>
          ))}
        </div>

        {/* Best Selling Products */}
        <div className="lp-products">
          <div className="lp-product">
            <div className="lp-product-heading">
              <h2 className="lp-product-heading-title">Customer Favorites</h2>
              <p className="lp-product-heading-desc">
                The giftcards everyone’s loving
              </p>
            </div>
            <button onClick={handleLoginRedirect} className="lp-product-button">
              Explore All <FaArrowRight />
            </button>
          </div>
          <div className="lp-products-card">
            {bestSellingProducts.map((product) => (
              <div
                key={product.productId}
                className="lp-product-card"
                onClick={handleLoginRedirect}
              >
                <div className="lp-products-image-container">
                  {product.images.length > 1 ? (
                    <Slider {...ProductSettings}>
                      {product.images.map((image) => (
                        <div key={image.imageId}>
                          <img
                            src={image.path}
                            alt={`Product ${product.name}`}
                            className="lp-products-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : product.images.length === 1 ? (
                    <img
                      src={product.images[0].path}
                      alt={product.name}
                      className="lp-products-image"
                    />
                  ) : (
                    <div className="lp-products-placeholder">
                      <img
                        src="/placeholder.jpg"
                        alt="No Image"
                        className="lp-products-image"
                      />
                    </div>
                  )}
                </div>
                <div className="lp-products-info-conatiner">
                  <h4 className="lp-products-name">{product.name}</h4>
                  <p className="lp-products-text">{product.category}</p>
                  <p className="lp-products-text">
                    Starting from{" "}
                    <span className="lp-products-price">
                      ₹{product.minPrice}
                    </span>
                  </p>
                  <p className="lp-products-buy-now">
                    Buy Now <FaArrowRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advertisements */}
        <div className="lp-advert">
          {[ad3, ad4].map((ad, idx) => (
            <div className="lp-advert-img-div" key={idx}>
              <a href={ad} target="_blank" rel="noopener noreferrer">
                <img
                  src={ad}
                  alt={`Ad ${idx + 3}`}
                  className="lp-advert-image"
                />
              </a>
            </div>
          ))}
        </div>

        {/* Elite Products */}
        <div className="lp-products">
          <div className="lp-product">
            <div className="lp-product-heading">
              <h2 className="lp-product-heading-title">Elite Collection</h2>
              <p className="lp-product-heading-desc">
                Elite Collection High-value giftcards for grand gestures
              </p>
            </div>
            <button onClick={handleLoginRedirect} className="lp-product-button">
              Explore All <FaArrowRight />
            </button>
          </div>
          <div className="lp-products-card">
            {mostExpensiveProducts.map((product) => (
              <div
                key={product.productId}
                className="lp-product-card"
                onClick={handleLoginRedirect}
              >
                <div className="lp-products-image-container">
                  {product.images.length > 1 ? (
                    <Slider {...ProductSettings}>
                      {product.images.map((image) => (
                        <div key={image.imageId}>
                          <img
                            src={image.path}
                            alt={`Product ${product.name}`}
                            className="lp-products-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : product.images.length === 1 ? (
                    <img
                      src={product.images[0].path}
                      alt={product.name}
                      className="lp-products-image"
                    />
                  ) : (
                    <div className="lp-products-placeholder">
                      <img
                        src="/placeholder.jpg"
                        alt="No Image"
                        className="lp-products-image"
                      />
                    </div>
                  )}
                </div>
                <div className="lp-products-info-conatiner">
                  <h4 className="lp-products-name">{product.name}</h4>
                  <p className="lp-products-text">{product.category}</p>
                  <p className="lp-products-text">
                    Starting from{" "}
                    <span className="lp-products-price">
                      ₹{product.minPrice}
                    </span>
                  </p>
                  <p className="lp-products-buy-now">
                    Buy Now <FaArrowRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;

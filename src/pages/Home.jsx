import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Reason from "../components/Reason/Reason";
import "../styles/Home.css";
import brilliant1 from "../assets/bri1.png";
import brilliant2 from "../assets/bri2.png";
import brilliant3 from "../assets/bri3.png";
import brilliant4 from "../assets/bri4.png";
import ringC from "../assets/cate1.webp";
import necklaceC from "../assets/cate2.png";
import earringC from "../assets/cate3.png";
import braceletC from "../assets/cate4.png";
import slide3 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.png";
import slide1 from "../assets/slide3.webp";
import slide3Small from "../assets/slide3Small.jpeg";
import slide2Small from "../assets/slide2Small.jpg";
import slide1Small from "../assets/slide1Small.png";
import sliderBackground from "../assets/homeBackground.png";
import bb from "../assets/belove.jpg";
import trending from "../assets/diff2.png";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "transparent",
        zIndex: 25,
        marginRight: "50px",
      }}
      onClick={(e) => {
        onClick(e);
        props.restartAnimation();
      }}>
      <i
        className="fas fa-chevron-right"
        style={{ color: "white", fontSize: "30px" }}></i>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "transparent",
        zIndex: 25,
        marginLeft: "50px",
      }}
      onClick={(e) => {
        onClick(e);
        props.restartAnimation();
      }}>
      <i
        className="fas fa-chevron-left"
        style={{ color: "white", fontSize: "30px" }}></i>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("newArrivals");
  const [trendingProducts, setTrendingProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.title = "Alurà";
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    nextArrow: <NextArrow restartAnimation={() => setAnimate(false)} />,
    prevArrow: <PrevArrow restartAnimation={() => setAnimate(false)} />,
    beforeChange: (current, next) => {
      setAnimate(false);
      setCurrentSlide(next);
    },
    afterChange: () => {
      setTimeout(() => setAnimate(true), 0);
    },
  };

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };


  useEffect(() => {
    async function fetchTrendingProducts() {
      try {
        const res = await fetch(`${API_URL}/dashboard/top-homepage-products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTrendingProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch top homepage products:", error);
      }
    }

    fetchTrendingProducts();
  }, [API_URL]);

  useEffect(() => {
    const handleScroll = () => {
      const missionText = document.querySelector(".trending_text");
      if (missionText) {
        const scrollPosition = window.scrollY;
        missionText.style.transform = `translateX(${-scrollPosition * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProductClick = (product) => {
    navigate(`/products/${product.productId}`, { state: { id: product.productId } });
  };

  return (
    <div className="Home">
      {/* Slider */}
      <div className="slider-container">
        <Slider {...settings}>
          <div className="slide">
            <div className="slide-background">
              <img src={sliderBackground} alt="Background" />
            </div>
            <div className="slide-content">
              <img className="slide-img left-img" src={slide1} alt="Slide 1" />
              <h1>
                COSMETICS
              </h1>
              <div className="slide-right-section">
                <p className="slide-text right-text">
                  C  L  A  S  S  I  C     C  O  S  M  E  T  I  C
                </p>
                <div className="slide-small-image">
                  <img src={slide1Small} alt="Small Slide 1" />
                  <button
                    onClick={() => handleNavigate("/cosmetics")}
                    className="slide-button">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="slide">
            <div className="slide-background">
              <img src={sliderBackground} alt="Slide 2" />
              <h1>
                MEDICAL & <br></br>TREATMENT
              </h1>
            </div>
            <div className="slide-content">
              <img className="slide-img left-img" src={slide2} alt="Slide 2" />
              <div className="slide-right-section">
                <p className="slide-text right-text">
                  C  L  A  S  S  I  C     C  O  S  M  E  T  I  C
                </p>
                <div className="slide-small-image">
                  <img src={slide2Small} alt="Small Slide 1" />
                  <button
                    onClick={() => handleNavigate("/treatments")}
                    className="slide-button">
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="slide">
            <div className="slide-background">
              <img src={sliderBackground} alt="Slide 3" />
              <h1>
                {/* PURE <br></br>FRAGRANCE */}
              </h1>
            </div>
            <div className="slide-content">
              <img className="slide-img left-img" src={slide3} alt="Slide 3" />
              <div className="slide-right-section">
                <p className="slide-text right-text">
                  C  L  A  S  S  I  C     C  O  S  M  E  T  I  C
                </p>
                <div className="slide-small-image">
                  <img src={slide3Small} alt="Small Slide 3" />
                  {/* <button
                    onClick={() => handleNavigate("/cosmetics", { type: "Fragrance" })}
                    className="slide-button">
                    SHOP THIS CATEGORY
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Under slider  */}
      <div className="under_slider_container">
        <div className="under_slider_column">
          <i className="fas fa-shipping-fast under_slider_icon"></i>
          <div className="under_slider_text_container">
            <h4 className="under_slider_title">Fast shipping</h4>
            <p className="under_slider_text">For all orders</p>
          </div>
        </div>
        <div className="under_slider_column">
          <i className="fa fa-headset under_slider_icon"></i>
          <div className="under_slider_text_container">
            <h4 className="under_slider_title">Hotline support</h4>
            <p className="under_slider_text">Customer service</p>
          </div>
        </div>
        <div className="under_slider_column">
          <i className="fa fa-undo-alt under_slider_icon"></i>
          <div className="under_slider_text_container">
            <h4 className="under_slider_title">Instant warranty</h4>
            <p className="under_slider_text">If product have problems</p>
          </div>
        </div>
        <div className="under_slider_column">
          <i className="far fa-credit-card under_slider_icon"></i>
          <div className="under_slider_text_container">
            <h4 className="under_slider_title">Payment method</h4>
            <p className="under_slider_text">100% secure payment</p>
          </div>
        </div>
      </div>
      <hr className="under_slider_hr" />


      {/* Category */}
      <div className="category_container text-center">
        <h1 className="category_title">Shop By Categories</h1>
        <p className="category_description">
          Discover our handpicked collections of skincare, makeup, and beauty
          essentials designed to enhance your natural glow. Whether you're
          treating yourself or gifting someone special, we have the perfect
          product for every occasion.
        </p>
        <div className="category_grid container">
          <div className="row">
            <div className="category_large col-md-4">
              <div className="category_item_large">
                <div className="category_image_wrapper_large">
                  <img src={earringC} alt="Facial" />
                  <p className="category_name_large">Lipstick</p>
                  <div className="category_hover_content">
                    <p className="category_name_large_hover">Lipstick</p>
                    <div className="category_hover_text">
                      <span className="category_large_letter">L</span>
                      <span
                        onClick={() =>
                          handleNavigate("/cosmetics", { type: "Lipstick" })
                        }
                        className="category_view_collection">
                        VIEW CATEGORY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="category_small_container col-md-4">
              <div className="category_item_small">
                <div className="category_image_wrapper_small ciwm1">
                  <img src={ringC} alt="Ring" />
                  <p className="category_name_small">Toner </p>
                  <div className="category_hover_content_small">
                    <p className="category_name_small_hover">Toner </p>
                    <div className="category_hover_text_small">
                      <span className="category_large_letter_small">T</span>
                      <span
                        onClick={() =>
                          handleNavigate("/treatments", { type: "Toner" })
                        }
                        className="category_view_collection_small">
                        VIEW CATEGORY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="category_item_small">
                <div className="category_image_wrapper_small ciwm2">
                  <img src={braceletC} alt="Body" />
                  <p className="category_name_small">Cleanser</p>
                  <div className="category_hover_content_small">
                    <p className="category_name_small_hover">Cleanser</p>
                    <div className="category_hover_text_small">
                      <span className="category_large_letter_small">C</span>
                      <span
                        onClick={() =>
                          handleNavigate("/treatments", { type: "Cleanser" })
                        }
                        className="category_view_collection_small">
                        VIEW CATEGORY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="category_large col-md-4">
              <div className="category_item_large">
                <div className="category_image_wrapper_large">
                  <img src={necklaceC} alt="Necklace" />
                  <p className="category_name_large">Serum</p>
                  <div className="category_hover_content">
                    <p className="category_name_large_hover">Serum</p>
                    <div className="category_hover_text">
                      <span className="category_large_letter">S</span>
                      <span
                        onClick={() =>
                          handleNavigate("/treatments", { type: "Serum" })
                        }
                        className="category_view_collection">
                        VIEW CATEGORY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best & Beloved */}
      <div className="bb_container">
        <img src={bb} alt="Best & Beloved" className="bb_image" />
        <div className="bb_content">
          <div className="bb_text">
            <h2 className="bb_title">Best & Beloved</h2>
            <p className="bb_description">
              Our most loved skincare and beauty products, carefully selected
              based on what our customers adore the most.
            </p>
          </div>
          <button
            onClick={() => handleNavigate("/cosmetics", { type: "" })}
            className="bb_shop_now_button">
            Shop now
          </button>
        </div>
      </div>

      {/* Trending */}
      <div className="trending_container">
        <div className="trending_text">classic cosmetics</div>
        <div className="trending_white">                                 </div>
        <div className="row">
          <div className="col-lg-5 col-md-6 ">
            <img src={trending} alt="Trending" className="trending_image" />
          </div>
          <div className="col-lg-7 col-md-6 trending_right">
            <h2 className="trending_title">Alurà Best Seller</h2>
            <div className="trending_product_card_section row">
              {trendingProducts.map((product, index) => (
                <div
                  key={index}
                  className="trending_product_card card"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.imgUrls?.[0] || ""}
                    alt={product.name}
                    className="product_image"
                  />
                  <p className="trending_product_name">{product.name}</p>
                  <p className="trending_product_price">
                    {product.price.toLocaleString()} VND
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <br></br>

      {/* Reason */}
      <Reason></Reason>

      {/* Brilliant */}
      <div className="brilliant_container">
        <h2 className="brilliant_title">Be Part Of Something Brilliant</h2>
        <p className="brilliant_description">
          Join us on Instagram for daily beauty inspiration, skincare tips, and
          real transformations. Don’t forget to tag{" "}
          <a
            href="https://www.instagram.com/alura"
            target="_blank"
            rel="noopener noreferrer">
            @Alurà
          </a>{" "}
          in your glowing selfies or product routines for a chance to be
          featured on our page. We are looking to see you!
        </p>
        <div className="brilliant_grid">
          <div className="brilliant_column">
            <div
              className="brilliant_image_large"
              onClick={() =>
                window.open("https://www.instagram.com/alura", "_blank")
              }>
              <img src={brilliant1} alt="Image 1" />
              <i className="fab fa-instagram brilliant_icon"></i>
            </div>
          </div>
          <div className="brilliant_column">
            <div
              className="brilliant_image_small"
              onClick={() =>
                window.open("https://www.instagram.com/alura", "_blank")
              }>
              <img src={brilliant2} alt="Image 2" />
              <i className="fab fa-instagram brilliant_icon"></i>
            </div>
            <div
              className="brilliant_image_small"
              onClick={() =>
                window.open("https://www.instagram.com/alura", "_blank")
              }>
              <img src={brilliant3} alt="Image 3" />
              <i className="fab fa-instagram brilliant_icon"></i>
            </div>
          </div>
          <div className="brilliant_column">
            <div
              className="brilliant_image_large"
              onClick={() =>
                window.open("https://www.instagram.com/alura", "_blank")
              }>
              <img src={brilliant4} alt="Image 4" />
              <i className="fab fa-instagram brilliant_icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

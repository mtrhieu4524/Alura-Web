import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Image } from "antd";
import Insta from "../../components/Insta/Instagram";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/product/ProductDetail.css";
import { useCart } from "../../context/CartContext";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProductDetail() {
  const location = useLocation();
  const productId = location.state?.id;
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSpecifications, setShowSpecifications] = useState(true);
  const { setCartCount } = useCart();
  const { role } = useSelector((state) => state.auth);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (productId) {
      fetch(`${API_URL}/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) {
            setProduct(data);
            setSelectedImage(data.imgUrls?.[0] || data.imgUrl);
            document.title = `Alurà - ${data.name}`;
          } else {
            toast.error("Product not found");
          }
        })
        .catch(() => toast.error("Failed to fetch product data"));
    }
  }, [productId, API_URL]);

  const handleAddToCart = async () => {
    if (!productId) {
      toast.error("No product selected.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please sign in before add product to cart.");
      return;
    }

    try {
      const productsRes = await fetch(`${API_URL}/products`);
      const productsData = await productsRes.json();

      if (!productsData?.success || !Array.isArray(productsData.products)) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const stillExists = productsData.products.find(
        (p) => p._id === productId && p.isPublic === true
      );

      if (!stillExists) {
        navigate("/");
        toast.error("Sorry, this product is no longer available now.");
        return;
      }

      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to add to cart";
        if (role === "ADMIN" || role === "STAFF") {
          errorMessage =
            "You are logged in as an admin/staff. Adding to cart is not permitted.";
        }
        toast.error(errorMessage);
        return;
      }

      const cartRes = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartCount(cartData?.items?.length || 0);
      }

      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const toggleSpecifications = () => setShowSpecifications((prev) => !prev);

  if (!product)
    return (
      <div className="loading">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 0",
          }}>
          <CircularProgress style={{ color: "#1c1c1c" }} />
        </div>
      </div>
    );

  const navItems = [
    { name: "Home", link: "/" },
    // { name: "Cosmetics", link: "/cosmetics" },
    { name: product.name },
  ];

  const maxProductAvailable = product.stock || 0;

  const capitalizeFirstLetter = (str) => {
    if (!str) return "None";
    const text = String(str);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div id="product_detail" className="product_detail">
      <Breadcrumb items={navItems} />
      <br />
      <div className="product_detail_container">
        <div className="product_images_detail">
          <div className="thumbnails">
            {product.imgUrls?.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail ${selectedImage === image ? "selected" : ""
                  }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          <Image.PreviewGroup>
            <Image
              src={selectedImage}
              alt={product.name}
              width={415}
              height={516}
              style={{ objectFit: 'cover' }}
              className="main_image"
            />
          </Image.PreviewGroup>
        </div>

        <div className="product_info_detail">
          <h2 className="product_name_detail">
            {product.name} ({maxProductAvailable} left)
          </h2>
          <p className="product_description_detail">{product.description}</p>
          <p className="product_code_detail">
            <strong>Type:</strong> {product.productTypeId?.name || "None"}
          </p>
          <p className="product_cosmetic_detail">
            <strong>Skin Type:</strong>{" "}
            {capitalizeFirstLetter(product.skinType)}
          </p>
          <p className="product_shell_detail">
            <strong>Volume:</strong> {product.volume}
          </p>
          <p className="product_cosmetic_detail">
            <strong>Sold:</strong> {product.sold || 0}
          </p>

          <div className="price_size_container">
            <p className="product_price_detail">
              {product.price?.toLocaleString()} VND
            </p>
            <div className="quantity_selector_container">
              <div className="quantity_controls">
                <button
                  className="quantity_btn"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={quantity <= 1}>
                  -
                </button>
                <input
                  type="number"
                  className="quantity_input"
                  value={quantity}
                  min="1"
                  max={maxProductAvailable}
                  onChange={(e) => {
                    const value = Math.max(
                      1,
                      Math.min(
                        maxProductAvailable,
                        parseInt(e.target.value) || 1
                      )
                    );
                    setQuantity(value);
                  }}
                />
                <button
                  className="quantity_btn"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(prev + 1, maxProductAvailable)
                    )
                  }
                  disabled={quantity >= maxProductAvailable}>
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="product_actions_detail">
            <button
              className="add_to_cart_btn"
              onClick={handleAddToCart}
              disabled={maxProductAvailable === 0}
              style={{
                backgroundColor:
                  maxProductAvailable === 0 ? "#797979" : "#1c1c1c",
                color: "white",
              }}>
              <i
                className="fas fa-shopping-cart"
                style={{ color: "white" }}></i>{" "}
              {maxProductAvailable === 0 ? "Sold out" : "Add to cart"}
            </button>
          </div>

          <hr className="product_detail_line" />
          <div className="product_delivery_detail">
            <p>
              <i className="fas fa-phone"></i>{" "}
              <a href="tel:0795795959">0795 795 959</a>
            </p>
            <p>
              <i className="fas fa-shipping-fast"></i> Nationwide shipping
            </p>
            <p>
              <i className="fas fa-calendar-alt"></i> Estimated delivery in 3–5
              days
            </p>
          </div>
          <hr className="product_detail_line" />
        </div>
      </div>
      <div className="product_specification_container">
        <h3
          className="product_specification_title"
          onClick={toggleSpecifications}
          style={{ cursor: "pointer" }}>
          Specifications & Descriptions
          <i
            className={`fas ${showSpecifications ? "fa-chevron-up" : "fa-chevron-down"
              } specification_toggle_icon`}></i>
        </h3>
        <hr className="product_specification_line" />
        {showSpecifications && (
          <div className="specifications_grid">
            <div className="specification_item">
              <span className="specification_label">Name: </span>
              <p className="specification_value">{product.name || "None"}</p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Type: </span>
              <p className="specification_value">
                {product.productTypeId?.name || "None"}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Skin Type: </span>
              <p className="specification_value">
                {capitalizeFirstLetter(product.skinType)}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Skin Color: </span>
              <p className="specification_value">
                {capitalizeFirstLetter(product.skinColor)}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Sex: </span>
              <p className="specification_value">
                {capitalizeFirstLetter(product.sex)}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Volume: </span>
              <p className="specification_value">{product.volume || "None"}</p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Brand: </span>
              <p className="specification_value">
                {product.brand?.brandName || "None"}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Purpose: </span>
              <p className="specification_value">{product.purpose || "None"}</p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Instruction: </span>
              <p className="specification_value">
                {product.instructions || "None"}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Preserve: </span>
              <p className="specification_value">
                {/* Expiry date: {product.expiryDate || "xx/xx/xxxx. "} */}
                {product.preservation || "None"}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Key Ingredients: </span>
              <p className="specification_value">
                {product.keyIngredients || "None"}
              </p>
            </div>

            <div className="specification_item">
              <span className="specification_label">Detail Ingredients: </span>
              <p className="specification_value">
                {product.detailInfredients || "None"}
              </p>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Insta />
    </div>
  );
}

export default ProductDetail;

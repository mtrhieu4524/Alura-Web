import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Image } from "antd";
import GIA from "../../assets/certificate.webp";
import Insta from "../../components/Insta/Instagram";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/product/ProductDetail.css";

function ProductDetail() {
    const location = useLocation();
    const productId = location.state?.id;

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showSpecifications, setShowSpecifications] = useState(true);

    useEffect(() => {
        if (productId) {
            fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`)
                .then(res => res.json())
                .then(data => {
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
    }, [productId]);

    const handleAddToCart = () => {
        toast.success("Added to cart!");
    };

    const toggleSpecifications = () => setShowSpecifications(prev => !prev);

    if (!product) return <div className="loading">Loading...</div>;

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Cosmetics", link: "/cosmetics" },
        { name: product.name },
    ];

    const maxProductAvailable = product.stock || 0;

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
                                className={`thumbnail ${selectedImage === image ? "selected" : ""}`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                    <Image.PreviewGroup>
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            className="main_image"
                            width={415}
                            height={516}
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
                    <p className="product_diamond_detail">
                        <strong>Skin Type:</strong> {product.skinType || "None"}
                    </p>
                    <p className="product_shell_detail">
                        <strong>Volume:</strong> {product.volume}
                    </p>
                    <p className="product_diamond_detail">
                        <strong>Sold:</strong> {product.sold || 0}
                    </p>

                    <div className="price_size_container">
                        <p className="product_price_detail">{product.price?.toLocaleString()} VND</p>
                        <div className="quantity_selector_container">
                            <div className="quantity_controls">
                                <button
                                    className="quantity_btn"
                                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                                    disabled={quantity <= 1}
                                >-</button>
                                <input
                                    type="number"
                                    className="quantity_input"
                                    value={quantity}
                                    min="1"
                                    max={maxProductAvailable}
                                    onChange={(e) => {
                                        const value = Math.max(1, Math.min(maxProductAvailable, parseInt(e.target.value) || 1));
                                        setQuantity(value);
                                    }}
                                />
                                <button
                                    className="quantity_btn"
                                    onClick={() => setQuantity(prev => Math.min(prev + 1, maxProductAvailable))}
                                    disabled={quantity >= maxProductAvailable}
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <div className="product_actions_detail">
                        <button
                            className="add_to_cart_btn"
                            onClick={handleAddToCart}
                            disabled={maxProductAvailable === 0}
                            style={{
                                backgroundColor: maxProductAvailable === 0 ? "#797979" : "#1c1c1c",
                                color: "white",
                            }}
                        >
                            <i className="fas fa-shopping-cart" style={{ color: "white" }}></i>{" "}
                            {maxProductAvailable === 0 ? "Sold out" : "Add to cart"}
                        </button>
                    </div>

                    <hr className="product_detail_line" />
                    <div className="product_delivery_detail">
                        <p><i className="fas fa-phone"></i> <a href="tel:0795795959">0795 795 959</a></p>
                        <p><i className="fas fa-shipping-fast"></i> Free nationwide shipping</p>
                        <p><i className="fas fa-calendar-alt"></i> Estimated delivery in 3–5 days</p>
                    </div>
                    <hr className="product_detail_line" />
                </div>
            </div>

            <div className="product_specification_container">
                <h3 className="product_specification_title" onClick={toggleSpecifications}>
                    Specifications & Descriptions
                    <i className={`fas ${showSpecifications ? "fa-chevron-up" : "fa-chevron-down"} specification_toggle_icon`}></i>
                </h3>
                <hr className="product_specification_line" />
                {showSpecifications && (
                    <>
                        <p><strong>Type:</strong> {product.productTypeId?.name}</p>
                        <p><strong>Brand:</strong> {product.brand?.brandName || "None"}</p>
                        <p><strong>Sex:</strong> {product.sex}</p>
                        <p><strong>Skin Type:</strong> {product.skinType}</p>
                        <p><strong>Skin Color:</strong> {product.skinColor}</p>
                        <p><strong>Volume:</strong> {product.volume}</p>
                        <p><strong>Purpose:</strong> {product.purpose}</p>
                        <p><strong>Instruction:</strong> {product.instructions}</p>
                        <p><strong>Preserve:</strong> {product.preservation}</p>
                        <p><strong>Key Ingredients:</strong> {product.keyIngredients}</p>
                        <p><strong>Detail Ingredients:</strong> {product.detailInfredients}</p>
                    </>
                )}
            </div>

            <div className="GIA_image_wrapper">
                <img src={GIA} alt="GIA certificate" className="GIA_image" />
            </div>
            <p className="GIA_content">
                Alurà guarantees the authenticity and safety of all products—trusted by skincare professionals worldwide.
            </p>

            <Insta />
        </div>
    );
}

export default ProductDetail;

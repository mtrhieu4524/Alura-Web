import { useState } from "react";
import { toast } from "sonner";
import { Image } from 'antd';
import GIA from "../../assets/certificate.webp";
import Insta from '../../components/Insta/Instagram';
// import CollectionSlide from "../../components/CollectionSlide/CollectionSlide";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/product/ProductDetail.css";

function ProductDetail() {

    const product = {
        name: "Hydrating Facial Serum",
        description: "A lightweight, fast-absorbing serum that deeply hydrates and revitalizes skin.",
        price: 39.99,
    };

    const images = [
        "https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg",
        "https://i.pinimg.com/736x/98/8a/07/988a07df10eae1a53ad789c8329b18f5.jpg",
    ];

    const alsoLikeProducts = [
        {
            imageLinkList: "https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg",
            name: "Moisturizer",
            price: 25.99,
            clarity: "N/A",
            carat: "N/A",
            color: "N/A",
        },
        {
            imageLinkList: "https://i.pinimg.com/564x/70/e4/9c/70e49c4a2ea8af1f538cd0ea2c505db9.jpg",
            name: "SPF 50 Sunscreen",
            price: 19.99,
            clarity: "N/A",
            carat: "N/A",
            color: "N/A",
        },
    ];

    const navItems = [{ name: 'Home', link: '/' }, { name: 'Product', link: '/product' }, { name: product.name }];
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [maxProductAvailable, setMaxProductAvailable] = useState(15);
    const [selectedVolume, setSelectedVolume] = useState("7.5 ml");
    const [volumePrice, setVolumePrice] = useState(0);
    const [availableVolume] = useState(["7.5 ml", "40 ml"]);
    // const [availableSizes] = useState(["30ml", "50ml", "100ml"]);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showSpecifications, setShowSpecifications] = useState(true);

    const isVolumeDisabled = (volume) => false;

    useEffect(() => {
        document.title = "Alurà - Product Detail";
    }, []);

    const handleVolumeChange = (e) => {
        setSelectedVolume(e.target.value);
        setVolumePrice(e.target.value === "7.5 ml" ? 2 : 0);
    };

    const handleAddToCart = () => {
        toast.success("Added to cart!");
    };

    const toggleSpecifications = () => setShowSpecifications(prev => !prev);
    const navigateToProductDetail = (product) => {
        toast.info("Navigating to product detail for preview only.");
    };


    return (
        <div id="product_detail" className={`product_detail ${showSizeGuide ? "no-scroll" : ""}`}>
            <Breadcrumb items={navItems} />
            <br />
            <div className="product_detail_container">
                <div className="product_images_detail">
                    <div className="thumbnails">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
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
                        />
                    </Image.PreviewGroup>
                </div>
                <div className="product_info_detail">
                    <h2 className="product_name_detail">
                        {product.name} ({maxProductAvailable} left)
                    </h2>
                    <p className="product_description_detail">{product.description}</p>
                    <p className="product_code_detail"><strong>Type:</strong> Face Medical & Treatment</p>
                    <p className="product_diamond_detail"><strong>Skin Type:</strong> Oily, dry</p>
                    <p className="product_shell_detail">
                        <strong>Volume:</strong>
                        {availableVolume.map((volume) => (
                            <label
                                key={volume}
                                style={{
                                    marginRight: "1px",
                                    marginLeft: "15px",
                                    color: isVolumeDisabled(volume) ? "gray" : "black",
                                }}
                            >
                                <input
                                    className="shell_checkbox"
                                    type="radio"
                                    value={volume}
                                    checked={selectedVolume === volume}
                                    onChange={handleVolumeChange}
                                    disabled={isVolumeDisabled(volume)}
                                />
                                {volume}
                            </label>
                        ))}
                    </p>
                    <p className="product_diamond_detail"><strong>Sold:</strong> 120</p>

                    <div className="price_size_container">
                        <p className="product_price_detail">${product.price + volumePrice}</p>
                        {/* <div className="size_guide_container">
                            <button onClick={openSizeGuide} className="size_guide_detail">Size guide</button>
                            <select className="ring_size_detail" value={selectedSize} onChange={handleSizeChange}>
                                <option value="">Size</option>
                                {availableSizes.map((size, index) => (
                                    <option key={index} value={size} disabled={isSizeDisabled(size)}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>
                    <div className="product_actions_detail">
                        <button
                            className="add_to_cart_btn"
                            onClick={handleAddToCart}
                            disabled={maxProductAvailable === 0}
                            style={{
                                backgroundColor: maxProductAvailable === 0 ? "#797979" : "#1c1c1c",
                                color: "white"
                            }}
                        >
                            <i className="fas fa-shopping-cart" style={{ color: "white" }}></i> {maxProductAvailable === 0 ? "Sold out" : "Add to cart"}
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
                        <p className="product_specification_trademark"><strong>Type:</strong> Face Medical & Treatment</p>
                        <p className="product_specification_trademark"><strong>Brand:</strong> Vaseline</p>
                        <p className="product_specification_cut"><strong>Sex:</strong> Unisex</p>
                        <p className="product_specification_diamond_amount"><strong>Skin Type:</strong> Oily, dry</p>
                        <p className="product_specification_cut"><strong>Skin Color:</strong> All skin</p>
                        <p className="product_specification_carat"><strong>Volume:</strong> 7.5ml (mini size), 40ml (full size)</p>
                        <p className="product_specification_clarity"><strong>Purpose:</strong> Helps control acne-causing bacteria, balances skin microflora, thereby effectively reducing acne after 8 hours and helps control sebum, remove dead cells and excess oil deep below pores, non-greasy, fast absorbing</p>
                        <p className="product_specification_clarity"><strong>Instruction:</strong> Can be used both morning and night, suitable as a makeup primer</p>
                        <p className="product_specification_clarity"><strong>Preserve:</strong> Store in a dry place, away from high temperatures and direct sunlight and keep out of reach of children</p>
                        <p className="product_specification_color"><strong>Key Ingredients:</strong> Hyaluronic Acid, Vitamin C</p>
                        <p className="product_specification_collection"><strong>Detail Infredients:</strong> Aqua/Water/Eau, Glycerin, Dimethicone, Isocetyl Stearate, Niacinamide, Isopropyl Lauroyl Sarcosinate, Silica, Ammonium Polyacryloyldimethyl Taurate, Oryza Sativa Starch/Rice Starch, Punica Granatum Pericarp Extract, Potassium Cetyl Phosphate, Sorbitan Oleate, Zinc Pca, Glyceryl Stearate Se, Isohexadecane, Sodium Hydroxide, Myristyl Myristate, 2-Oleamido-1,3-Octadecanediol, Mannose, Poloxamer 338, Propanediol, Hydroxyethoxyphenyl Butanone, Capryloyl Salicylic Acid, Caprylyl Glycol, Vitreoscilla Ferment, Citric Acid, Trisodium Ethylenediamine Disuccinate, Maltodextrin, Xanthan Gum, Pentylene Glycol, Polysorbate 80, Acrylamide / Sodium Acryloyldimethyltaurate Copolymer, Salicylic Acid, Piroctone Olamine, Parfum/Fragrance</p>
                    </>
                )}
            </div>

            {/* {showSizeGuide && (
                <div className="size_guide_popup">
                    <div className="size_guide_content">
                        <img src={sizeGuideImage} alt="Size Guide" />
                        <button onClick={closeSizeGuide} className="close_size_guide">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )} */}

            {/* <div className="also_like_container">
                <h2 className="also_like_title">You May Also Like</h2>
                <div className="also_like_wrapper">
                    {alsoLikeProducts.map((product, index) => (
                        <div
                            key={index}
                            className="also_like_card"
                            onClick={() => navigateToProductDetail(product)}
                        >
                            <img
                                src={product.imageLinkList}
                                alt={product.name}
                                className="also_like_image"
                            />
                            <div className="also_product_view_icon_wrapper" data-tooltip="View detail">
                                <i className="far fa-eye also_product_view_icon"></i>
                            </div>
                            <p className="also_like_detail">Skincare</p>
                            <p className="also_like_name">{product.name}</p>
                            <p className="also_like_price">${product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="just_for_you_container">
                <div className="just_for_you_text">
                    <h3><strong>Crafted for Your Skin</strong></h3>
                    <p>
                        At Alurà, every product is carefully formulated to nurture your skin using clean, effective, and sustainable ingredients.
                    </p>
                </div>
                <div className="just_for_you_features">
                    <div className="feature">
                        <i className="fas fa-recycle"></i>
                        <p><strong>Eco-Friendly Packaging</strong><br />We use 100% recyclable materials</p>
                    </div>
                    <hr className="jfy_line1" />
                    <div className="feature with-lines">
                        <i className="fas fa-gift"></i>
                        <p><strong>Gentle & Clean Formulas</strong><br />Free from parabens and sulfates</p>
                    </div>
                    <hr className="jfy_line2" />
                    <div className="feature">
                        <i className="fas fa-leaf"></i>
                        <p><strong>Plant-Based Ingredients</strong><br />Derived from natural sources</p>
                    </div>
                </div>
            </div> */}

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

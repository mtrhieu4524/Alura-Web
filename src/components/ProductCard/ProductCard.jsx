import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({
  id,
  image,
  name,
  price,
  type,
  skinType,
  volume,
  sex,
  stock,
}) => {
  const navigate = useNavigate();

  const capitalize = (str) =>
    typeof str === "string" && str.length > 0
      ? str.charAt(0).toUpperCase() + str.slice(1)
      : "";

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/products/${id}`, { state: { id } });
  };

  let stockLabel = "";
  if (stock === 0) {
    stockLabel = "Sold Out";
  } else if (stock > 0 && stock < 10) {
    stockLabel = `Only ${stock} left`;
  }

  const displaySkinType = Array.isArray(skinType)
    ? skinType.map(capitalize).join(", ")
    : capitalize(skinType);

  return (
    <div className="product_card" onClick={handleViewClick}>
      <div className="image_wrapper">
        <img src={image} alt={name} />
        {stockLabel && (
          <span
            className={`stock_status ${stock === 0 ? "sold_out" : "low_stock"
              }`}
          >
            {stockLabel}
          </span>
        )}
      </div>

      <div className="product_view_icon_wrapper" data-tooltip="View detail">
        <i className="far fa-eye product_view_icon"></i>
      </div>
      <p className="product_card_detail">
        {capitalize(sex)} | {displaySkinType} | {type}
      </p>
      <h6 className="product_card_name">{name}</h6>
      <p className="product_card_price">{price.toLocaleString()} VND</p>
    </div>
  );
};

const SpecialCard = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/cosmetics", { state: { category: "all" } });
  };

  return (
    <div className="special_card">
      <h5>Don't see what you are looking for?</h5>
      <hr className="special_line" />
      <p>Browse our catalog for more cosmetics, medicals and treatments</p>
      <button className="all_shop_now_btn" onClick={handleShopNowClick}>
        Shop now
      </button>
    </div>
  );
};

const ProductList = ({ products, resetKey }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const location = useLocation();
  const isCosmeticsPage = location.pathname === "/search";

  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="product_list col-lg-12">
      <div className="product_grid">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            image={product.imgUrls?.[0] || ""}
            name={product.name}
            price={product.price}
            type={product.productTypeId?.name || ""}
            volume={product.volume}
            sex={product.sex}
            stock={product.stock || 0}
            skinType={product.skinType || "Normal"}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination_container">
          <button
            className="pagination_button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination_button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination_button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      {displayedProducts.length === 0 && (
        <p className="no_products">No products found.</p>
      )}

      {displayedProducts.length > 0 && isCosmeticsPage && <SpecialCard />}
    </div>
  );
};

export default ProductList;

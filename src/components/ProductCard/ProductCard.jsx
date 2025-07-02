import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ id, image, name, price, type, shade, volume, sex }) => {
  const navigate = useNavigate();

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/cosmetics/${id}`, { state: { id } });
  };

  return (
    <div className="product_card" onClick={handleViewClick}>
      <img src={image} alt={name} />
      <div className="product_view_icon_wrapper" data-tooltip="View detail">
        <i className="far fa-eye product_view_icon"></i>
      </div>
      <p className="product_card_detail">
        {type} | {shade} | {volume} | {sex}
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
      <p>Browse our full catalog for more cosmetics, medicals and treatments</p>
      <button className="all_shop_now_btn" onClick={handleShopNowClick}>
        Shop now
      </button>
    </div>
  );
};

const ProductList = ({ products, resetKey }) => {
  const [visibleProducts, setVisibleProducts] = useState(12);

  useEffect(() => {
    setVisibleProducts(12);
  }, [resetKey]);

  const handleSeeMore = () => {
    setVisibleProducts(visibleProducts + 12);
  };

  const displayedProducts = products.slice(0, visibleProducts);

  return (
    <div className="product_list col-lg-12">
      {displayedProducts.map((product, index) => (
        <ProductCard
          key={product._id}
          id={product._id}
          image={product.imgUrls?.[0] || ""}
          name={product.name}
          price={product.price}
          type={product.tags?.[0] || ""}
          shade=""
          volume={product.volume}
          sex={product.sex}
        />
      ))}
      {visibleProducts < products.length ? (
        <div className="product_see_more_container">
          <button className="product_see_more_button" onClick={handleSeeMore}>
            View More
          </button>
        </div>
      ) : (
        <SpecialCard />
      )}
    </div>
  );
};

export default ProductList;

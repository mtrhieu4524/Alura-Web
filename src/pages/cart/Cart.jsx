import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Image } from "antd";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/cart/Cart.css";
// import { useCart } from "../../services/CartService";
// import {
//     getShellByProductId,
//     checkProductStock,
//     getProductDetail,
//     getDiamondDetail,
// } from "../../services/ProductService";
import Insta from "../../components/Insta/Instagram";

function Cart() {
  const navigate = useNavigate();
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "" },
  ];

  useEffect(() => {
    document.title = "Alurà - Cart";
  }, []);

  // const customerId = localStorage.getItem("customerId");
  // const { cartItems, removeFromCart } = useCart();
  // const [shellData, setShellData] = useState({});
  // const [diamondAttributes, setDiamondAttributes] = useState({});
  const [filteredCartItems, setFilteredCartItems] = useState([
    {
      productId: "P001",
      name: "Elegant Perfume",
      image:
        "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
      price: 40.0,
      quantity: 2,
      isOutOfStock: false,
      type: "Serum",
      skinType: "Oily",
      volume: "7.5 ml",
    },
    {
      productId: "P002",
      name: "Vaseline",
      image:
        "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
      price: 55.0,
      quantity: 1,
      isOutOfStock: false,
      type: "Cream",
      skinType: "Dry",
      volume: "7.5 ml",
    },
  ]);

  const handleQuantityChange = (changedItem, newQuantity) => {
    setFilteredCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === changedItem.productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleViewProduct = (item) => {
    const encodedName = encodeURIComponent(
      item.name.toLowerCase().replace(/\s+/g, "-")
    );
    navigate(`/product-detail/${encodedName}`);
  };

  const handleCheckoutPage = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/cosmetic");
  };

  return (
    <div className="cart">
      <Breadcrumb items={navItems} />

      <div className="cart_main_container">
        <div className="cart_header">
          <div className="cart_title">
            <i className="fas fa-shopping-cart"></i> Cart (2)
          </div>
          <div className="continue_shopping" onClick={handleContinueShopping}>
            &lt; Continue Shopping
          </div>
        </div>

        <div className="cart_container">
          {filteredCartItems.length === 0 ? (
            <div className="cart_empty_message">
              <p>Nothing here... Let's add something to the cart!</p>
            </div>
          ) : (
            <div className="cart_items">
              <Image.PreviewGroup>
                {filteredCartItems.map((item) => {
                  const firstImage = item.image.split(";")[0];
                  const isOutOfStock = item.isOutOfStock;
                  const key = `${item.productId}-${item.name}-${item.image}-${item.price}-${item.selectedShellId}-${item.selectedShellName}-${item.selectedSize}`;
                  return (
                    <div
                      className={`cart_item ${
                        isOutOfStock ? "out-of-stock" : ""
                      }`}
                      key={key}>
                      <Image
                        src={firstImage}
                        className="cart_item_image"
                        alt={item.name}
                        width={175}
                      />
                      <div className="cart_item_details">
                        <div className="cart_item_header">
                          <h5
                            className={`cart_item_name ${
                              isOutOfStock ? "text-grey" : ""
                            }`}>
                            {item.name}
                            {isOutOfStock && (
                              <span className="out-of-stock-text"></span>
                            )}
                          </h5>
                          <div className="cart_item_links">
                            <span
                              onClick={() => handleViewProduct(item)}
                              className="cart_item_view">
                              VIEW
                            </span>
                            <span> | </span>
                            <a
                              className="cart_item_remove"
                              onClick={() => handleRemoveFromCart(key)}>
                              REMOVE
                            </a>
                          </div>
                        </div>

                        <p
                          className={`cart_item_description ${
                            isOutOfStock ? "text-grey" : ""
                          }`}>
                          Type: {item.type} for {item.skinType} skin
                        </p>
                        <p
                          className={`cart_item_description ${
                            isOutOfStock ? "text-grey" : ""
                          }`}>
                          Volume: {item.volume}
                        </p>

                        <div className="cart_item_footer">
                          <div className="quantity_selector_container">
                            <label
                              htmlFor="quantity"
                              className="quantity_label">
                              Quantity:
                            </label>

                            <div className="quantity_controls">
                              <button
                                className="quantity_btn"
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    Math.max(item.quantity - 1, 1)
                                  )
                                }
                                disabled={item.quantity <= 1 || isOutOfStock}>
                                -
                              </button>
                              <input
                                type="number"
                                className="quantity_input"
                                value={item.quantity}
                                min="1"
                                max={item.stock || 10}
                                onChange={(e) => {
                                  const value = Math.max(
                                    1,
                                    Math.min(
                                      item.stock || 10,
                                      parseInt(e.target.value) || 1
                                    )
                                  );
                                  handleQuantityChange(item, value);
                                }}
                                disabled={isOutOfStock}
                              />
                              <button
                                className="quantity_btn"
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    Math.min(
                                      item.quantity + 1,
                                      item.stock || 10
                                    )
                                  )
                                }
                                disabled={
                                  item.quantity >= (item.stock || 10) ||
                                  isOutOfStock
                                }>
                                +
                              </button>
                            </div>
                          </div>

                          <div
                            className={`cart_item_price ${
                              isOutOfStock ? "text-grey-price" : ""
                            }`}>
                            ${Math.floor(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Image.PreviewGroup>
            </div>
          )}

          <div className="cart_summary">
            <h5 className="cart_summary_title">
              <i className="fas fa-receipt"></i> Summary
            </h5>
            <div className="cart_summary_details">
              <p className="cart_summary_subtotal">
                <span>Subtotal:</span>
                <span>
                  <strong>$1000</strong>
                </span>
              </p>
              <p className="cart_summary_total">
                <span>Total:</span>
                <span>
                  <strong>$1000</strong>
                </span>
              </p>
            </div>
            <hr />
            <button
              onClick={handleCheckoutPage}
              className="cart_summary_checkout">
              Proceed to checkout
            </button>
            <div className="cart_summary_service">
              <p className="24/7_service">
                <strong>24/7 Customer Service</strong>
              </p>
              <a href="tel:0795795959">
                <p className="phone_service">
                  <i className="fas fa-phone"></i> 0795 795 959
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Insta />
    </div>
  );
}

export default Cart;

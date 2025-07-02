import { Image } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import vnpay from "../../assets/vnpay.webp";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Insta from "../../components/Insta/Instagram";
import "../../styles/cart/Checkout.css";
import { toast } from "sonner";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cartItems = state?.cartItems || [];
  const totalAmount = state?.totalAmount || 0;
  const userId = localStorage.getItem("user");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "/cart" },
    { name: "Checkout", link: "" },
  ];

  useEffect(() => {
    document.title = "Alurà - Checkout";
  }, []);

  useEffect(() => {
    const fetchUserInformation = async () => {
      const token = localStorage.getItem("token");
      if (!token || !userId) {
        toast.error("You must be logged in to checkout.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          toast.error("Failed to load user information.");
          setLoading(false);
          return;
        }
        const data = await response.json();
        const user = data.user || {};
        setFullName(user.name || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");
      } catch (error) {
        console.error("Error fetching user information:", error);
        toast.error("An error occurred while loading user information.");
      }
      setLoading(false);
    };

    fetchUserInformation();
  }, [userId]);

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handleInvoice = () => {
    // Validate fields here if needed
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    navigate("/invoice");
  };

  return (
    <div className="Checkout">
      <Breadcrumb items={navItems} />

      <div className="checkout_header">
        <div className="checkout_title">
          <i className="fas fa-shopping-cart"></i> Checkout ({cartItems.length})
        </div>
        <div className="checkout_continue_shopping" onClick={handleBackToCart}>
          &lt; Back To Cart
        </div>
      </div>

      <div className="checkout_container">
        <div className="checkout_items">
          <form className="checkout_form" onSubmit={(e) => e.preventDefault()}>
            <div className="form_group_name_phone">
              <label htmlFor="fullName">Full name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form_group_name_phone">
              <label htmlFor="phone">Phone number *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="form_group_address_note">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
            </div>
            <div className="form_group_address_note">
              <label htmlFor="note">Note (optional)</label>
              <textarea
                id="note"
                name="note"
                placeholder="Enter note for shop"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </form>

          <div className="checkout_cart_items_container">
            <Image.PreviewGroup>
              {cartItems.map((item, index) => {
                const product = item.productId;
                const quantity = item.quantity;
                const price = item.unitPrice;
                return (
                  <React.Fragment key={index}>
                    <div className="checkout_cart_item">
                      <Image
                        src={product.imgUrls?.[0] || product.image}
                        alt={product.name}
                        className="checkout_item_image"
                        width={130}
                        height={130}
                      />
                      <div className="checkout_item_details">
                        <div className="checkout_item_row">
                          <p className="checkout_item_name">
                            <strong>
                              {product.name} x{quantity}
                            </strong>
                          </p>
                          <p className="checkout_item_price">
                            <strong>
                              {(Math.round(price) * quantity).toLocaleString()}{" "}
                              VND
                            </strong>
                          </p>
                        </div>
                        <div className="checkout_item_row">
                          <p>
                            <strong>Type: </strong>
                            {Array.isArray(product.skinType)
                              ? product.skinType.join(", ")
                              : product.skinType || ""}
                          </p>
                          <p>
                            <strong>Volume:</strong> {product.volume}
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <hr />}
                  </React.Fragment>
                );
              })}
            </Image.PreviewGroup>
          </div>
        </div>

        <div className="checkout_summary">
          <h5 className="checkout_summary_payment_title">
            <i className="fas fa-credit-card"></i>Payment method
          </h5>
          <div className="payment_methods">
            <div className="payment_method">
              <input type="radio" id="vnpay" name="paymentMethod" />
              <div className="payment_vnpay_wrapper">
                <p className="payment_label" htmlFor="vnpay">
                  VNPAY
                </p>
                <img
                  src={vnpay}
                  style={{
                    width: "30px",
                    marginTop: "-34px",
                    marginBottom: "10px",
                    marginLeft: "-17px",
                  }}
                  alt="VNPAY"
                />
              </div>
            </div>
          </div>

          <h5 className="checkout_summary_title">
            <i className="fas fa-receipt"></i>Total price
          </h5>
          <div className="checkout_summary_details">
            <hr />
            <p className="checkout_summary_total">
              <span>
                <strong>Total:</strong>
              </span>
              <span>
                <strong>{totalAmount.toLocaleString()} VND</strong>
              </span>
            </p>
          </div>
          <button
            onClick={handleInvoice}
            className="checkout_summary_checkout"
            disabled={loading}>
            {loading && (
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: "5px" }}></i>
            )}
            Confirm order
          </button>

          <div className="checkout_summary_service">
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
      <br />
      <br />
      <Insta />
    </div>
  );
}

export default Checkout;

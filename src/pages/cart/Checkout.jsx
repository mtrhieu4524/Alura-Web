import { Image } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import vnpay from "../../assets/vnpay.webp";
import cash from "../../assets/cashLogo.png";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Insta from "../../components/Insta/Instagram";
import "../../styles/cart/Checkout.css";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cartItems = state?.cartItems || [];
  const [searchParams] = useSearchParams();
  const userId = localStorage.getItem("user");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("STANDARD");
  const [previewDetails, setPreviewDetails] = useState({
    subTotal: 0,
    shippingFee: 0,
    total: 0,
    items: [],
  });
  const { token } = useSelector((state) => state.auth);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Cart", link: "/cart" },
    { name: "Checkout", link: "" },
  ];

  const fetchCartPreview = async (selectedShippingMethod) => {
    if (!token || cartItems.length === 0) return;

    try {
      const selectedCartItemIds = cartItems.map((item) => item._id || item.id);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedCartItemIds,
            promotionId: null,
            shippingMethod: selectedShippingMethod,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        console.error("Failed to fetch cart preview:", errData?.message);
        return;
      }

      const data = await response.json();
      setPreviewDetails({
        subTotal: data.subTotal || 0,
        shippingFee: data.shippingFee || 0,
        total: data.total || 0,
        items: data.items || [],
      });
    } catch (error) {
      console.error("Error fetching cart preview:", error);
    }
  };

  const createQueryString = (searchParams) => {
    const params = new URLSearchParams();
    for (let [key, value] of searchParams) {
      params.append(key, value);
    }
    return params.toString();
  };

  const handleVNPayReturn = async (vnpayData) => {
    const {
      vnpResponseCode,
      vnpTransactionStatus,
      vnpOrderInfo,
      vnpAmount,
      vnpTxnRef,
    } = vnpayData;

    try {
      const queryString = createQueryString(searchParams);

      const api = `${import.meta.env.VITE_API_URL
        }/payment/vnpay/return?${queryString}`;
      console.log("API URL:", api);

      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to verify payment");
      }

      const result = await response.json();

      if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
        toast.success("Payment successful!");

        navigate("/order-success", {
          state: {
            orderId: vnpTxnRef,
            amount: vnpAmount,
            orderInfo: vnpOrderInfo,
            paymentMethod: "VNPAY",
            paymentStatus: "Success",
            result: result,
          },
        });
      } else {
        let errorMessage = "Payment failed!";

        switch (vnpResponseCode) {
          case "24":
            errorMessage = "Transaction was cancelled by user";
            break;
          case "09":
            errorMessage =
              "Card/Account is not registered for InternetBanking service";
            break;
          case "10":
            errorMessage =
              "Card/Account authentication failed more than 3 times";
            break;
          case "11":
            errorMessage = "Payment timeout. Please try again";
            break;
          case "12":
            errorMessage = "Card/Account is locked";
            break;
          case "13":
            errorMessage = "Invalid OTP";
            break;
          case "51":
            errorMessage = "Account balance is not enough";
            break;
          case "65":
            errorMessage = "Account has exceeded daily transaction limit";
            break;
          default:
            errorMessage = `Payment failed with code: ${vnpResponseCode}`;
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error handling VNPAY return:", error);
      toast.error("An error occurred while processing payment kakak");
    }
  };

  useEffect(() => {
    if (cartItems.length === 0 || !cartItems) {
      navigate("/cart");
      return;
    }

    document.title = "Alurà - Checkout";

    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
    const vnpAmount = searchParams.get("vnp_Amount");
    const vnpTxnRef = searchParams.get("vnp_TxnRef");

    if (vnpResponseCode && vnpTransactionStatus) {
      handleVNPayReturn({
        vnpResponseCode,
        vnpTransactionStatus,
        vnpOrderInfo,
        vnpAmount,
        vnpTxnRef,
      });
    }
  }, [searchParams, token]);

  useEffect(() => {
    const fetchUserInformation = async () => {
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
  }, [userId, token, cartItems]);

  useEffect(() => {
    if (token) {
      fetchCartPreview(shippingMethod);
    }
  }, [shippingMethod, token, cartItems]);

  const handleShippingMethodChange = (newShippingMethod) => {
    setShippingMethod(newShippingMethod);
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    if (!shippingMethod) {
      toast.error("Please select a shipping method.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "VNPAY") {
        const prepareOrderData = {
          shippingAddress: address,
          shippingMethod: shippingMethod,
          promotionId: null,
          note: note || "after 5 PM",
          selectedCartItemIds: cartItems.map((item) => item._id || item.id),
        };

        const prepareResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/order/prepare-vnpay`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(prepareOrderData),
          }
        );

        if (!prepareResponse.ok) {
          const errorData = await prepareResponse.json();
          throw new Error(
            errorData.message || "Failed to prepare order for VNPay"
          );
        }

        const prepareResult = await prepareResponse.json();

        const createPaymentData = {
          orderId: prepareResult.orderId,
          amount: prepareResult.amount,
          bankCode: prepareResult.bankCode,
        };

        const paymentResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/vnpay/createPaymentUrl`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(createPaymentData),
          }
        );

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.message || "Failed to create payment URL");
        }

        const paymentResult = await paymentResponse.json();

        toast.success("Order prepared successfully! Redirecting to VNPay...");

        if (paymentResult.paymentUrl) {
          window.location.href = paymentResult.paymentUrl;
        } else {
          throw new Error("Payment URL not received");
        }
      } else {
        const orderData = {
          shippingAddress: address,
          shippingMethod: shippingMethod,
          productId: userId,
          note: note || "after 5 PM",
          paymentMethod: paymentMethod,
          selectedCartItemIds: cartItems.map((item) => item._id || item.id),
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/order/place`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to place order");
        }

        const result = await response.json();

        toast.success("Order placed successfully!");

        navigate("/", {
          state: {
            orderId: result.orderId,
            message: result.message,
          },
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.message || "An error occurred while placing your order."
      );
    } finally {
      setLoading(false);
    }
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
                            {product.type}
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
            <div
              className="shipping_method"
              onClick={() => setPaymentMethod("VNPAY")}>
              <input
                type="radio"
                id="vnpay"
                name="paymentMethod"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="shipping_method_wrapper">
                <label className="shipping_label" htmlFor="vnpay">
                  VNPAY
                </label>
                <p className="shipping_description">(Transfer before receiving)</p>
                <img
                  src={vnpay}
                  style={{
                    width: "30px",
                    marginTop: "-43px",
                    marginBottom: "23px",
                    marginLeft: "55px",
                  }}
                  alt="VNPAY"
                />
              </div>
            </div>
            <div
              className="shipping_method"
              onClick={() => setPaymentMethod("COD")}>
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="shipping_method_wrapper">
                <label className="shipping_label" htmlFor="cod">
                  COD
                </label>
                <p className="shipping_description">(Transfer after receiving)</p>
                <img
                  src={cash}
                  style={{
                    width: "30px",
                    marginTop: "-40px",
                    marginBottom: "20px",
                    marginLeft: "55px",
                  }}
                  alt="COD"
                />
              </div>
            </div>
          </div>

          <h5 className="checkout_summary_shipping_title">
            <i className="fas fa-shipping-fast"></i>Shipping method
          </h5>
          <div className="shipping_methods">
            <div
              className="shipping_method"
              onClick={() => handleShippingMethodChange("STANDARD")}>
              <input
                type="radio"
                id="standard"
                name="shippingMethod"
                value="STANDARD"
                checked={shippingMethod === "STANDARD"}
                onChange={(e) => handleShippingMethodChange(e.target.value)}
              />
              <div className="shipping_method_wrapper">
                <label className="shipping_label" htmlFor="standard">
                  Standard Shipping
                </label>
                <p className="shipping_description">(3-5 days)</p>
              </div>
            </div>
            <div
              className="shipping_method"
              onClick={() => handleShippingMethodChange("EXPRESS")}>
              <input
                type="radio"
                id="express"
                name="shippingMethod"
                value="EXPRESS"
                checked={shippingMethod === "EXPRESS"}
                onChange={(e) => handleShippingMethodChange(e.target.value)}
              />
              <div className="shipping_method_wrapper">
                <label className="shipping_label" htmlFor="express">
                  Express Shipping
                </label>
                <p className="shipping_description">(1-2 days)</p>
              </div>
            </div>
          </div>

          <h5 className="checkout_summary_title">
            <i className="fas fa-receipt"></i>Total price
          </h5>
          <div className="checkout_summary_details">
            <p className="checkout_summary_subtotal">
              <span>Subtotal:</span>
              <span>
                <strong>{previewDetails.subTotal.toLocaleString()} VND</strong>
              </span>
            </p>
            <p className="checkout_summary_subtotal">
              <span>Shipping Fee:</span>
              <span>
                <strong>
                  {previewDetails.shippingFee.toLocaleString()} VND
                </strong>
              </span>
            </p>
            <hr />
            <p className="checkout_summary_total">
              <span>
                <strong>Total:</strong>
              </span>
              <span>
                <strong>{previewDetails.total.toLocaleString()} VND</strong>
              </span>
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
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

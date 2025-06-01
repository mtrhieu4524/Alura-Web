import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Image } from 'antd';
import vnpay from "../../assets/vnpay.webp";
import Insta from "../../components/Insta/Instagram";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/cart/Checkout.css";


function Checkout() {
    const navItems = [
        { name: "Home", link: "/" },
        { name: "Cart", link: "/cart" },
        { name: "Checkout", link: "" },
    ];

    useEffect(() => {
        document.title = "Alurà - Checkout";
    }, []);

    const cartItems = [
        {
            productId: "P001",
            name: "Elegant Perfume",
            image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
            price: 40.0,
            quantity: 2,
            selectedShellName: null,
            selectedSize: null,
        },
        {
            productId: "P002",
            name: "Vaseline",
            image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
            price: 55.0,
            quantity: 1,
            selectedShellName: null,
            selectedSize: null,
        },
    ];

    const voucherCode = "DISCOUNT10";
    const appliedVoucher = true;
    const paymentMethod = "Bank Transfer";
    const points = 100;
    const usePoints = false;
    const voucherDiscount = 10;
    const pointsDiscount = 5;
    const totalPrice = 120;
    const loading = false;

    const handleApplyVoucher = () => { };
    const handleInvoice = () => { };

    const navigate = useNavigate();
    const handleBackToCart = () => {
        navigate("/cart");
    };

    return (
        <div className="Checkout">
            <Breadcrumb items={navItems} />

            <div className="checkout_header">
                <div className="checkout_title">
                    <i className="fas fa-shopping-cart"></i> Checkout (2)
                </div>
                <div className="checkout_continue_shopping" onClick={handleBackToCart}>
                    &lt; Back To Cart
                </div>
            </div>


            <div className="checkout_container">
                <div className="checkout_items">
                    <form className="checkout_form">
                        <div className="form_group_name_phone">
                            <label htmlFor="fullName">Full name *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="form_group_name_phone">
                            <label htmlFor="phone">Phone number *</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                required
                                placeholder="Enter phone number"
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
                            />
                        </div>
                        <div className="form_group_address_note">
                            <label htmlFor="note">Note (optional)</label>
                            <textarea id="note" name="note" placeholder="Enter note for shop" />
                        </div>
                    </form>

                    <div className="checkout_cart_items_container">
                        <Image.PreviewGroup>
                            {cartItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="checkout_cart_item">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            className="checkout_item_image"
                                            width={130}
                                            height={130}
                                        />
                                        <div className="checkout_item_details">
                                            <div className="checkout_item_row">
                                                <p className="checkout_item_name">
                                                    <strong>
                                                        {item.name} x{item.quantity}
                                                    </strong>
                                                </p>
                                                <p className="checkout_item_price">
                                                    <strong>${Math.round(item.price) * item.quantity}</strong>
                                                </p>
                                            </div>
                                            <div className="checkout_item_row">
                                                <p>
                                                    <strong>Type:</strong> Serum for Oily skin
                                                </p>
                                                <p>
                                                    <strong>Volume:</strong> 7.5 ml
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {index < cartItems.length - 1 && <hr />}
                                </React.Fragment>
                            ))}
                        </Image.PreviewGroup>
                    </div>
                </div>

                <div className="checkout_summary">
                    {/* <h5 className="checkout_summary_voucher_title">
                        <i className="fas fa-ticket"></i>Voucher
                    </h5>
                    <div className="voucher">
                        <input type="text" placeholder="Voucher" value={voucherCode} readOnly />
                        <button disabled>Apply</button>
                    </div> */}

                    <h5 className="checkout_summary_payment_title">
                        <i className="fas fa-credit-card"></i>Payment method
                    </h5>
                    <div className="payment_methods">
                        <div className="payment_method selected">
                            <input type="radio" id="bankTransfer" name="paymentMethod" />
                            <p className="payment_label" htmlFor="bankTransfer">
                                Bank Transfer
                            </p>
                            <p>
                                (Make a transfer to the shop's account number. Order will be processed after
                                successful transfer)
                            </p>
                        </div>
                        <div className="payment_method">
                            <input type="radio" id="vnpay" name="paymentMethod" />
                            <div className="payment_vnpay_wrapper">
                                <p className="payment_label" htmlFor="vnpay">
                                    VNPAY
                                </p>
                                <img
                                    src={vnpay}
                                    style={{ width: "30px", marginTop: "-34px", marginBottom: "10px", marginLeft: "-17px" }}
                                    alt="VNPAY"
                                />
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
                                <strong>${100}</strong>
                            </span>
                        </p>
                        <p className="checkout_summary_discount">
                            <span>Discount:</span>
                            <span>
                                <strong>$0</strong>
                            </span>
                        </p>
                        <hr />
                        <p className="checkout_summary_total">
                            <span>
                                <strong>Total:</strong>
                            </span>
                            <span>
                                <strong>${totalPrice}</strong>
                            </span>
                        </p>
                    </div>
                    <button onClick={handleInvoice} className="checkout_summary_checkout" disabled={loading}>
                        {loading && <i className="fas fa-spinner fa-spin" style={{ marginRight: "5px" }}></i>}
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
            <br></br>
            <br></br>
            <Insta />
        </div>
    );
}

export default Checkout;

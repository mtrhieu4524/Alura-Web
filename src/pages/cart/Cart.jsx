import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Image } from 'antd';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/cart/Cart.css";
import Insta from '../../components/Insta/Instagram';
import { useCart } from "../../context/CartContext";

function Cart() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Cart", link: "" },
    ];

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const { setCartCount } = useCart();

    useEffect(() => {
        document.title = "Alurà - Cart";
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to view your cart.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                toast.error(errData?.message || "Failed to load cart.");
                return;
            }

            const data = await response.json();
            setCartItems(data.items || []);
            setTotalAmount(data.totalAmount || 0);
            setCartCount(data.items?.length || 0);
        } catch (error) {
            toast.error("An error occurred while loading the cart.");
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
        setCartItems(prev => prev.filter(item => item._id !== itemId));
        setCartCount(prev => Math.max(prev - 1, 0));

    };

    const handleViewProduct = (item) => {
        navigate(`/cosmetics/${item.productId._id}`, {
            state: { id: item.productId._id },
        });
    };

    const handleCheckoutPage = () => {
        navigate("/checkout");
    };

    const handleRemoveFromCart = async (itemId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cart/item/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                toast.error(errData?.message || "Failed to remove item.");
                return;
            }

            toast.success("Item removed from cart.");
            setCartItems(prev => prev.filter(item => item._id !== itemId));

            // Optionally re-fetch to update totalAmount accurately
            fetchCartItems();
        } catch (error) {
            toast.error("An error occurred while removing the item.");
        }
    };

    return (
        <div className="cart">
            <Breadcrumb items={navItems} />

            <div className="cart_main_container">
                <div className="cart_header">
                    <div className="cart_title">
                        <i className="fas fa-shopping-cart"></i> Cart ({cartItems.length})
                    </div>
                    <div className="continue_shopping">
                        &lt; Continue Shopping
                    </div>
                </div>

                <div className="cart_container">
                    {cartItems.length === 0 ? (
                        <div className="cart_empty_message">
                            <p>Nothing here... Let's add something to the cart!</p>
                        </div>
                    ) : (
                        <div className="cart_items">
                            <Image.PreviewGroup>
                                {cartItems.map((item) => {
                                    const product = item.productId;
                                    const quantity = item.quantity;
                                    const price = item.unitPrice;
                                    return (
                                        <div className="cart_item" key={item._id}>
                                            <Image
                                                src={product.imgUrl || product.image || "https://via.placeholder.com/175"}
                                                className="cart_item_image"
                                                alt={product.name}
                                                width={200}
                                                height={200}
                                            />
                                            <div className="cart_item_details">
                                                <div className="cart_item_header">
                                                    <h5 className="cart_item_name">{product.name}</h5>
                                                    <div className="cart_item_links">
                                                        <span onClick={() => handleViewProduct(item)} className="cart_item_view">VIEW</span>
                                                        <span> | </span>
                                                        <a className="cart_item_remove" onClick={() => handleRemoveFromCart(item._id)}>REMOVE</a>
                                                    </div>
                                                </div>

                                                <p className="cart_item_description">Price: {price.toLocaleString()} VND</p>

                                                <div className="cart_item_footer">
                                                    <div className="quantity_selector_container">
                                                        <label className="quantity_label">Quantity:</label>
                                                        <div className="quantity_controls">
                                                            <button
                                                                className="quantity_btn"
                                                                onClick={() => handleQuantityChange(item._id, Math.max(quantity - 1, 1))}
                                                                disabled={quantity <= 1}
                                                            >-</button>
                                                            <input
                                                                type="number"
                                                                className="quantity_input"
                                                                value={quantity}
                                                                min="1"
                                                                onChange={(e) => {
                                                                    const value = Math.max(1, parseInt(e.target.value) || 1);
                                                                    handleQuantityChange(item._id, value);
                                                                }}
                                                            />
                                                            <button
                                                                className="quantity_btn"
                                                                onClick={() => handleQuantityChange(item._id, quantity + 1)}
                                                            >+</button>
                                                        </div>
                                                    </div>

                                                    <div className="cart_item_price">
                                                        {(price * quantity).toLocaleString()} VND
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
                                    <strong>{totalAmount.toLocaleString()} VND</strong>
                                </span>
                            </p>
                            <p className="cart_summary_total">
                                <span>Total:</span>
                                <span>
                                    <strong>{totalAmount.toLocaleString()} VND</strong>
                                </span>
                            </p>
                        </div>
                        <hr />
                        <button onClick={handleCheckoutPage} className="cart_summary_checkout">
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

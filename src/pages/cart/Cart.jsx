import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Image } from 'antd';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/cart/Cart.css";
// import { useCart } from "../../services/CartService";
// import {
//     getShellByProductId,
//     checkProductStock,
//     getProductDetail,
//     getDiamondDetail,
// } from "../../services/ProductService";
import Insta from '../../components/Insta/Instagram';

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
    const [filteredCartItems, setFilteredCartItems] = useState([]);

    // useEffect(() => {
    //     const cartKey = `cartItems${customerId}`;
    //     const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    //     const groupedItems = groupCartItems(storedCartItems);
    //     setFilteredCartItems(groupCartItems(storedCartItems));

    //     const fetchData = async () => {
    //         await Promise.all(
    //             storedCartItems.map(async (item) => {
    //                 if (!item.selectedShellName) {
    //                     await fetchDiamondAttributes(item.productId);
    //                 } else {
    //                     try {
    //                         const response = await getShellByProductId(item.productId);
    //                         setShellData((prevShellData) => ({
    //                             ...prevShellData,
    //                             [item.productId]: response.data,
    //                         }));
    //                     } catch (error) {
    //                         console.error("Error fetching shell data:", error);
    //                     }
    //                 }
    //             })
    //         );
    //         await checkStockStatus(storedCartItems);
    //     };

    //     fetchData();
    // }, [customerId, cartItems]);

    // const fetchDiamondAttributes = async (productId) => {
    //     try {
    //         const productResponse = await getProductDetail(productId);
    //         const mainDiamondAttributeId =
    //             productResponse.data.mainDiamondAttributeId;
    //         const diamondResponse = await getDiamondDetail(mainDiamondAttributeId);
    //         const diamondDetails = diamondResponse.data;
    //         setDiamondAttributes((prev) => ({
    //             ...prev,
    //             [productId]: diamondDetails,
    //         }));
    //     } catch (error) {
    //         console.error("Error fetching diamond attributes:", error);
    //     }
    // };

    // const checkStockStatus = async (items) => {
    //     try {
    //         const stockChecks = await Promise.all(
    //             items.map((item) =>
    //                 checkProductStock(item.productId)
    //                     .then((response) => ({
    //                         ...item,
    //                         isOutOfStock: response.data.message === "Not enough stock",
    //                     }))
    //                     .catch((error) => ({
    //                         ...item,
    //                         isOutOfStock: true,
    //                     }))
    //             )
    //         );
    //         setFilteredCartItems(groupCartItems(stockChecks));
    //     } catch (error) {
    //         console.error("Error checking stock status:", error);
    //     }
    // };

    // const groupCartItems = (items) => {
    //     const groupedItems = items.reduce((acc, item) => {
    //         const key = `${item.productId}-${item.name}-${item.image}-${item.price}-${item.selectedShellId}-${item.selectedShellName}-${item.selectedSize}`;
    //         if (!acc[key]) {
    //             acc[key] = { ...item, quantity: 1 };
    //         } else {
    //             acc[key].quantity += 1;
    //         }
    //         return acc;
    //     }, {});

    //     return Object.values(groupedItems);
    // };

    // const handleCheckoutPage = async () => {
    //     const updatedCartItems =
    //         JSON.parse(localStorage.getItem(`cartItems${customerId}`)) || [];

    //     if (updatedCartItems.length === 0) {
    //         toast.warning("Please add something first! There is nothing in the cart.");
    //         return;
    //     }

    //     const missingSizeItems = updatedCartItems.some(
    //         (item) => !item.selectedSize && item.selectedShellName
    //     );
    //     if (missingSizeItems) {
    //         toast.warning("Please select a size for jewelry in your cart.");
    //         return;
    //     }

    //     try {
    //         const stockChecks = await Promise.all(
    //             updatedCartItems.map((item) =>
    //                 checkProductStock(item.productId)
    //                     .then((response) => ({
    //                         ...item,
    //                         isOutOfStock: response.data.message === "Not enough stock",
    //                     }))
    //                     .catch((error) => ({
    //                         ...item,
    //                         isOutOfStock: true,
    //                     }))
    //             )
    //         );

    //         const hasOutOfStockItems = stockChecks.some((item) => item.isOutOfStock);

    //         if (hasOutOfStockItems) {
    //             toast.error(
    //                 "Some products in your cart are currently out of stock. Please remove them to checkout.",
    //                 {
    //                     position: "top-right",
    //                     autoClose: 3000,
    //                 }
    //             );
    //             setFilteredCartItems(groupCartItems(stockChecks));
    //             return;
    //         }

    //         localStorage.setItem("fromCart", "true");
    //         navigate("/checkout", { state: { cartItems: updatedCartItems } });
    //     } catch (error) {
    //         toast.error(
    //             "Some products in your cart are currently out of stock. Please remove them to checkout.",
    //             {
    //                 position: "top-right",
    //                 autoClose: 3000,
    //             }
    //         );
    //         console.error(error);
    //     }
    // };

    // const handleContinueShopping = () => {
    //     navigate("/diamond-jewelry", { state: { category: "all" } });
    // };

    // const handleViewProduct = (product) => {
    //     const productName = product.name.replace(/\s+/g, "-").toLowerCase();
    //     const targetPath = product.selectedShellName
    //         ? `/product-detail/${productName}`
    //         : `/diamond-detail/${productName}`;
    //     navigate(targetPath, { state: { id: product.productId } });
    // };

    // const handleRemoveFromCart = (key) => {
    //     const cartKey = `cartItems${customerId}`;
    //     const updatedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    //     const indexToRemove = updatedCartItems.findIndex((item) => {
    //         const itemKey = `${item.productId}-${item.name}-${item.image}-${item.price}-${item.selectedShellId}-${item.selectedShellName}-${item.selectedSize}`;
    //         return itemKey === key;
    //     });

    //     if (indexToRemove !== -1) {
    //         updatedCartItems.splice(indexToRemove, 1);
    //         localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    //         setFilteredCartItems(groupCartItems(updatedCartItems));
    //         removeFromCart(indexToRemove);
    //     }
    // };

    // const calculateTotalQuantity = () => {
    //     return filteredCartItems.reduce((total, item) => {
    //         return total + item.quantity;
    //     }, 0);
    // };

    // const calculateTotal = () => {
    //     return filteredCartItems.reduce((total, item) => {
    //         return total + parseFloat(item.price) * item.quantity;
    //     }, 0);
    // };

    // const totalQuantity = calculateTotalQuantity();
    // const totalPrice = calculateTotal();

    return (
        <div className="cart">
            <Breadcrumb items={navItems} />

            <div className="cart_main_container">
                <div className="cart_header">
                    <div className="cart_title">
                        {/* <i className="fas fa-shopping-cart"></i> My Cart ({totalQuantity}) */}
                    </div>
                    <div className="continue_shopping" >
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
                                    const diamondAttr = diamondAttributes[item.productId];
                                    const key = `${item.productId}-${item.name}-${item.image}-${item.price}-${item.selectedShellId}-${item.selectedShellName}-${item.selectedSize}`;
                                    return (
                                        <div
                                            className={`cart_item ${isOutOfStock ? "out-of-stock" : ""
                                                }`}
                                            key={key}
                                        >
                                            <Image
                                                src={firstImage}
                                                className="cart_item_image"
                                                alt={item.name}
                                                width={195}
                                            />
                                            <div className="cart_item_details">
                                                <div className="cart_item_header">
                                                    <h5
                                                        className={`cart_item_name ${isOutOfStock ? "text-grey" : ""
                                                            }`}
                                                    >
                                                        {item.name}
                                                        {isOutOfStock && (
                                                            <span className="out-of-stock-text">
                                                                {/*  (Sold out) */}
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <div className="cart_item_links">
                                                        <span
                                                            onClick={() => handleViewProduct(item)}
                                                            className="cart_item_view"
                                                        >
                                                            VIEW
                                                        </span>
                                                        <span> | </span>
                                                        <a
                                                            className="cart_item_remove"
                                                            onClick={() => handleRemoveFromCart(key)}
                                                        >
                                                            REMOVE
                                                        </a>
                                                    </div>
                                                </div>
                                                {diamondAttr && !item.selectedShellName && (
                                                    <p
                                                        className={`cart_item_diamond_attributes ${isOutOfStock ? "text-grey" : "text-diamond-data"
                                                            }`}
                                                    >
                                                        {diamondAttr.cut} Cutㅤ|ㅤ{diamondAttr.color}{" "}
                                                        Colorㅤ|ㅤ{diamondAttr.clarity} Clarity
                                                    </p>
                                                )}
                                                <p
                                                    className={`cart_item_description ${isOutOfStock ? "text-grey" : "text-diamond-only"
                                                        }`}
                                                >
                                                    {item.selectedShellName
                                                        ? `Shell: ${item.selectedShellName}`
                                                        : "(Only diamond)"}
                                                    <br />
                                                    {item.selectedSize && `Size: ${item.selectedSize}`}
                                                </p>
                                                <div className="cart_item_footer">
                                                    <div
                                                        className={`cart_item_quantity ${isOutOfStock ? "text-grey" : ""
                                                            }`}
                                                    >
                                                        Quantity:
                                                        {/* {item.quantity} */}
                                                    </div>
                                                    <div
                                                        className={`cart_item_price ${isOutOfStock ? "text-grey-price" : ""
                                                            }`}
                                                    >
                                                        {/* ${Math.floor(item.price * item.quantity)} */}
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
                                <span>Subtotal</span>
                                <span>
                                    {/* <strong>${totalPrice}</strong> */}
                                </span>
                            </p>
                            <p className="cart_summary_total">
                                <span>Total</span>
                                <span>
                                    {/* <strong>${totalPrice}</strong> */}
                                </span>
                            </p>
                        </div>
                        <hr />
                        <button
                            // onClick={handleCheckoutPage}
                            className="cart_summary_checkout"
                        >
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

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image, Space } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import '../../styles/setting/OrderDetail.css';
// import { getOrderById, getPromotionById, getOrderDetailsByOrderId, getProductById, getShellDetail } from '../../services/TrackingOrderService';
// import { getUserInfo } from '../../services/UserService';

function OrderDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetailContainerRef = useRef(null);
    const { orderNumber } = location.state || { orderNumber: "A1001" }; // fallback for testing
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [points, setPoints] = useState(120);
    const [orderDetails, setOrderDetails] = useState(null);
    const [promotionCode, setPromotionCode] = useState('');
    const [promotionAmount, setPromotionAmount] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // const storedEmail = localStorage.getItem('email');
        // if (storedEmail) {
        //     getUserInfo(storedEmail).then(response => {
        //         const userData = response.data;
        //         setFirstName(userData.firstName);
        //         setLastName(userData.lastName);
        //         setPoints(userData.points);
        //     }).catch(error => {
        //         console.error('Error fetching user data:', error);
        //     });
        // }

        setFirstName("Nguyen");
        setLastName("Tran");

        // if (orderNumber) {
        //     getOrderById(orderNumber).then(async (data) => {
        //         setOrderDetails(data);

        //         if (data.promotionId) {
        //             const promotionData = await getPromotionById(data.promotionId);
        //             setPromotionCode(promotionData.code);
        //             setPromotionAmount(promotionData.amount);
        //         }

        //         const orderDetailData = await getOrderDetailsByOrderId(orderNumber);
        //         const filteredOrderDetails = orderDetailData.filter(item => item.orderId === orderNumber);
        //         const productDetails = await Promise.all(filteredOrderDetails.map(async (item) => {
        //             const productData = await getProductById(item.productId);
        //             let shellMaterial = null;
        //             let size = null;

        //             try {
        //                 const shellDetailData = await getShellDetail(item.shellId);
        //                 shellMaterial = shellDetailData.shellMaterialName;
        //                 size = shellDetailData.size;
        //             } catch (error) {
        //                 console.log('Shell detail not available, this is a single diamond');
        //             }

        //             return {
        //                 ...productData,
        //                 size: size,
        //                 shellMaterial: shellMaterial,
        //                 lineTotal: item.lineTotal,
        //                 isSingleDiamond: !shellMaterial && !size
        //             };
        //         }));
        //         setOrderProducts(productDetails);
        //         setLoading(false);
        //     }).catch(error => {
        //         console.error('Error fetching order details:', error);
        //         setLoading(false);
        //     });
        // }

        const mockOrder = {
            orderId: "A1001",
            date: "2024-11-10",
            name: "Nguyen Tran",
            phoneNumber: "0123456789",
            shippingAddress: "123 Le Loi, District 1, Ho Chi Minh City",
            paymentMethod: "Credit Card",
            note: "Please deliver between 9am and 12pm",
            totalPrice: 135.00,
            orderStatus: "Paid",
            promotionId: "PROMO10"
        };

        const mockProducts = [
            {
                productId: "P001",
                name: "Elegant Perfume",
                imageLinkList: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
                type: "Serum",
                skinType: "Oily",
                volume: "30ml",
                quantity: "2",
                lineTotal: 80.00,
            },
            {
                productId: "P002",
                name: "Vaseline",
                imageLinkList: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
                type: "Cream",
                skinType: "Dry",
                volume: "50ml",
                quantity: "1",
                lineTotal: 55.00,
            }
        ];

        setOrderDetails(mockOrder);
        setPromotionCode("PROMO10");
        setPromotionAmount(0.1);
        setOrderProducts(mockProducts);
        setLoading(false);
    }, [orderNumber]);

    const handleProductView = (product) => {
        const productName = product.name.toLowerCase().replace(/\s+/g, '-');
        const path = product.isSingleDiamond ? `/diamond-detail/${productName}` : `/product-detail/${productName}`;
        navigate(path, { state: { id: product.productId } });
    };

    useEffect(() => {
        if (orderDetailContainerRef.current) {
            window.scrollTo({
                top: orderDetailContainerRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [orderDetails]);

    useEffect(() => {
        document.title = "Alurà - Order Detail";
    }, []);

    const navItems = [
        { name: 'Home', link: '/' },
        { name: 'Order History', link: '/order-history' },
        { name: `Order ${orderNumber}`, link: '' },
    ];
    const menuItems = [
        { name: 'Profile', path: '/profile', icon: 'fas fa-user-edit', iconClass: 'icon-edit-profile' },
        { name: 'Order History', path: '/order-history', icon: 'fas fa-history', iconClass: 'icon-order-history' },
    ];

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className="OrderDetail">
            <Breadcrumb items={navItems} />

            <div className="order_detail_container" ref={orderDetailContainerRef}>
                <div className="order_history_setting_menu">
                    <div className="order_history_setting_menu_section">
                        <div className="order_history_setting_full_name">{`${firstName} ${lastName}`}</div>
                        {/* <div className="order_history_setting_point"><p>{`${points} points`}</p></div> */}
                    </div>
                    <div className="order_history_setting_menu_items">
                        {menuItems.map(item => (
                            <div
                                key={item.path}
                                className={`order_history_setting_menu_item ${item.path === '/order-history' ? 'order-history-item' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <i className={`${item.icon} order_history_setting_menu_icon ${item.iconClass}`}></i>
                                <span className="order_history_setting_menu_item_name">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order_detail_wrapper">
                    <div className="order_detail_border">
                        <div className="order_detail_header">
                            <h4 className="order_detail_number">#{orderNumber}</h4>
                            <span className="order_detail_status">{orderDetails?.orderStatus}</span>
                        </div>
                        <hr className="order_detail_line1"></hr>
                        {orderProducts.map((product, index) => (
                            <div key={index} className="order_detail_product">
                                <Space size={12}>
                                    <Image
                                        width={150}
                                        height={130}
                                        marginRight={10}
                                        style={{ objectFit: 'cover', marginRight: '10px' }}
                                        src={product?.imageLinkList.split(';')[0]}
                                        placeholder={
                                            <Image
                                                preview={false}
                                                src={product?.imageLinkList.split(';')[0]}
                                                width={150}
                                                style={{ objectFit: 'cover', marginRight: '10px' }}
                                            />
                                        }
                                    />
                                </Space>
                                <div className="order_detail_product_info">
                                    <div className="order_detail_product_header">
                                        <h5 className="order_detail_product_name">{product?.name}</h5>
                                        <div className="order_detail_product_links">
                                            <a href="" onClick={() => handleProductView(product)}>VIEW</a>
                                        </div>
                                    </div>
                                    <p className="order_detail_product_size">Type: {product?.type} for {product?.skinType} skin</p>
                                    <p className="order_detail_product_size">Volume: {product?.volume}</p>
                                    <p className="order_detail_product_size">Quantity: {product?.quantity}</p>

                                    <p className="order_detail_product_price">${product?.lineTotal}</p>
                                </div>
                            </div>
                        ))}
                        <hr className="order_detail_line2"></hr>
                        <div className="order_detail_customer_info">
                            <div className="order_detail_customer_item">
                                <i className="fas fa-user"></i>
                                <span>{orderDetails?.name}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-phone"></i>
                                <span>{orderDetails?.phoneNumber}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{orderDetails?.shippingAddress}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-credit-card"></i>
                                <span>{orderDetails?.paymentMethod}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-sticky-note"></i>
                                <span>{orderDetails?.note || 'No additional notes'}</span>
                            </div>
                        </div>
                        <hr className="order_detail_line3"></hr>
                        <div className="order_detail_footer">
                            <p className="order_detail_date">Order date: {formatDate(orderDetails?.date)}</p>
                            <p className="order_detail_total_price">
                                {/* <span className="order_detail_discount">
                                    {promotionCode ? `Promotion: ${promotionCode} (-${promotionAmount * 100}%)` : ''}
                                </span> */}
                                Total price: ${orderDetails?.totalPrice}
                            </p>
                        </div>
                        <div className="order_detail_actions">
                            <button className="order_detail_continue_shopping" onClick={() => navigate('/product')}><i className="fas fa-shopping-cart"></i>Continue shopping</button>

                            <button className="order_detail_contact_us" onClick={() => navigate('/contact')}><i className="fas fa-phone"></i>Contact us</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;

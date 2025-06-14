import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Space } from 'antd';
import '../../styles/staff/OrderDetail.css';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const orderDetailContainerRef = useRef(null);

    const [orderDetails, setOrderDetails] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock API call simulation for order by id
        const mockOrder = {
            orderId: id,
            date: "2024-11-10",
            customerName: "Nguyen Tran",
            phoneNumber: "0123456789",
            shippingAddress: "123 Le Loi, District 1, Ho Chi Minh City",
            paymentMethod: "Credit Card",
            note: "Please deliver between 9am and 12pm",
            totalPrice: 135.00,
            orderStatus: "Paid",
        };

        const mockProducts = [
            {
                productId: "P001",
                name: "Elegant Perfume",
                imageLinkList: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
                type: "Serum",
                skinType: "Oily",
                volume: "30ml",
                quantity: 2,
                lineTotal: 80.00,
            },
            {
                productId: "P002",
                name: "Vaseline",
                imageLinkList: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdx50i6MASgGwbeRVz-tmaMQZpqV9zPCFL0L-maMlKmVJl6S2raO-uAw-zLeBa8Ypg68KAG6WAxEn4j5ZzwFriIpNZy71Gx4fF19eLA4FwAaavudpRkvK_aOBhJ5GyIbOy3BHx3nvuTH0ulERe4IA_JQGr_-1psB6YJJaZisw?key=-i2vSHdebLnLtn9l2EVGfg",
                type: "Cream",
                skinType: "Dry",
                volume: "50ml",
                quantity: 1,
                lineTotal: 55.00,
            }
        ];

        setOrderDetails(mockOrder);
        setOrderProducts(mockProducts);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (orderDetailContainerRef.current) {
            window.scrollTo({
                top: orderDetailContainerRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [orderDetails]);

    useEffect(() => {
        document.title = `Staff - Order Detail #${id}`;
    }, [id]);

    const navItems = [
        { name: 'Dashboard', link: '/staff/dashboard' },
        { name: 'Orders', link: '/staff/orders' },
        { name: `Order ${id}`, link: '' },
    ];

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="staff_order_detail">

            <div className="order_detail_container" ref={orderDetailContainerRef}>
                <div className="order_detail_wrapper">
                    <div className="order_detail_border">
                        <div className="order_detail_header">
                            <h4 className="order_detail_number">#{orderDetails.orderId}</h4>
                            <span className={`order_detail_status status-${orderDetails.orderStatus.toLowerCase()}`}>
                                {orderDetails.orderStatus}
                            </span>
                        </div>
                        <hr className="order_detail_line1" />

                        {orderProducts.map((product, index) => (
                            <div key={index} className="order_detail_product">
                                <Space size={12}>
                                    <Image
                                        width={150}
                                        height={130}
                                        style={{ objectFit: 'cover', marginRight: '10px' }}
                                        src={product.imageLinkList.split(';')[0]}
                                        placeholder={
                                            <Image
                                                preview={false}
                                                src={product.imageLinkList.split(';')[0]}
                                                width={150}
                                                style={{ objectFit: 'cover', marginRight: '10px' }}
                                            />
                                        }
                                    />
                                </Space>
                                <div className="order_detail_product_info">
                                    <div className="order_detail_product_header">
                                        <h5 className="order_detail_product_name">{product.name}</h5>
                                    </div>
                                    <p className="order_detail_product_size">Type: {product.type} for {product.skinType} skin</p>
                                    <p className="order_detail_product_size">Volume: {product.volume}</p>
                                    <p className="order_detail_product_size">Quantity: {product.quantity}</p>

                                    <p className="order_detail_product_price">${product.lineTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}

                        <hr className="order_detail_line2" />

                        <div className="order_detail_customer_info">
                            <div className="order_detail_customer_item">
                                <i className="fas fa-user"></i>
                                <span>{orderDetails.customerName}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-phone"></i>
                                <span>{orderDetails.phoneNumber}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{orderDetails.shippingAddress}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-credit-card"></i>
                                <span>{orderDetails.paymentMethod}</span>
                            </div>
                            <div className="order_detail_customer_item">
                                <i className="fas fa-sticky-note"></i>
                                <span>{orderDetails.note || 'No additional notes'}</span>
                            </div>
                        </div>

                        <hr className="order_detail_line3" />

                        <div className="order_detail_footer">
                            <p className="order_detail_date">Order date: {formatDate(orderDetails.date)}</p>
                            <p className="order_detail_total_price">Total price: ${orderDetails.totalPrice.toFixed(2)}</p>
                        </div>

                        {/* Staff-specific controls could go here, e.g. status update buttons */}
                        {/* <div className="order_detail_actions_staff">
              <button>Mark as Shipped</button>
              <button>Cancel Order</button>
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;

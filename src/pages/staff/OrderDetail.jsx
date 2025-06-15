import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Space } from 'antd';
import '../../styles/staff/OrderDetail.css';
import { Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';
import '../../styles/staff/OrderDetail.css';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const orderDetailContainerRef = useRef(null);

    const [orderDetails, setOrderDetails] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
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
                imageLinkList: "https://example.com/image1.jpg",
                type: "Serum",
                skinType: "Oily",
                volume: "30ml",
                quantity: 2,
                lineTotal: 80.00,
            },
            {
                productId: "P002",
                name: "Vaseline",
                imageLinkList: "https://example.com/image2.jpg",
                type: "Cream",
                skinType: "Dry",
                volume: "50ml",
                quantity: 1,
                lineTotal: 55.00,
            }
        ];

        setOrderDetails(mockOrder);
        setStatus(mockOrder.orderStatus);
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
        document.title = "Order Detail - Alurà System Management";
    }, []);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleStatusUpdate = () => {
        // Simulate update logic
        setOrderDetails((prev) => ({ ...prev, orderStatus: status }));
        alert(`Order status updated to ${status}`);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="staff_order_detail">
            <div className="staff_order_detail_container" ref={orderDetailContainerRef}>
                <div className="staff_order_detail_wrapper">
                    <div className="staff_back" onClick={() => navigate("/staff/order-list")}>
                        &lt; Back to order list
                    </div>

                    <div className="staff_order_detail_border">
                        <div className="staff_order_detail_header">
                            <h4 className="staff_order_detail_number">#{orderDetails.orderId || 'ORDERID'}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FormControl
                                    size="small"
                                    style={{ marginRight: '10px', width: '150px', height: '40px' }}
                                >
                                    <InputLabel id="orderFilterLabel">Status</InputLabel>
                                    <Select
                                        labelId="orderFilterLabel"
                                        id="orderFilter"
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                        sx={{ height: '40px' }}
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                                        <MenuItem value="Paid">Paid</MenuItem>
                                        <MenuItem value="Preparing">Preparing</MenuItem>
                                        <MenuItem value="Delivering">Delivering</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>

                                <button className="staff_update_btn">
                                    Update Status
                                </button>
                            </div>
                        </div>

                        <hr className="staff_order_detail_line1" />

                        {orderProducts.map((product, index) => (
                            <div key={index} className="staff_order_detail_product">
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
                                <div className="staff_order_detail_product_info">
                                    <div className="staff_order_detail_product_header">
                                        <h5 className="staff_order_detail_product_name">{product.name}</h5>
                                    </div>
                                    <p className="staff_order_detail_product_size">Type: {product.type} for {product.skinType} skin</p>
                                    <p className="staff_order_detail_product_size">Volume: {product.volume}</p>
                                    <p className="staff_order_detail_product_size">Quantity: {product.quantity}</p>
                                    <p className="staff_order_detail_product_price">${product.lineTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}

                        <hr className="staff_order_detail_line2" />

                        <div className="staff_order_detail_customer_info">
                            <div className="staff_order_detail_customer_item">
                                <i className="fas fa-user"></i>
                                <span>{orderDetails.customerName}</span>
                            </div>
                            <div className="staff_order_detail_customer_item">
                                <i className="fas fa-phone"></i>
                                <span>{orderDetails.phoneNumber}</span>
                            </div>
                            <div className="staff_order_detail_customer_item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{orderDetails.shippingAddress}</span>
                            </div>
                            <div className="staff_order_detail_customer_item">
                                <i className="fas fa-credit-card"></i>
                                <span>{orderDetails.paymentMethod}</span>
                            </div>
                            <div className="staff_order_detail_customer_item">
                                <i className="fas fa-sticky-note"></i>
                                <span>{orderDetails.note || 'No additional notes'}</span>
                            </div>
                        </div>

                        <hr className="staff_order_detail_line3" />

                        <div className="staff_order_detail_footer">
                            <p className="staff_order_detail_date">Order date: {formatDate(orderDetails.date)}</p>
                            <p className="staff_order_detail_total_price">Total price: ${orderDetails.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting/OrderHistory.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 6;
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !token) {
          console.error("User or token not found in Redux store");
          return;
        }

        const res = await fetch(`${API_URL}/order/by-user/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          const raw = await res.text();
          throw new Error(`Expected JSON but received: ${raw}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected response:", data);
          return;
        }

        const formattedOrders = data.map((order) => ({
          orderId: order._id,
          date: order.orderDate,
          totalPrice: order.totalAmount,
          orderStatus: order.paymentStatus || order.orderStatus || "Unknown",
        }));

        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  useEffect(() => {
    let filtered = [...orders];
    if (filterStatus !== "All") {
      filtered = filtered.filter((order) => order.orderStatus === filterStatus);
    }
    if (sortOrder === "Newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filterStatus, sortOrder, orders]);

  useEffect(() => {
    document.title = "Alurà - Order History";
  }, []);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Order History", link: "" },
  ];
  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: "fas fa-user-edit",
      iconClass: "icon-edit-profile",
    },
    {
      name: "Order History",
      path: "/order-history",
      icon: "fas fa-history",
      iconClass: "icon-order-history",
    },
  ];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleDetailClick = (orderNumber) => {
    navigate(`/order-detail/${orderNumber}`, { state: { orderNumber } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="OrderHistory">
      <Breadcrumb items={navItems} />

      <div className="order_history_container">
        <div className="order_history_setting_menu">
          <div className="order_history_setting_menu_section"></div>
          <div className="order_history_setting_menu_items">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`order_history_setting_menu_item ${item.path === "/order-history" ? "order-history-item" : ""
                  }`}
                onClick={() => navigate(item.path)}>
                <i
                  className={`${item.icon} order_history_setting_menu_icon ${item.iconClass}`}></i>
                <span className="order_history_setting_menu_item_name">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="order_history_table_wrapper">
          <div className="order_filters">
            <FormControl fullWidth size="small">
              <InputLabel id="sortOrderLabel">Sort</InputLabel>
              <Select
                labelId="sortOrderLabel"
                id="sortOrder"
                value={sortOrder}
                label="Sort By"
                onChange={handleSortChange}>
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" style={{ marginRight: "10px" }}>
              <InputLabel id="orderFilterLabel">Status</InputLabel>
              <Select
                labelId="orderFilterLabel"
                id="orderFilter"
                value={filterStatus}
                label="Filter"
                onChange={handleFilterChange}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Preparing">Preparing</MenuItem>
                <MenuItem value="Delivering">Delivering</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 0",
              }}>
              <CircularProgress style={{ color: "#1c1c1c" }} />
            </div>
          ) : (
            <>
              <table className="order_history_table table">
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Order ID</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{formatDate(order.date)}</td>
                      <td>{order.orderId}</td>
                      <td>{order.totalPrice.toLocaleString()} VND</td>
                      <td>{order.orderStatus}</td>
                      <td>
                        <i
                          className="order_history_detail_icon fas fa-external-link-alt"
                          onClick={() => handleDetailClick(order.orderId)}
                          style={{ cursor: "pointer" }}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="order_history_pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}>
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={index + 1 === currentPage ? "order_active" : ""}>
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}>
                  &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;

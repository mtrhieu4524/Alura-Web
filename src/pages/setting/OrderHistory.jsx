import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/setting/OrderHistory.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import { getAllOrders } from '../../services/TrackingOrderService';
// import { getUserInfo } from '../../services/UserService';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function OrderHistory() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [points, setPoints] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 6;

  useEffect(() => {
    // Comment out real API calls
    // const storedEmail = localStorage.getItem('email');
    // const customerId = localStorage.getItem('customerId');

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

    // if (customerId) {
    //     getAllOrders(customerId).then(data => {
    //         setOrders(data);
    //         setFilteredOrders(data);
    //         setLoading(false);
    //     }).catch(error => {
    //         console.error('Error fetching orders:', error);
    //         setLoading(false);
    //     });
    // }

    // Hardcoded sample data
    const mockOrders = [
      {
        orderId: "A1001",
        date: "2024-11-10",
        totalPrice: 59.99,
        orderStatus: "Paid",
      },
      {
        orderId: "A1002",
        date: "2024-11-12",
        totalPrice: 25.0,
        orderStatus: "Preparing",
      },
      {
        orderId: "A1003",
        date: "2024-11-15",
        totalPrice: 89.5,
        orderStatus: "Delivering",
      },
      {
        orderId: "A1004",
        date: "2024-11-20",
        totalPrice: 12.75,
        orderStatus: "Unpaid",
      },
      {
        orderId: "A1005",
        date: "2024-11-25",
        totalPrice: 102.0,
        orderStatus: "Completed",
      },
      {
        orderId: "A1006",
        date: "2024-11-28",
        totalPrice: 44.3,
        orderStatus: "Cancelled",
      },
      {
        orderId: "A1007",
        date: "2024-12-01",
        totalPrice: 150.99,
        orderStatus: "Paid",
      },
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setLoading(false);
  }, []);

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
                className={`order_history_setting_menu_item ${
                  item.path === "/order-history" ? "order-history-item" : ""
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
              </Select>
            </FormControl>
          </div>

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
                  <td>${order.totalPrice}</td>
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
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;

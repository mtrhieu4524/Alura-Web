import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../../styles/admin/dashboard.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [summary, setSummary] = useState({
    customers: 0,
    orders: 0,
    revenue: 0,
    growth: 0,
  });
  const [percentChange, setPercentChange] = useState({
    customers: 0,
    orders: 0,
    revenue: 0,
    growth: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [pieProducts, setPieProducts] = useState(["Lipstick", "Serum", "Sun Cream", "Perfume"]);

  useEffect(() => {
    document.title = "Dashboard - Alurà System Management";
    const now = new Date();
    const recentMonths = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (4 - i));
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    });
    setMonths(recentMonths);
    setCurrentMonth(`${now.getMonth() + 1}/${now.getFullYear()}`);
    fetchDashboardData(now.getMonth() + 1, now.getFullYear());
    fetchTopProducts();
    // fetchPieData();
  }, []);

  const getPreviousMonthYear = (month, year) => {
    if (month === 1) return { prevMonth: 12, prevYear: year - 1 };
    return { prevMonth: month - 1, prevYear: year };
  };

  const fetchDashboardData = async (month, year) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { prevMonth, prevYear } = getPreviousMonthYear(month, year);

    try {
      const resCurrent = await fetch(`${API_URL}/dashboard/summary?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resPrev = await fetch(`${API_URL}/dashboard/summary?month=${prevMonth}&year=${prevYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataCurrent = await resCurrent.json();
      const dataPrev = await resPrev.json();

      setSummary(dataCurrent || { customers: 0, orders: 0, revenue: 0, growth: 0 });
      setPercentChange({
        customers: calcPercent(dataCurrent.customers, dataPrev.customers),
        orders: calcPercent(dataCurrent.orders, dataPrev.orders),
        revenue: calcPercent(dataCurrent.revenue, dataPrev.revenue),
        growth: calcPercent(dataCurrent.growth, dataPrev.growth),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
      setSummary({ customers: 0, orders: 0, revenue: 0, growth: 0 });
      setPercentChange({ customers: 0, orders: 0, revenue: 0, growth: 0 });
    }
  };

  const fetchTopProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/top-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTopProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch top products:", err);
      setTopProducts([]);
    }
  };

  // const fetchPieData = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;
  //   try {
  //     const res = await fetch(`${API_URL}/dashboard/pie-chart`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await res.json();
  //     setPieProducts(data.products || []);
  //   } catch (err) {
  //     console.error("Failed to fetch pie chart data:", err);
  //   }
  // };

  const calcPercent = (current, previous) => {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }
    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  const pieData = {
    labels: pieProducts,
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="Dashboard">
      <div className="dashboard_container">
        <div className="dashboard_header">
          <h2 className="admin_main_title">Dashboard</h2>
          <FormControl size="small" sx={{ minWidth: 130, height: 35 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={currentMonth || ""}
              label="Month"
              onChange={(e) => {
                const [month, year] = e.target.value.split("/");
                setCurrentMonth(e.target.value);
                fetchDashboardData(parseInt(month), parseInt(year));
              }}
              sx={{ height: 35, fontSize: 14, padding: "0 8px" }}>
              {months.map((m, i) => (
                <MenuItem key={i} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="dashboard_cards">
          <div className="dashboard_card">
            <h4>Customers</h4>
            <p className="value">{summary.customers || 0}</p>
            <p className={percentChange.customers >= 0 ? "positive" : "negative"}>
              {percentChange.customers >= 0 ? "▲" : "▼"} {isNaN(percentChange.customers) ? 0 : Math.abs(percentChange.customers)}% Since last month
            </p>
          </div>
          <div className="dashboard_card">
            <h4>Orders</h4>
            <p className="value">{summary.orders || 0}</p>
            <p className={percentChange.orders >= 0 ? "positive" : "negative"}>
              {percentChange.orders >= 0 ? "▲" : "▼"} {isNaN(percentChange.orders) ? 0 : Math.abs(percentChange.orders)}% Since last month
            </p>
          </div>
          <div className="dashboard_card">
            <h4>Earnings</h4>
            <p className="value">{(summary.revenue || 0).toLocaleString()} VND</p>
            <p className={percentChange.revenue >= 0 ? "positive" : "negative"}>
              {percentChange.revenue >= 0 ? "▲" : "▼"} {isNaN(percentChange.revenue) ? 0 : Math.abs(percentChange.revenue)}% Since last month
            </p>
          </div>
          <div className="dashboard_card">
            <h4>Total Account</h4>
            <p className="value">{summary.totalAccounts || 0} Accounts</p>
          </div>
          <div className="dashboard_card">
            <h4>Total Product</h4>
            <p className="value">{summary.totalProducts || 0} Products</p>
          </div>
          <div className="dashboard_card">
            <h4>Total Batch</h4>
            <p className="value">{summary.totalBatches || 0} Batches</p>
          </div>
        </div>

        <div className="dashboard_charts">
          <div className="total_sales_pie">
            <h5>Total Sales (Month)</h5>
            <div className="pie_wrapper">
              <Pie data={pieData} />
            </div>
          </div>
          <div className="revenue_chart">
            <div className="chart_header">
              <h5>Top 5 Selling Products (All Time)</h5>
            </div>
            <table className="selling_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Total</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.price.toLocaleString()} VND</td>
                      <td>{product.sold}</td>
                      <td>{(product.price * product.sold).toLocaleString()} VND</td>
                      <td>
                        <i
                          className="fas fa-info-circle detail_icon"
                          title="View Details"
                          onClick={() => navigate(`/admin/product-list/${product._id}`)}
                          style={{ cursor: "pointer", color: "#2196F3" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;

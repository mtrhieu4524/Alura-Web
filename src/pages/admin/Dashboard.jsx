import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../../styles/admin/dashboard.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    document.title = "Dashboard - Alurà System Management";
    const now = new Date();
    const recentMonths = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (4 - i));
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    });
    setMonths(recentMonths);

    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const current = `${thisMonth}/${thisYear}`;

    setCurrentMonth(current);
    fetchDashboardData(thisMonth, thisYear);
    fetchTopProducts(thisMonth, thisYear);
    fetchPieData(thisMonth, thisYear);
    fetchBarData(thisMonth, thisYear);
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

  const fetchTopProducts = async (month, year) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/top-products?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTopProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch top products:", err);
      setTopProducts([]);
    }
  };

  const fetchPieData = async (month, year) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/products-sold-by-category?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result?.data) {
        setPieChartData(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch pie chart data:", err);
    }
  };

  const fetchBarData = async (month, year) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/products-sold-by-type?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result?.data) {
        setBarChartData(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch bar chart data:", err);
    }
  };

  const calcPercent = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  };

  const pieData = {
    labels: pieChartData.map((d) => d.categoryName),
    datasets: [
      {
        data: pieChartData.map((d) => d.totalQuantitySold),
        backgroundColor: [
          "#93aad8", "#a4d693", "#d3cd92", "#d3b692",
          "#c492d3", "#a292d3", "#92d3b8", "#d39292"
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: barChartData.map((d) => d.productTypeName),
    datasets: [
      {
        label: "Sold",
        data: barChartData.map((d) => d.totalQuantitySold),
        backgroundColor: [
          "#d3b692", "#d39292", "#d3cd92", "#93aad8",
          "#c492d3", "#a292d3", "#92d3b8", "#a4d693"
        ].slice(0, barChartData.length),
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  const handleMonthChange = (e) => {
    const [month, year] = e.target.value.split("/").map(Number);
    setCurrentMonth(e.target.value);
    fetchDashboardData(month, year);
    fetchTopProducts(month, year);
    fetchPieData(month, year);
    fetchBarData(month, year);
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
              onChange={handleMonthChange}
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
            <h4>Revenue</h4>
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
            <h5>Top Selling Categories</h5>
            <div className="pie_wrapper">
              {pieChartData.length > 0 ? (
                <Pie data={pieData} />
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px", fontSize: "14px" }}>
                  No data available
                </div>
              )}
            </div>
          </div>
          <div className="revenue_chart">
            <div className="chart_header">
              <h5>Top Selling Types</h5>
            </div>
            {barChartData.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p style={{ padding: "20px", textAlign: "center" }}>No data available</p>
            )}
          </div>
        </div>

        <div className="dashboard_charts">
          <div className="revenue_chart">
            <div className="chart_header">
              <h5>Top Selling Products</h5>
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
                          style={{ cursor: "pointer" }}
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

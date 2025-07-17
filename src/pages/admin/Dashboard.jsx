import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
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

  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [summary, setSummary] = useState({
    customers: 0,
    orders: 0,
    earnings: 0,
    growth: 0,
  });
  const [percentChange, setPercentChange] = useState({
    customers: 0,
    orders: 0,
    earnings: 0,
    growth: 0,
  });

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

      setSummary(dataCurrent || { customers: 0, orders: 0, earnings: 0, growth: 0 });
      setPercentChange({
        customers: calcPercent(dataCurrent.customers, dataPrev.customers),
        orders: calcPercent(dataCurrent.orders, dataPrev.orders),
        earnings: calcPercent(dataCurrent.earnings, dataPrev.earnings),
        growth: calcPercent(dataCurrent.growth, dataPrev.growth),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
      setSummary({ customers: 0, orders: 0, earnings: 0, growth: 0 });
      setPercentChange({ customers: 0, orders: 0, earnings: 0, growth: 0 });
    }
  };

  const calcPercent = (current, previous) => {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Current Week",
        data: [3000, 4000, 3200, 5100, 4500, 4900, 5300],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Previous Week",
        data: [4000, 3800, 4200, 4600, 5000, 5500, 5700],
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  const pieData = {
    labels: ["Lipstick", "Serum", "Sun Cream", "Perfume"],
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
              {percentChange.customers >= 0 ? "▲" : "▼"} {Math.abs(percentChange.customers)}% Since last month
            </p>
          </div>
          <div className="dashboard_card">
            <h4>Orders</h4>
            <p className="value">{summary.orders || 0}</p>
            <p className={percentChange.orders >= 0 ? "positive" : "negative"}>
              {percentChange.orders >= 0 ? "▲" : "▼"} {Math.abs(percentChange.orders)}% Since last month
            </p>
          </div>
          <div className="dashboard_card">
            <h4>Earnings</h4>
            <p className="value">{(summary.revenue || 0).toLocaleString()} VND</p>
            <p className={percentChange.revenue >= 0 ? "positive" : "negative"}>
              {percentChange.revenue >= 0 ? "▲" : "▼"} {Math.abs(percentChange.revenue)}% Since last month
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
          <div className="revenue_chart">
            <div className="chart_header">
              <h5>Revenue</h5>
              <p>Current Week: <strong>45,320</strong> | Previous Week: <strong>58,610</strong></p>
            </div>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="total_sales_pie">
            <h5>Total Sales</h5>
            <div className="pie_wrapper">
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        <div className="dashboard_table_section">
          <div className="table_header">
            <h5>Top 5 Selling Products</h5>
            {/* <button className="export_btn">Export <i className="fas fa-download"></i></button> */}
          </div>
          <table className="selling_table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Pocket Drone 2.4G</td><td>129.99 VND</td><td>32</td><td>6089.58 VND</td></tr>
              <tr><td>Marco Lightweight Shirt</td><td>55.99 VND</td><td>47</td><td>3689.73 VND</td></tr>
              <tr><td>Lightweight Jacket</td><td>73.99 VND</td><td>53</td><td>1689.57 VND</td></tr>
              <tr><td>DJI Phantom 4 PRO</td><td>499.99 VND</td><td>25</td><td>8489.05 VND</td></tr>
              <tr><td>ST SwellPro Drone</td><td>219.99 VND</td><td>12</td><td>2689.58 VND</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

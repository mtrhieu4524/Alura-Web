import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from '../../../components/Table/Table';
import { Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function OrderList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        document.title = "Manage Order - Alurà System Management";
    }, []);

    const columns = ["Order ID", "User", "Order Date", "Total", "Status", "Detail"];

    const fakeData = [
        { order_id: "ORD001", order_date: "01/06/2025", total: "$120.00", status: "Pending" },
        { order_id: "ORD002", order_date: "02/06/2025", total: "$85.50", status: "Paid" },
        { order_id: "ORD003", order_date: "03/06/2025", total: "$59.99", status: "Delivering" },
        { order_id: "ORD004", order_date: "04/06/2025", total: "$132.00", status: "Success" },
        { order_id: "ORD005", order_date: "05/06/2025", total: "$47.25", status: "Canceled" },
        { order_id: "ORD006", order_date: "06/06/2025", total: "$99.90", status: "Pending" },
        { order_id: "ORD007", order_date: "07/06/2025", total: "$74.20", status: "Delivering" },
        { order_id: "ORD008", order_date: "08/06/2025", total: "$150.00", status: "Success" },
    ];

    const getStatusChip = (status) => {
        const statusMap = {
            Pending: { label: "Pending", color: "warning" },
            Paid: { label: "Paid", color: "info" },
            Delivering: { label: "Delivering", color: "primary" },
            Success: { label: "Success", color: "success" },
            Canceled: { label: "Canceled", color: "error" },
        };
        const { label, color } = statusMap[status] || { label: status, color: "default" };
        return <Chip
            label={label}
            color={color}
            size="small"
            sx={{ fontSize: "11px", height: 18 }}
        />;
    };

    const filteredData = statusFilter === "All"
        ? fakeData
        : fakeData.filter(order => order.status === statusFilter);

    const tableData = filteredData.map(order => ({
        order_id: order.order_id,
        order_date: order.order_date,
        total: order.total,
        status: getStatusChip(order.status),
        detail: (
            <i
                className="fas fa-info-circle detail_icon"
                title="View Details"
                // onClick={() => navigate(`/staff/order-detail/${order.order_id}`)}
                onClick={() => navigate(`/staff/order-detail`)}
            />
        )
    }));

    return (
        <div className="ProductList">
            <div className="product_list_container">
                <div className="product_list_header">
                    <h2 className="admin_main_title">Manage Order</h2>

                    <FormControl size="small" sx={{ minWidth: 130, height: 35 }}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{
                                height: 35,
                                fontSize: 14,
                                padding: '0 8px',
                            }}
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
                </div>

                <Table columns={columns} data={tableData} />
            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h3>Add product modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderList;

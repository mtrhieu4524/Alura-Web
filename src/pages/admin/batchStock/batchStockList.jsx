import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/batchStock/BatchStockList.css';

const API_URL = import.meta.env.VITE_API_URL;

function BatchStockList() {
    const [isLoading, setIsLoading] = useState(false);
    const [batchStocks, setBatchStocks] = useState([]);

    useEffect(() => {
        document.title = "Manage Batch Stock - Alurà System Management";
        fetchBatchStocks();
    }, []);

    const fetchBatchStocks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/batch-stock`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBatchStocks(data);
            }
        } catch (error) {
            console.error("Failed to fetch batch stocks", error);
        }
        setIsLoading(false);
    };
    

    const columns = ["Batch Code", "Product Name", "Warehouse", "Quantity", "Remaining", "Expiry Date", "Exported At"];

    const tableData = batchStocks.map(stock => ({
        "Batch Code": stock.batchId?.batchCode || "-",
        "Product Name": stock.productId?.name || "-",
        "Warehouse": stock.warehouseId?.name || "-",
        "Quantity": stock.quantity,
        "Remaining": stock.remaining,
        "Expiry Date": stock.batchId?.expiryDate ? new Date(stock.batchId.expiryDate).toLocaleDateString() : "-",
        "Exported At": stock.exportedAt ? new Date(stock.exportedAt).toLocaleString() : "-"
    }));

 console.log('Table data:', tableData);

    return (
        <div className="BatchStockList">
            <div className="batch_stock_list_container">
                <div className="batch_stock_list_header">
                    <h2 className="admin_main_title">Manage Batch Stock</h2>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Table columns={columns} data={tableData} />
                )}
            </div>
        </div>
    );
}

export default BatchStockList;

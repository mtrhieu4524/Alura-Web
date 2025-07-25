import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "../../../components/Table/table/Table";
import "../../../styles/admin/batchStock/BatchStockList.css";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function BatchStockList({ searchQuery = "" }) {
  const { token } = useSelector((state) => state.auth);
  const decoded = token ? jwtDecode(token) : {};

  const userId = decoded?.UserId || decoded?.userId || decoded?.id || "";

  const [isLoading, setIsLoading] = useState(false);
  const [batchStocks, setBatchStocks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [batches, setBatches] = useState([]);

  const [formData, setFormData] = useState({
    batchId: "",
    productName: "",
    warehouseName: "",
    quantity: "",
    note: "",
    handledBy: userId || "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, handledBy: userId }));
    }
  }, [userId]);

  useEffect(() => {
    document.title = "Manage Batch Stock - Alurà System Management";
    fetchBatchStocks();
    fetchDropdownData();
  }, [searchQuery]);

  const fetchBatchStocks = async () => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `${API_URL}/batch-stock?search=${encodeURIComponent(searchQuery)}`
        : `${API_URL}/batch-stock`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const filteredData = json.data.filter(
          (stock) => stock.isOrigin === false
        );
        setBatchStocks(filteredData);
      } else {
        setBatchStocks([]);
      }
    } catch (error) {
      console.error("Failed to fetch batch stocks", error);
      toast.error("Failed to load batch stock data.");
    }
    setIsLoading(false);
  };

  const fetchDropdownData = async () => {
    try {
      const batchRes = await fetch(`${API_URL}/batch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const batchJson = await batchRes.json();
      if (batchJson.success && Array.isArray(batchJson.data)) {
        setBatches(batchJson.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data", error);
      toast.error("Failed to load dropdown data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "batchId") {
      const selectedBatch = batches.find((b) => b._id === value);
      if (selectedBatch) {
        setFormData((prev) => ({
          ...prev,
          batchId: selectedBatch._id,
          productName: `${selectedBatch.productId?.name || "N/A"} - ${selectedBatch.quantity}`,
          warehouseName: selectedBatch.warehouseId?.name || "",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateBatchStock = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const selectedBatch = batches.find((b) => b._id === formData.batchId);

      if (!selectedBatch || !selectedBatch.productId || !selectedBatch.warehouseId) {
        toast.error("Selected batch is invalid or missing product/warehouse info.");
        setIsCreating(false);
        return;
      }

      const payload = {
        batchId: formData.batchId,
        productId: selectedBatch.productId._id,
        warehouseId: selectedBatch.warehouseId._id,
        quantity: parseInt(formData.quantity),
        note: formData.note,
        handledBy: userId,
      };

      const res = await fetch(`${API_URL}/batch-stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Add batch stock successfully!");
        fetchBatchStocks();
        setShowCreateModal(false);
        resetForm();
      } else {
        const errorData = await res.json();
        toast.error(`Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to create batch stock", error);
      toast.error("Failed to create batch stock!");
    }
    setIsCreating(false);
  };


  const resetForm = () => {
    setFormData({
      batchId: "",
      productName: "",
      warehouseName: "",
      quantity: "",
      note: "",
      handledBy: userId,
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const columns = [
    { header: "Batch Code", accessor: "batchCode" },
    { header: "Product Name", accessor: "productName" },
    { header: "Warehouse", accessor: "warehouse" },
    { header: "Quantity In Batch", accessor: "quantity" },
    { header: "Quantity In Store ", accessor: "remaining" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Exported At", accessor: "exportedAt" },
    { header: "Note", accessor: "note" },
  ];

  const tableData = batchStocks.map((stock) => ({
    batchCode: stock.batchId?.batchCode || "-",
    productName: stock.productId?.name || "-",
    warehouse: stock.warehouseId?.name || "-",
    quantity: stock.quantity ?? "-",
    remaining: stock.remaining ?? "-",
    expiryDate: stock.batchId?.expiryDate
      ? new Date(stock.batchId.expiryDate).toLocaleDateString("vi-VN")
      : "-",
    exportedAt: stock.exportedAt
      ? new Date(stock.exportedAt).toLocaleDateString("vi-VN")
      : "-",
    note: stock.note || "-",
  }));

  return (
    <div className="BatchStockList">
      <div className="batch_stock_list_container">
        <div className="batch_stock_list_header">
          <h2 className="admin_main_title">Manage Batch Stock</h2>
          <button
            className="add_warehouse_btn"
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}>
            Add New Batch Stock
          </button>
        </div>

        {isLoading ? <p>Loading...</p> : <Table columns={columns} data={tableData} />}

        {showCreateModal && (
          <div className="modal_overlay">
            <div className="modal_content">
              <button className="close_modal_btn" onClick={handleCloseModal}>
                ×
              </button>
              <h5>Add New Batch Stock</h5>
              <form className="product_form" onSubmit={handleCreateBatchStock}>
                <div className="form_group">
                  <label htmlFor="batchId">Batch</label>
                  <select
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    required>
                    <option value="">Choose batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchCode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_group">
                  <label htmlFor="productName">Product (Auto fill)</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    disabled
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="warehouseName">Warehouse (Auto fill)</label>
                  <input
                    type="text"
                    id="warehouseName"
                    name="warehouseName"
                    value={formData.warehouseName}
                    disabled
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="note">Note</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form_group">
                  <label htmlFor="handledBy">Admin ID (Auto fill)</label>
                  <input
                    type="text"
                    id="handledBy"
                    name="handledBy"
                    value={formData.handledBy}
                    disabled
                  />
                </div>

                <div className="form_group">
                  <button
                    type="submit"
                    className="add_account_btn"
                    disabled={isCreating}>
                    {isCreating ? "Đang lưu..." : "Add Batch Stock"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchStockList;

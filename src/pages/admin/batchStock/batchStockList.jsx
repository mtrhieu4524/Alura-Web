import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from '../../../components/Table/table/Table';
import Modal from '../../../components/admin/batchStock/CreateBatchStockModal/CreateModal';
import '../../../styles/admin/batchStock/BatchStockList.css';

const API_URL = import.meta.env.VITE_API_URL;

function BatchStockList() {
  const { token, user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [batchStocks, setBatchStocks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Data for dropdowns
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    batchId: '',
    productId: '',
    warehouseId: '',
    quantity: '',
    note: '',
    handledBy: user || ''  
  });
  


  useEffect(() => {
    document.title = "Manage Batch Stock - Alurà System Management";
    fetchBatchStocks();
    fetchDropdownData();
  }, []);

  const fetchBatchStocks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/batch-stock`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBatchStocks(data);
      }
    } catch (error) {
      console.error("Failed to fetch batch stocks", error);
    }
    setIsLoading(false);
  };

  const fetchDropdownData = async () => {
    try {
      // Fetch batches
      const batchRes = await fetch(`${API_URL}/batch`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const batchData = await batchRes.json();
      if (Array.isArray(batchData)) {
        setBatches(batchData);
      }

      // Fetch products
      const productRes = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productData = await productRes.json();
      if (productData.success && Array.isArray(productData.products)) {
        setProducts(productData.products);
      }

      // Fetch warehouses
      const warehouseRes = await fetch(`${API_URL}/warehouse`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const warehouseData = await warehouseRes.json();
      if (warehouseData.data && Array.isArray(warehouseData.data)) {
        setWarehouses(warehouseData.data);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown data", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateBatchStock = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        handledBy: formData.handledBy || user
      };

      const res = await fetch(`${API_URL}/batch-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newBatchStock = await res.json();
        setBatchStocks(prev => [...prev, newBatchStock]);
        setShowCreateModal(false);
        setFormData({
          batchId: '',
          productId: '',
          warehouseId: '',
          quantity: '',
          note: '',
          handledBy: user || ''
        });
        alert('Xuất hàng thành công!');
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.message || 'Không thể xuất hàng'}`);
      }
    } catch (error) {
      console.error("Failed to create batch stock", error);
      alert('Có lỗi xảy ra khi xuất hàng');
    }
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      batchId: '',
      productId: '',
      warehouseId: '',
      quantity: '',
      note: '',
      handledBy: user?._id || ''
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
    { header: "Quantity", accessor: "quantity" },
    { header: "Remaining in store", accessor: "remaining" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Exported At", accessor: "exportedAt" },
    { header: "Note", accessor: "note" },
  ];

  const tableData = batchStocks.map(stock => ({
    batchCode: stock.batchId?.batchCode || "-",
    productName: stock.productId?.name || "-",
    warehouse: stock.warehouseId?.name || "-",
    quantity: stock.quantity ?? "-",
    remaining: stock.remaining ?? "-",
    expiryDate: stock.batchId?.expiryDate ? 
      new Date(stock.batchId.expiryDate).toLocaleDateString() : "-",
    exportedAt: stock.exportedAt ? 
      new Date(stock.exportedAt).toLocaleString() : "-",
    note: stock.note || "-"
  }));

  return (
    <div className="BatchStockList">
      <div className="batch_stock_list_container">
        <div className="batch_stock_list_header">
          <h2 className="admin_main_title">Manage Batch Stock</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Xuất hàng mới
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table columns={columns} data={tableData} />
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <Modal onClose={handleCloseModal}>
            <div className="modal-content">
              <h3>Xuất hàng lên cửa hàng</h3>
              <form onSubmit={handleCreateBatchStock}>
                <div className="form-group">
                  <label htmlFor="batchId">Batch *</label>
                  <select
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn batch</option>
                    {batches.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchCode} - {batch.productId?.name || 'N/A'} 
                        (Còn: {batch.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="productId">Sản phẩm *</label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.price?.toLocaleString()}₫
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="warehouseId">Kho *</label>
                  <select
                    id="warehouseId"
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn kho</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Số lượng xuất *</label>
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

                <div className="form-group">
                  <label htmlFor="note">Ghi chú</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Ví dụ: Xuất sang cửa hàng A"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="handledBy">Người xử lý</label>
                  <input
                    type="text"
                    id="handledBy"
                    name="handledBy"
                    value={formData.handledBy}
                    onChange={handleInputChange}
                    placeholder={user?.name || user?.email || "Người xử lý"}
                    disabled
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Tự động điền từ tài khoản hiện tại
                  </small>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Đang xuất...' : 'Xuất hàng'}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default BatchStockList;
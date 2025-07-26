import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/batch/BatchList.css";

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function BatchList({ searchQuery = "" }) {
  const { token } = useSelector((state) => state.auth);
  const [batches, setBatches] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [products, setProducts] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [formData, setFormData] = useState({
    batchCode: "",
    productId: "",
    distributorId: "",
    warehouseId: "",
    certificateId: "",
    brandId: "",
    imageUrl: "",
    quantity: "",
    amount: "",
    expiryDate: "",
    importDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    document.title = "Manage Batch - Alurà System Management";
    fetchAll();
  }, [searchQuery]);

  const fetchAll = async () => {
    await Promise.all([fetchBatches(), fetchDropdownOptions()]);
  };

  const fetchBatches = async () => {
    try {
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`${API_URL}/batch${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setBatches(json.success ? json.data : []);
    } catch {
      toast.error("Failed to fetch batches!");
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [prodRes, distRes, wareRes, certRes] = await Promise.all([
        fetch(`${API_URL}/products/admin-and-staff?pageIndex=1&pageSize=100`, { headers }),
        fetch(`${API_URL}/distributor`, { headers }),
        fetch(`${API_URL}/warehouse`, { headers }),
        fetch(`${API_URL}/batch-certificate`, { headers }),
      ]);

      const prodData = await prodRes.json();
      const distData = await distRes.json();
      const wareData = await wareRes.json();
      const certData = await certRes.json();

      console.log(prodData);

      if (prodData.success) setProducts(prodData.products);
      if (Array.isArray(distData)) setDistributors(distData);
      if (wareData?.data) setWarehouses(wareData.data);
      if (certData.success) setCertificates(certData.data);
    } catch (err) {
      console.error("Dropdown error:", err);
      toast.error("Failed to fetch dropdown data");
    }
  };

  const openAddModal = () => {
    setSelectedBatch(null);
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      batchCode: "",
      productId: "",
      distributorId: "",
      warehouseId: "",
      certificateId: "",
      brandId: "",
      imageUrl: "",
      quantity: "",
      amount: "",
      expiryDate: "",
      importDate: today,
      notes: "",
    });
    setIsUpdateModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      productId: batch.productId?._id || "",
      distributorId: batch.distributorId?._id || "",
      warehouseId: batch.warehouseId?._id || "",
      certificateId: batch.certificateId || "",
      brandId: batch.brandId || "",
      imageUrl: batch.imageUrl || "",
      quantity: batch.quantity,
      amount: batch.amount,
      expiryDate: batch.expiryDate?.slice(0, 10) || "",
      importDate: new Date().toISOString().split("T")[0],
      notes: batch.notes || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleProductChange = (productId) => {
    const selected = products.find((p) => p._id === productId);
    setFormData((prev) => ({
      ...prev,
      productId,
      imageUrl: selected?.imgUrls?.[0] || "",
      brandId: selected?.brand?._id || "",
    }));
  };

  const handleSaveBatch = async () => {
    const importDate = new Date(formData.importDate);
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();

    if (expiryDate <= today.setFullYear(today.getFullYear() + 1)) {
      toast.error("Expiry date must be at least 1 year from today!");
      return;
    }

    if (Number(formData.quantity) < 0 || Number(formData.amount) < 0) {
      toast.error("Quantity and amount must not be negative!");
      return;
    }

    const method = selectedBatch ? "PUT" : "POST";
    const endpoint = selectedBatch
      ? `${API_URL}/batch/${selectedBatch._id}`
      : `${API_URL}/batch`;

    const payload = selectedBatch
      ? {
        distributorId: formData.distributorId,
        certificateId: formData.certificateId || null,
        amount: Number(formData.amount),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        notes: formData.notes,
      }
      : {
        ...formData,
        importDate: importDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
      };

    if (selectedBatch) {
      delete payload.batchCode;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Batch ${selectedBatch ? "updated" : "added"} successfully!`);
        fetchBatches();
        closeModal();
      } else {
        toast.error("Failed to save batch.");
      }
    } catch {
      toast.error("Error saving batch.");
    }
  };

  const handleDeleteBatch = async () => {
    if (!selectedBatch) return;
    if (selectedBatch.lockedReason) {
      toast.error("Batch is already deleted.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/batch/${selectedBatch._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Batch deleted successfully!");
        setBatches(batches.filter((b) => b._id !== selectedBatch._id));
        closeModal();
      } else {
        toast.error("Batch is already deleted.");
      }
    } catch {
      toast.error("Error deleting batch.");
    }
  };

  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBatch(null);
  };

  const columns = [
    "Batch Code",
    "Product",
    "Warehouse",
    "Distributor",
    "Quantity",
    "Remaining",
    "Amount",
    "Expiry Date",
    "Imported Date",
    "Note",
    // "Status",
    "Action",
  ];

  const filteredData = batches.map((b) => ({
    batch_code: b.batchCode,
    product: b.productId?.name || "-",
    warehouse: b.warehouseId?.name || "-",
    distributor: b.distributorId?.name || "-",
    quantity: b.quantity || "-",
    remaining: b.remaining || "-",
    amount: b.amount?.toLocaleString() || "-",
    expiry_date: b.expiryDate ? formatDate(b.expiryDate) : "-",
    imported_date: b.createdAt ? formatDate(b.createdAt) : "-",
    note: b.notes || "-",
    // status: (
    //   <span className={`status_tag ${b.lockedReason ? "status_cancelled" : "status_active"}`}>
    //     {b.lockedReason ? "Cancelled" : "Active"}
    //   </span>
    // ),
    action: (
      <div className="action_icons" key={b._id}>
        <i className="fas fa-pen edit_icon" onClick={() => openEditModal(b)} />
        <i className="fas fa-trash delete_icon" onClick={() => {
          setSelectedBatch(b);
          setIsDeleteModalOpen(true);
        }} />
      </div>
    ),
  }));

  return (
    <div className="WarehouseList">
      <div className="warehouse_list_container">
        <div className="warehouse_list_header">
          <h2 className="admin_main_title">Manage Batch</h2>
          <div className="right_controls">
            <button className="add_warehouse_btn" onClick={openAddModal}>
              Add New Batch
            </button>
          </div>
        </div>
        <Table columns={columns} data={filteredData} />
      </div>

      {isUpdateModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <button className="close_modal_btn" onClick={closeModal}>×</button>
            <h5>{selectedBatch ? "Update Batch" : "Add New Batch"}</h5>
            <form
              className="product_form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveBatch();
              }}
            >
              {!selectedBatch && (
                <div className="form_group">
                  <label>Batch Code</label>
                  <input
                    type="text"
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    required
                  />
                </div>
              )}

              {selectedBatch ? (
                <>
                  <div className="form_group">
                    <label>Distributor</label>
                    <select
                      value={formData.distributorId}
                      onChange={(e) => setFormData({ ...formData, distributorId: e.target.value })}
                      required
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* 
                  <div className="form_group">
                    <label>Warehouse</label>
                    <select
                      value={formData.warehouseId}
                      onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map((w) => (
                        <option key={w._id} value={w._id}>{w.name}</option>
                      ))}
                    </select>
                  </div> */}

                  <div className="form_group">
                    <label>Certificate</label>
                    <select
                      value={formData.certificateId}
                      onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                    >
                      <option value="">Select Certificate</option>
                      {certificates.map((c) => (
                        <option key={c._id} value={c._id}>{c.certificateCode}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form_group">
                    <label>Amount (VND)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form_group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form_group">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form_group">
                    <label>Product</label>
                    <select
                      value={formData.productId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form_group">
                    <label>Distributor</label>
                    <select
                      value={formData.distributorId}
                      onChange={(e) => setFormData({ ...formData, distributorId: e.target.value })}
                      required
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form_group">
                    <label>Warehouse</label>
                    <select
                      value={formData.warehouseId}
                      onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map((w) => (
                        <option key={w._id} value={w._id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form_group">
                    <label>Certificate</label>
                    <select
                      value={formData.certificateId}
                      onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                    >
                      <option value="">Select Certificate</option>
                      {certificates.map((c) => (
                        <option key={c._id} value={c._id}>{c.certificateCode}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form_group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form_group">
                    <label>Amount (VND)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form_group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form_group">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="add_account_btn admin_modal_add_button">
                {selectedBatch ? "Update" : "Create"} Batch
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <button className="close_modal_btn" onClick={closeModal}>×</button>
            <h5>
              Are you sure you want to delete (soft delete) <b>{selectedBatch?.batchCode}</b>?
            </h5>
            <div className="modal-buttons">
              <button className="cancel_btn" onClick={closeModal}>Cancel</button>
              <button className="delete_btn" onClick={handleDeleteBatch}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchList;

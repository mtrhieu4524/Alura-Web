import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/batch/BatchList.css";

const API_URL = import.meta.env.VITE_API_URL;

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
    importDate: "",
    notes: "",
  });

  useEffect(() => {
    document.title = "Manage Batch - Alurà System Management";
    fetchAll();
  }, [searchQuery]);

  const fetchAll = async () => {
    await Promise.all([
      fetchBatches(),
      fetchDropdownOptions()
    ]);
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

      const [prodRes, distRes, wareRes, certRes, brandRes] = await Promise.all([
        fetch(`${API_URL}/products/admin-and-staff`, { headers }),
        fetch(`${API_URL}/distributor`, { headers }),
        fetch(`${API_URL}/warehouse`, { headers }),
        fetch(`${API_URL}/batch-certificate`, { headers }),
      ]);

      const prodData = await prodRes.json();
      const distData = await distRes.json();
      const wareData = await wareRes.json();
      const certData = await certRes.json();

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
      importDate: "",
      notes: "",
    });
    setIsUpdateModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      batchCode: batch.batchCode,
      productId: batch.productId?._id || "",
      distributorId: batch.distributorId?._id || "",
      warehouseId: batch.warehouseId?._id || "",
      certificateId: batch.certificateId || "",
      brandId: batch.brandId || "",
      imageUrl: batch.imageUrl || "",
      quantity: batch.quantity,
      amount: batch.amount,
      expiryDate: batch.expiryDate?.slice(0, 10) || "",
      importDate: batch.importDate?.slice(0, 10) || "",
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

    if (expiryDate <= importDate) {
      toast.error("Expiry date must be after import date!");
      return;
    }

    const method = selectedBatch ? "PUT" : "POST";
    const endpoint = selectedBatch
      ? `${API_URL}/batch/${selectedBatch._id}`
      : `${API_URL}/batch`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
      toast.error("Batch is already cancelled.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/batch/${selectedBatch._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Batch cancelled successfully!");
        setBatches(batches.filter((b) => b._id !== selectedBatch._id));
        closeModal();
      } else {
        toast.error("Batch is already cancelled.");
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
    "Amount",
    // "Import Date",
    "Expiry Date",
    "Note",
    "Status",
    "Action",
  ];

  const filteredData = batches.map((b) => ({
    batch_code: b.batchCode,
    product: b.productId?.name || "-",
    warehouse: b.warehouseId?.name || "-",
    distributor: b.distributorId?.name || "-",
    amount: b.amount?.toLocaleString() || "",
    expiry_date: b.expiryDate
      ? new Date(b.expiryDate).toLocaleDateString("vi-VN")
      : "",
    import_date: b.importDate
      ? new Date(b.importDate).toLocaleDateString("vi-VN")
      : "",
    note: b.notes || "",
    status: (
      <span className={`status_tag ${b.lockedReason ? "status_cancelled" : "status_active"}`}>
        {b.lockedReason ? "Cancelled" : "Active"}
      </span>
    ),
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

              {["quantity", "amount", "importDate", "expiryDate"].map((field) => (
                <div className="form_group" key={field}>
                  <label>
                    {field === "amount"
                      ? "Amount (VND)"
                      : field === "importDate"
                        ? "Import Date"
                        : field === "expiryDate"
                          ? "Expiry Date"
                          : "Quantity"}
                  </label>
                  <input
                    type={field.includes("Date") ? "date" : "number"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    required={field !== "quantity"}
                  />
                </div>
              ))}

              <div className="form_group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

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
              Are you sure you want to delete (cancelled) <b>{selectedBatch?.batchCode}</b>?
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

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from '../../../components/Table/table/Table';
import '../../../styles/admin/batch/BatchList.css';

const API_URL = import.meta.env.VITE_API_URL;

function BatchList() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batchCode: '',
    productId: '',
    distributorId: '',
    warehouseId: '',
    certificateId: '',
    brandId: '',
    imageUrl: '',
    quantity: '',
    amount: '',
    expiryDate: '',
    importDate: '',
    notes: ''
  });

  const [products, setProducts] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [brands, setBrands] = useState([]);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Manage Batch - Alurà System Management";
    fetchInitialData();
    fetchBatches();
  }, []);

  const fetchInitialData = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [productsRes, distributorsRes, warehousesRes, certsRes, brandsRes] = await Promise.all([
        fetch(`${API_URL}/products`, { headers }),
        fetch(`${API_URL}/distributor`, { headers }),
        fetch(`${API_URL}/warehouse`, { headers }),
        fetch(`${API_URL}/batch-certificate`, { headers }),
        fetch(`${API_URL}/brands`, { headers }),
      ]);

      const productsData = await productsRes.json();
      const brandsData = await brandsRes.json();

      setProducts(productsData.products || []);
      setDistributors(await distributorsRes.json());
      setWarehouses((await warehousesRes.json()).data || []);
      setCertificates(await certsRes.json());
      setBrands(brandsData.data || []);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API_URL}/batch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBatches(data);
      }
    } catch (error) {
      console.error("Failed to fetch batches", error);
    }
  };

  const handleSaveBatch = async () => {
    const method = selectedBatch ? 'PUT' : 'POST';
    const endpoint = selectedBatch ? `${API_URL}/batch/${selectedBatch._id}` : `${API_URL}/batch`;

    const body = selectedBatch
      ? {
          distributorId: formData.distributorId,
          certificateId: formData.certificateId,
          brandId: formData.brandId,
          imageUrl: formData.imageUrl,
          amount: formData.amount,
          expiryDate: formData.expiryDate,
          notes: formData.notes,
        }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchBatches();
        closeModal();
      } else {
        console.error("Failed to save batch");
      }
    } catch (error) {
      console.error("Error saving batch", error);
    }
  };

  const closeModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedBatch(null);
    setFormData({
      batchCode: '',
      productId: '',
      distributorId: '',
      warehouseId: '',
      certificateId: '',
      brandId: '',
      imageUrl: '',
      quantity: '',
      amount: '',
      expiryDate: '',
      importDate: '',
      notes: ''
    });
  };

  const columns = [
    { header: "Batch Code", accessor: "batchCode" },
    { header: "Distributor", accessor: "distributor" },
    { header: "Warehouse", accessor: "warehouse" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Amount (VND)", accessor: "amount" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Import Date", accessor: "importDate" },
    { header: "Action", accessor: "action" },
  ];

  const tableData = batches.map((batch) => ({
    batchCode: batch.batchCode,
    distributor: batch.distributorId?.name || "N/A",
    warehouse: batch.warehouseId?.name || "N/A",
    quantity: batch.quantity,
    amount: batch.amount.toLocaleString(),
    expiryDate: new Date(batch.expiryDate).toLocaleDateString(),
    importDate: new Date(batch.importDate).toLocaleDateString(),
    action: (
      <div className="action_icons">
        <i
          className="fas fa-pen edit_icon"
          title="Edit Batch"
          onClick={() => {
            setSelectedBatch(batch);
            setFormData({
              distributorId: batch.distributorId?._id || '',
              certificateId: batch.certificateId || '',
              brandId: batch.brandId || '',
              imageUrl: batch.imageUrl || '',
              amount: batch.amount,
              expiryDate: batch.expiryDate?.slice(0, 10),
              notes: batch.notes || ''
            });
            setIsUpdateModalOpen(true);
          }}
        />
      </div>
    ),
  }));

  return (
    <div className="BatchList">
      <div className="batch_list_container">
        <div className="batch_list_header">
          <h2 className="admin_main_title">Manage Batch</h2>
          <button className="add_batch_btn" onClick={() => setIsUpdateModalOpen(true)}>
            Add New Batch
          </button>
        </div>

        <Table columns={columns} data={tableData} />
      </div>

      {isUpdateModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <button className="close_modal_btn" onClick={closeModal}>×</button>
            <h3>{selectedBatch ? "Update Batch" : "Add New Batch"}</h3>

            <div className="modal_form">
              {!selectedBatch && (
                <>
                  <input type="text" placeholder="Batch Code" value={formData.batchCode} onChange={e => setFormData({ ...formData, batchCode: e.target.value })} />
                  <select value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value })}>
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <select value={formData.warehouseId} onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}>
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                  <input type="number" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                  <input type="date" placeholder="Import Date" value={formData.importDate} onChange={e => setFormData({ ...formData, importDate: e.target.value })} />
                </>
              )}
              <select value={formData.distributorId} onChange={e => setFormData({ ...formData, distributorId: e.target.value })}>
                <option value="">Select Distributor</option>
                {distributors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <select value={formData.certificateId} onChange={e => setFormData({ ...formData, certificateId: e.target.value })}>
                <option value="">Select Certificate</option>
                {certificates.map(c => <option key={c._id} value={c._id}>{c.certificateCode}</option>)}
              </select>
              <select value={formData.brandId} onChange={e => setFormData({ ...formData, brandId: e.target.value })}>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.brandName || b.id}</option>)}
              </select>
              <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
              <input type="number" placeholder="Amount (VND)" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
              <input type="date" placeholder="Expiry Date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
              <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              <button className="save_btn" onClick={handleSaveBatch}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchList;

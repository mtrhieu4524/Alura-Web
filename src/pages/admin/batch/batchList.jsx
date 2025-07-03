import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/batch/BatchList.css';

const API_URL = import.meta.env.VITE_API_URL;

function BatchList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        document.title = "Manage Batch - Alurà System Management";
    }, []);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await fetch(`${API_URL}/batch`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBatches(data);
                }
            } catch (error) {
                console.error("Failed to fetch batches", error);
            }
        };
        fetchBatches();
    }, []);

    const columns = ["Batch Code", "Distributor", "Warehouse", "Quantity", "Amount (VND)", "Expiry Date", "Import Date", "Action"];

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
                        setIsUpdateModalOpen(true);
                    }}
                />
                <i
                    className="fas fa-trash delete_icon"
                    title="Delete Batch"
                    onClick={() => {
                        setSelectedBatch(batch);
                        setIsDeleteModalOpen(true);
                    }}
                />
            </div>
        )
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
                        <button className="close_modal_btn" onClick={() => setIsUpdateModalOpen(false)}>×</button>
                        <h3>{selectedBatch ? "Update batch modal" : "Add batch modal"}</h3>
                    </div>
                </div>
            )}


            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h3>Delete batch modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchList;

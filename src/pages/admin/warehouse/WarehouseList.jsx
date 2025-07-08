import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/warehouse/WarehouseList.css';

const API_URL = import.meta.env.VITE_API_URL;

function WarehouseList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        document.title = "Manage Warehouse - Alurà System Management";
    }, []);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const res = await fetch(`${API_URL}/warehouse`);
                const data = await res.json();
                if (data.success) {
                    setWarehouses(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch warehouses", error);
            }
        };
        fetchWarehouses();
    }, []);

    const columns = ["Name", "Action"];

    const tableData = warehouses.map((warehouse) => ({
        name: warehouse.name,
        action: (
            <div className="action_icons">
                <i
                    className="fas fa-pen edit_icon"
                    title="Edit Warehouse"
                    onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setIsUpdateModalOpen(true);
                    }}
                />
                <i
                    className="fas fa-trash delete_icon"
                    title="Delete Warehouse"
                    onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setIsDeleteModalOpen(true);
                    }}
                />
            </div>
        )
    }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Warehouse</h2>
                    <button className="add_warehouse_btn" onClick={() => setIsUpdateModalOpen(true)}>
                        Add New Warehouse
                    </button>
                </div>

                <Table columns={columns} data={tableData} />
            </div>

            {/* Update Modal */}
            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsUpdateModalOpen(false)}>×</button>
                        <h3>{selectedWarehouse ? "Update warehouse modal" : "Add warehouse modal"}</h3>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h3>Delete warehouse modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WarehouseList;

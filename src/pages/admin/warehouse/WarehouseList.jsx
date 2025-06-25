import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/warehouse/WarehouseList.css';

function WarehouseList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    useEffect(() => {
        document.title = "Manage Warehouse - Alurà System Management";
    }, []);

    const columns = ["Name", "Location", "Capacity", "Stock", "Action"];

    const fakeData = [
        { name: "Central Warehouse", location: "HCMC", capacity: "1000", stock: 800 },
        { name: "East Hub", location: "Da Nang", capacity: "500", stock: 420 },
        { name: "North Storage", location: "Hanoi", capacity: "800", stock: 650 },
        { name: "Backup Depot", location: "Can Tho", capacity: "300", stock: 220 },
        { name: "Overstock Unit", location: "Bien Hoa", capacity: "600", stock: 510 },
        { name: "East Hub", location: "Da Nang", capacity: "500", stock: 420 },
        { name: "North Storage", location: "Hanoi", capacity: "800", stock: 650 },
        { name: "East Hub", location: "Da Nang", capacity: "500", stock: 420 },
        { name: "North Storage", location: "Hanoi", capacity: "800", stock: 650 },
    ];

    const tableData = fakeData.map((warehouse) => ({
        ...warehouse,
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

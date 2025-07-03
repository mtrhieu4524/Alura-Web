import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/distributor/DistributorList.css';

const API_URL = import.meta.env.VITE_API_URL;

function DistributorList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [distributors, setDistributors] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    useEffect(() => {
        document.title = "Manage Distributor - Alurà System Management";
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        try {
            const res = await fetch(`${API_URL}/distributor`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setDistributors(data);
            }
        } catch (error) {
            console.error("Failed to fetch distributors", error);
        }
    };

    const fetchDistributorById = async (id) => {
        try {
            const res = await fetch(`${API_URL}/distributor/${id}`);
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                console.error("Failed to fetch distributor by id");
            }
        } catch (error) {
            console.error("Error fetching distributor by id", error);
        }
    };

    const handleSaveDistributor = async () => {
        // Basic validation
        if (!formData.name || !formData.phone || !formData.email || !formData.address) {
            alert("Please fill in all fields.");
            return;
        }

        if (selectedDistributor) {
            // Update existing distributor
            try {
                const res = await fetch(`${API_URL}/distributor/${selectedDistributor._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const updated = await res.json();
                    setDistributors(prev =>
                        prev.map(d => (d._id === updated._id ? updated : d))
                    );
                    closeModal();
                } else {
                    console.error("Failed to update distributor");
                }
            } catch (error) {
                console.error("Failed to update distributor", error);
            }
        } else {
            // Add new distributor
            try {
                const res = await fetch(`${API_URL}/distributor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const newDistributor = await res.json();
                    setDistributors(prev => [...prev, newDistributor]);
                    closeModal();
                } else {
                    console.error("Failed to add distributor");
                }
            } catch (error) {
                console.error("Failed to add distributor", error);
            }
        }
    };

    const handleDeleteDistributor = async () => {
        if (!selectedDistributor) return;

        try {
            const res = await fetch(`${API_URL}/distributor/${selectedDistributor._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setDistributors(prev =>
                    prev.filter(d => d._id !== selectedDistributor._id)
                );
                setIsDeleteModalOpen(false);
                setSelectedDistributor(null);
            } else {
                console.error("Failed to delete distributor");
            }
        } catch (error) {
            console.error("Error deleting distributor", error);
        }
    };

    const openAddModal = () => {
        setSelectedDistributor(null);
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: ""
        });
        setIsUpdateModalOpen(true);
    };

    const openEditModal = async (distributor) => {
        // Fetch fresh data if needed
        const freshData = await fetchDistributorById(distributor._id);
        if (freshData) {
            setSelectedDistributor(freshData);
            setFormData({
                name: freshData.name,
                phone: freshData.phone,
                email: freshData.email,
                address: freshData.address
            });
            setIsUpdateModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedDistributor(null);
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: ""
        });
    };

    const columns = ["Name", "Phone", "Email", "Address", "Action"];

    const tableData = distributors.map((distributor) => ({
        name: distributor.name,
        phone: distributor.phone,
        email: distributor.email,
        address: distributor.address,
        action: (
            <div className="action_icons">
                <i
                    className="fas fa-pen edit_icon"
                    title="Edit Distributor"
                    onClick={() => openEditModal(distributor)}
                />
                <i
                    className="fas fa-trash delete_icon"
                    title="Delete Distributor"
                    onClick={() => {
                        setSelectedDistributor(distributor);
                        setIsDeleteModalOpen(true);
                    }}
                />
            </div>
        )
    }));

    return (
        <div className="DistributorList">
            <div className="distributor_list_container">
                <div className="distributor_list_header">
                    <h2 className="admin_main_title">Manage Distributor</h2>
                    <button className="add_distributor_btn" onClick={openAddModal}>
                        Add New Distributor
                    </button>
                </div>

                <Table columns={columns} data={tableData} />
            </div>

            {/* Add / Update Modal */}
            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h3>{selectedDistributor ? "Update Distributor" : "Add New Distributor"}</h3>

                        <div className="modal_form">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            <button className="save_btn" onClick={handleSaveDistributor}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete <b>{selectedDistributor?.name}</b>?</p>
                        <button className="delete_btn" onClick={handleDeleteDistributor}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DistributorList;

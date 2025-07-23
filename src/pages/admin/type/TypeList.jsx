import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/warehouse/WarehouseList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function TypeList({ searchQuery }) {
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryID: "",
        subCategoryID: ""
    });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        document.title = "Manage Product Types - Alurà System Management";
        fetchTypes();
        fetchCategories();
        fetchSubCategories();
    }, [searchQuery]);

    const fetchTypes = async () => {
        try {
            const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
            const res = await fetch(`${API_URL}/product-types${query}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            setTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch types", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/sub-categories`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            setSubCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch sub-categories", error);
        }
    };

    const handleSaveType = async () => {
        const { name, description, categoryID, subCategoryID } = formData;
        if (!name || !description || !categoryID || !subCategoryID) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const method = selectedType ? "PUT" : "POST";
        const endpoint = selectedType
            ? `${API_URL}/product-types/${selectedType._id}`
            : `${API_URL}/product-types`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(`Type ${selectedType ? "updated" : "added"} successfully!`);
                fetchTypes();
                closeModal();
            } else {
                toast.error("Failed to save type.");
            }
        } catch (error) {
            toast.error("Error saving type.");
        }
    };

    const handleDeleteType = async () => {
        if (!selectedType) return;

        try {
            const res = await fetch(`${API_URL}/product-types/${selectedType._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            if (res.ok) {
                toast.success("Type deleted successfully!");
                fetchTypes();
                setIsDeleteModalOpen(false);
                setSelectedType(null);
            } else {
                toast.error("Failed to delete type.");
            }
        } catch (error) {
            toast.error("Error deleting type.");
        }
    };

    const openAddModal = () => {
        setSelectedType(null);
        setFormData({ name: "", description: "", categoryID: "", subCategoryID: "" });
        setIsUpdateModalOpen(true);
    };

    const openEditModal = (type) => {
        setSelectedType(type);
        setFormData({
            name: type.name,
            description: type.description,
            categoryID: type.category?._id || "",
            subCategoryID: type.subCategory?._id || ""
        });
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedType(null);
        setFormData({ name: "", description: "", categoryID: "", subCategoryID: "" });
    };

    const columns = ["Name", "Description", "Category", "Sub Category", "Action"];

    const data = types.map((t) => ({
        name: t.name,
        description: t.description,
        category: t.category?.name || "N/A",
        sub_category: t.subCategory?.name || "N/A",
        action: (
            <div className="action_icons" key={t._id}>
                <i className="fas fa-pen edit_icon" onClick={() => openEditModal(t)} />
                <i className="fas fa-trash delete_icon" onClick={() => {
                    setSelectedType(t);
                    setIsDeleteModalOpen(true);
                }} />
            </div>
        )
    }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Product Type</h2>
                    <button className="add_warehouse_btn" onClick={openAddModal}>
                        Add New Type
                    </button>
                </div>
                <Table columns={columns} data={data} />
            </div>

            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h5>{selectedType ? "Update Type" : "Add New Type"}</h5>
                        <form
                            className="product_form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveType();
                            }}
                        >
                            <div className="form_group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <label>Category</label>
                                <select
                                    value={formData.categoryID}
                                    onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form_group">
                                <label>SubCategory</label>
                                <select
                                    value={formData.subCategoryID}
                                    onChange={(e) => setFormData({ ...formData, subCategoryID: e.target.value })}
                                    required
                                >
                                    <option value="">Select subcategory</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    {selectedType ? "Update" : "Create"} Type
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedType?.name}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteType}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypeList;

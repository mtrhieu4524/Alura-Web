import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/warehouse/WarehouseList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function CategoryList({ searchQuery }) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [filterCosmeticOnly, setFilterCosmeticOnly] = useState(false);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isSubDeleteModalOpen, setIsSubDeleteModalOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const [formData, setFormData] = useState({ name: "", description: "" });
    const [subFormData, setSubFormData] = useState({ name: "", description: "", categoryID: "" });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        document.title = "Manage Category - Alurà System Management";
        fetchCategories();
        fetchSubCategories();
        fetchAllCategories();
    }, [searchQuery]);

    const fetchCategories = async () => {
        try {
            const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
            const res = await fetch(`${API_URL}/categories${query}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
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
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            setSubCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch sub-categories", error);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            setAllCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch all categories", error);
        }
    };

    const handleSaveCategory = async () => {
        const { name, description } = formData;
        if (!name || !description) {
            toast.error("Please fill in all required fields.");
            return;
        }
        const method = selectedCategory ? "PUT" : "POST";
        const endpoint = selectedCategory
            ? `${API_URL}/categories/${selectedCategory._id}`
            : `${API_URL}/categories`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success(`Category ${selectedCategory ? "updated" : "added"} successfully!`);
                fetchCategories();
                closeModal();
            } else {
                toast.error("Failed to save category.");
            }
        } catch (error) {
            toast.error("Error saving category.");
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            const res = await fetch(`${API_URL}/categories/${selectedCategory._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                toast.success("Category deleted successfully!");
                fetchCategories();
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
            } else {
                toast.error("Product is assign this category, can not delete.");
            }
        } catch (error) {
            toast.error("Error deleting category.");
        }
    };

    const handleSaveSubCategory = async () => {
        const { name, description, categoryID } = subFormData;
        if (!name || !description || !categoryID) {
            toast.error("Please fill in all required fields.");
            return;
        }
        const method = selectedSubCategory ? "PUT" : "POST";
        const endpoint = selectedSubCategory
            ? `${API_URL}/sub-categories/${selectedSubCategory._id}`
            : `${API_URL}/sub-categories`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(subFormData),
            });
            if (res.ok) {
                toast.success(`Sub Category ${selectedSubCategory ? "updated" : "added"} successfully!`);
                fetchSubCategories();
                closeSubModal();
            } else {
                toast.error("Failed to save sub category.");
            }
        } catch (error) {
            toast.error("Error saving sub category.");
        }
    };

    const handleDeleteSubCategory = async () => {
        if (!selectedSubCategory) return;
        try {
            const res = await fetch(`${API_URL}/sub-categories/${selectedSubCategory._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                toast.success("Sub Category deleted successfully!");
                fetchSubCategories();
                setIsSubDeleteModalOpen(false);
                setSelectedSubCategory(null);
            } else {
                toast.error("Subcategory cannot be deleted.");
            }
        } catch (error) {
            toast.error("Error deleting sub category.");
        }
    };

    const openAddModal = () => {
        setSelectedCategory(null);
        setFormData({ name: "", description: "" });
        setIsUpdateModalOpen(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, description: category.description });
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCategory(null);
        setFormData({ name: "", description: "" });
    };

    const openAddSubModal = () => {
        setSelectedSubCategory(null);
        setSubFormData({ name: "", description: "", categoryID: "" });
        setIsSubModalOpen(true);
    };

    const openEditSubModal = (sub) => {
        setSelectedSubCategory(sub);
        setSubFormData({
            name: sub.name,
            description: sub.description,
            categoryID: sub.category?._id || ""
        });
        setIsSubModalOpen(true);
    };

    const closeSubModal = () => {
        setIsSubModalOpen(false);
        setSelectedSubCategory(null);
        setSubFormData({ name: "", description: "", categoryID: "" });
    };

    const categoryColumns = ["Name", "Description", "Action"];
    const subCategoryColumns = ["Name", "Description", "Category", "Action"];

    const categoryData = categories.map(c => ({
        name: c.name,
        description: c.description,
        action: (
            <div className="action_icons" key={c._id}>
                <i className="fas fa-pen edit_icon" onClick={() => openEditModal(c)} />
                <i className="fas fa-trash delete_icon" onClick={() => {
                    setSelectedCategory(c);
                    setIsDeleteModalOpen(true);
                }} />
            </div>
        )
    }));

    const subCategoryData = subCategories
        .filter(s => !filterCosmeticOnly || s.category?.name === "Cosmetic")
        .map(s => ({
            name: s.name,
            description: s.description,
            category: s.category?.name || "",
            action: (
                <div className="action_icons" key={s._id}>
                    <i className="fas fa-pen edit_icon" onClick={() => openEditSubModal(s)} />
                    <i className="fas fa-trash delete_icon" onClick={() => {
                        setSelectedSubCategory(s);
                        setIsSubDeleteModalOpen(true);
                    }} />
                </div>
            )
        }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Sub Category</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "15px", marginRight: "20px", marginBottom: "7px" }}>
                            <input
                                type="checkbox"
                                checked={filterCosmeticOnly}
                                onChange={(e) => setFilterCosmeticOnly(e.target.checked)}
                            />
                            Cosmetic Only
                        </label>
                        <button className="add_warehouse_btn" onClick={openAddSubModal}>Add New Sub Category</button>
                    </div>
                </div>

                <Table columns={subCategoryColumns} data={subCategoryData} />

                <div className="warehouse_list_header" style={{ marginTop: "40px" }}>
                    <h2 className="admin_main_title">Manage Category</h2>
                    <button className="add_warehouse_btn" onClick={openAddModal}>Add New Category</button>
                </div>
                <Table columns={categoryColumns} data={categoryData} />
            </div>

            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h5>{selectedCategory ? "Update Category" : "Add New Category"}</h5>
                        <form className="product_form" onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }}>
                            <div className="form_group">
                                <label>Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form_group">
                                <label>Description</label>
                                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">{selectedCategory ? "Update" : "Create"} Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isSubModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeSubModal}>×</button>
                        <h5>{selectedSubCategory ? "Update Sub Category" : "Add New Sub Category"}</h5>
                        <form className="product_form" onSubmit={(e) => { e.preventDefault(); handleSaveSubCategory(); }}>
                            <div className="form_group">
                                <label>Name</label>
                                <input type="text" value={subFormData.name} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} required />
                            </div>
                            <div className="form_group">
                                <label>Description</label>
                                <input type="text" value={subFormData.description} onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })} required />
                            </div>
                            <div className="form_group">
                                <label>Category</label>
                                <select value={subFormData.categoryID} onChange={(e) => setSubFormData({ ...subFormData, categoryID: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    {allCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">{selectedSubCategory ? "Update" : "Create"} Sub Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedCategory?.name}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteCategory}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {isSubDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsSubDeleteModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedSubCategory?.name}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsSubDeleteModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteSubCategory}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryList;

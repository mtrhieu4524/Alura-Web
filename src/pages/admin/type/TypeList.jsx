import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/warehouse/WarehouseList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function TypeList({ searchQuery }) {
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [isDeleteBrandModalOpen, setIsDeleteBrandModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    const [filterCosmeticOnly, setFilterCosmeticOnly] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryID: "",
        subCategoryID: "",
        categoryName: ""
    });

    const [brandData, setBrandData] = useState({ brandName: "" });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        document.title = "Brand & Product Type - Alurà System Management";
        fetchTypes();
        fetchCategories();
        fetchSubCategories();
        fetchBrands();
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

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${API_URL}/brands`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const json = await res.json();
            setBrands(json.data || []);
        } catch (error) {
            console.error("Failed to fetch brands", error);
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
                body: JSON.stringify({ name, description, categoryID, subCategoryID })
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

    const handleSaveBrand = async () => {
        if (!brandData.brandName.trim()) {
            toast.error("Brand name is required.");
            return;
        }
        const method = selectedBrand ? "PUT" : "POST";
        const endpoint = selectedBrand
            ? `${API_URL}/brands/${selectedBrand.id}`
            : `${API_URL}/brands`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ brandName: brandData.brandName })
            });

            if (res.ok) {
                toast.success(`Brand ${selectedBrand ? "updated" : "added"} successfully!`);
                fetchBrands();
                setIsBrandModalOpen(false);
                setSelectedBrand(null);
                setBrandData({ brandName: "" });
            } else {
                toast.error("Failed to save brand.");
            }
        } catch (error) {
            toast.error("Error saving brand.");
        }
    };

    const handleDeleteBrand = async () => {
        if (!selectedBrand) return;
        try {
            const res = await fetch(`${API_URL}/brands/${selectedBrand.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                toast.success("Brand deleted successfully!");
                fetchBrands();
                setIsDeleteBrandModalOpen(false);
                setSelectedBrand(null);
            } else {
                toast.error("Failed to delete brand.");
            }
        } catch (error) {
            toast.error("Error deleting brand.");
        }
    };

    const openEditModal = (type) => {
        setSelectedType(type);
        setFormData({
            name: type.name,
            description: type.description,
            categoryID: type.category?._id || "",
            subCategoryID: type.subCategory?._id || "",
            categoryName: type.category?.name || ""
        });
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedType(null);
        setFormData({ name: "", description: "", categoryID: "", subCategoryID: "", categoryName: "" });
    };

    const handleSubCategoryChange = (subCatId) => {
        const sub = subCategories.find((s) => s._id === subCatId);
        const categoryName = sub?.category?.name || "";
        const categoryID = sub?.category?._id || "";
        setFormData((prev) => ({ ...prev, subCategoryID: subCatId, categoryID, categoryName }));
    };

    const columns = ["Name", "Description", "Category", "Sub Category", "Action"];
    const brandColumns = ["Brand Name", "Action"];

    const data = types
        .filter((t) => !filterCosmeticOnly || t.category?.name === "Cosmetic")
        .map((t) => ({
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

    const brandDataRows = brands.map((b) => ({
        brand_name: b.brandName,
        action: (
            <div className="action_icons" key={b.id}>
                <i className="fas fa-pen edit_icon" onClick={() => {
                    setSelectedBrand(b);
                    setBrandData({ brandName: b.brandName });
                    setIsBrandModalOpen(true);
                }} />
                <i className="fas fa-trash delete_icon" onClick={() => {
                    setSelectedBrand(b);
                    setIsDeleteBrandModalOpen(true);
                }} />
            </div>
        )
    }));

    return (
        <div className="WarehouseList">
            <div className="warehouse_list_container">
                <div className="warehouse_list_header">
                    <h2 className="admin_main_title">Manage Product Type</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "15px", marginRight: "20px", marginBottom: "7px" }}>
                            <input
                                type="checkbox"
                                checked={filterCosmeticOnly}
                                onChange={(e) => setFilterCosmeticOnly(e.target.checked)}
                            />
                            Cosmetic Only
                        </label>
                        <button className="add_warehouse_btn" onClick={() => setIsUpdateModalOpen(true)}>Add New Type</button>
                    </div>
                </div>

                <Table columns={columns} data={data} />

                <div className="warehouse_list_header" style={{ marginTop: "40px" }}>
                    <h2 className="admin_main_title">Manage Brand</h2>
                    <button className="add_warehouse_btn" onClick={() => {
                        setSelectedBrand(null);
                        setBrandData({ brandName: "" });
                        setIsBrandModalOpen(true);
                    }}>Add New Brand</button>
                </div>

                <Table columns={brandColumns} data={brandDataRows} />
            </div>

            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h5>{selectedType ? "Update Type" : "Add New Type"}</h5>
                        <form className="product_form" onSubmit={(e) => { e.preventDefault(); handleSaveType(); }}>
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
                                <label>Sub Category</label>
                                <select
                                    value={formData.subCategoryID}
                                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select subcategory</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form_group">
                                <label>Category (Auto fill)</label>
                                <input type="text" value={formData.categoryName} disabled placeholder="Category" />
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

            {isBrandModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsBrandModalOpen(false)}>×</button>
                        <h5>{selectedBrand ? "Update Brand" : "Add New Brand"}</h5>
                        <form className="product_form" onSubmit={(e) => { e.preventDefault(); handleSaveBrand(); }}>
                            <div className="form_group">
                                <label>Brand Name</label>
                                <input
                                    type="text"
                                    value={brandData.brandName}
                                    onChange={(e) => setBrandData({ brandName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">
                                    {selectedBrand ? "Update" : "Create"} Brand
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteBrandModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteBrandModalOpen(false)}>×</button>
                        <h5>Are you sure you want to delete <b>{selectedBrand?.brandName}</b>?</h5>
                        <div className="modal-buttons">
                            <button className="cancel_btn" onClick={() => setIsDeleteBrandModalOpen(false)}>Cancel</button>
                            <button className="delete_btn" onClick={handleDeleteBrand}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypeList;

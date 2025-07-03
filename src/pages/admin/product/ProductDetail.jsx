import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/admin/product/ProductDetail.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/products?pageSize=100`);
                const data = await res.json();
                const found = data.products.find(p => p._id === id);
                setProduct(found);
            } catch (error) {
                console.error("Failed to fetch product", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (data.success) {
                alert("Updated successfully");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
            navigate("/admin/product-list");
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <div className="product-detail-container-back">
                <div
                    className="admin_back"
                    onClick={() => navigate("/admin/product-list")}>
                    &lt; Back
                </div>
            </div>
            <div className="product-detail-container">
                <div className="product-detail-header">
                    <h2 className="admin_main_title">{product.name}</h2>
                    <div className="product-detail-controls">
                        <i className="fas fa-pen" title="Edit" onClick={() => setIsEditing(true)}></i>
                        <i className="delete_icon fas fa-trash-alt" title="Delete" onClick={() => setShowDeleteModal(true)}></i>
                    </div>
                </div>

                <img src={product.imgUrls?.[0]} alt={product.name} className="product-image-preview" />

                <div className="product-detail-grid">
                    {[
                        { label: "Name", value: "name" },
                        { label: "Price (VND)", value: "price" },
                        { label: "Stock", value: "stock" },
                        { label: "Volume", value: "volume" },
                        { label: "Sex", value: "sex" },
                        { label: "Skin Type", value: "skinType" },
                        { label: "Skin Color", value: "skinColor" },
                        { label: "Purpose", value: "purpose" },
                        { label: "Instructions", value: "instructions", isText: true },
                        { label: "Preservation", value: "preservation", isText: true },
                        { label: "Key Ingredients", value: "keyIngredients", isText: true },
                        { label: "Detail Ingredients", value: "detailInfredients", isText: true },
                        { label: "Category", value: "categoryId.name" },
                        { label: "Type", value: "productTypeId.name" }
                    ].map(({ label, value, isText }) => {
                        const fieldValue = value.includes(".")
                            ? value.split(".").reduce((acc, key) => acc?.[key], product)
                            : product[value];

                        return (
                            <div className="product-detail-field" key={value}>
                                <label>{label}</label>
                                {isEditing ? (
                                    isText ? (
                                        <textarea name={value} value={fieldValue || ""} onChange={handleInputChange} />
                                    ) : (
                                        <input type="text" name={value} value={fieldValue || ""} onChange={handleInputChange} />
                                    )
                                ) : (
                                    <input
                                        type="text"
                                        value={Array.isArray(fieldValue) ? fieldValue.join(", ") : fieldValue || ""}
                                        readOnly
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>Are you sure you want to delete this product?</p>
                            <div className="modal-buttons">
                                <button onClick={handleDelete}>Yes, Delete</button>
                                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="product-detail-actions">
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                        <button onClick={handleUpdate}>Save</button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ProductDetail;

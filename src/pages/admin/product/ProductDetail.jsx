import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/admin/product/ProductDetail.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [b, c, t] = await Promise.all([
                    fetch(`${API_URL}/brands`),
                    fetch(`${API_URL}/categories`),
                    fetch(`${API_URL}/product-types`),
                ]);
                const bd = await b.json();
                const cd = await c.json();
                const td = await t.json();
                if (bd.success) setBrands(bd.data);
                if (Array.isArray(cd)) setCategories(cd);
                if (Array.isArray(td)) setProductTypes(td);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/products?pageSize=100`);
                const data = await res.json();
                const found = data.products.find((p) => p._id === id);
                setProduct(found);
                setExistingImages(found.imgUrls || []);
            } catch (e) {
                console.error(e);
            }
        };

        fetchOptions();
        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const total = existingImages.length + newImages.length + files.length;
        if (total > 5) {
            toast.error("Maximum 5 images allowed.");
            return;
        }
        setNewImages((prev) => [...prev, ...files]);
    };

    const removeExistingImage = (idx) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const removeNewImage = (idx) => {
        setNewImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            [
                "name", "price", "brand", "sex", "skinType", "skinColor",
                "volume", "instructions", "preservation", "keyIngredients",
                "detailInfredients", "purpose", "categoryId", "productTypeId", "stock"
            ].forEach((field) => {
                formData.append(field, product[field] || "");
            });

            formData.append("oldImages", JSON.stringify(existingImages));

            newImages.forEach((file) => {
                if (file instanceof File) formData.append("imgUrls", file);
            });

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Product updated successfully.");
                setProduct(data.product);
                setExistingImages(data.product.imgUrls || []);
                setNewImages([]);
                setIsEditing(false);
            } else {
                toast.error(data.message || "Update failed.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error updating product.");
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success("Product deleted successfully.");
                navigate("/admin/product-list");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to delete product.");
            }
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("An error occurred while deleting the product.");
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <div className="product-detail-container-back">
                <div className="admin_back" onClick={() => navigate("/admin/product-list")}>&lt; Back</div>
            </div>

            <div className="product-detail-container">
                <div className="product-detail-header">
                    <h2 className="admin_main_title">{product.name}</h2>
                    <div className="product-detail-controls">
                        <i className="fas fa-pen" title="Edit" onClick={() => setIsEditing(true)}></i>
                        <i className="delete_icon fas fa-trash-alt" title="Delete" onClick={() => setShowDeleteModal(true)}></i>
                    </div>
                </div>

                <div className="product-images-carousel">
                    {existingImages.map((img, idx) => (
                        <div className="image-wrapper" key={idx}>
                            <img src={img} alt={`existing-${idx}`} />
                            {isEditing && <span className="remove-btn" onClick={() => removeExistingImage(idx)}>×</span>}
                        </div>
                    ))}
                    {newImages.map((file, idx) => (
                        <div className="image-wrapper" key={`new-${idx}`}>
                            <img src={URL.createObjectURL(file)} alt="new" />
                            {isEditing && <span className="remove-btn" onClick={() => removeNewImage(idx)}>×</span>}
                        </div>
                    ))}
                </div>

                <div className="product-detail-grid">
                    {[
                        { label: "Name", value: "name" },
                        { label: "Price", value: "price" },
                        {
                            label: "Brand", value: "brand", isSelect: true,
                            options: brands.map((b) => ({ key: b._id, label: b.brandName })),
                        },
                        {
                            label: "Sex", value: "sex", isSelect: true,
                            options: ["male", "female", "unisex"].map((v) => ({ key: v, label: v.charAt(0).toUpperCase() + v.slice(1) })),
                        },
                        {
                            label: "Skin Type", value: "skinType", isSelect: true,
                            options: ["oily", "sensitive", "combination", "normal"].map((k) => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1) })),
                        },
                        {
                            label: "Skin Color", value: "skinColor", isSelect: true,
                            options: ["neutral", "cool"].map((k) => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1) })),
                        },
                        { label: "Stock", value: "stock" },
                        { label: "Volume", value: "volume" },
                        {
                            label: "Category", value: "categoryId", isSelect: true,
                            options: categories.map((c) => ({ key: c._id, label: c.name })),
                        },
                        {
                            label: "Product Type", value: "productTypeId", isSelect: true,
                            options: productTypes.map((t) => ({ key: t._id, label: t.name })),
                        },
                        { label: "Instructions", value: "instructions", isText: true },
                        { label: "Preservation", value: "preservation", isText: true },
                        { label: "Key Ingredients", value: "keyIngredients", isText: true },
                        { label: "Detail Ingredients", value: "detailInfredients", isText: true },
                        { label: "Purpose", value: "purpose", isText: true },
                    ].map(({ label, value, isSelect, isText, options = [] }) => {
                        let val = product[value] || "";
                        if (value === "brand") {
                            val = product.brand?._id || "";
                        } else if (value === "categoryId") {
                            val = product.categoryId?._id || "";
                        } else if (value === "productTypeId") {
                            val = product.productTypeId?._id || "";
                        }
                        return (
                            <div className="product-detail-field" key={value}>
                                <label>{label}</label>
                                {isEditing ? (
                                    isSelect ? (
                                        <select name={value} value={val} onChange={handleInputChange}>
                                            <option value="">Select {label}</option>
                                            {options.map(({ key, label }) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    ) : isText ? (
                                        <textarea name={value} value={val} onChange={handleInputChange} />
                                    ) : (
                                        <input type="text" name={value} value={val} onChange={handleInputChange} />
                                    )
                                ) : (
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            value === "brand"
                                                ? product.brand?.brandName || ""
                                                : value === "categoryId"
                                                    ? product.categoryId?.name || ""
                                                    : value === "productTypeId"
                                                        ? product.productTypeId?.name || ""
                                                        : product[value] || ""
                                        }
                                    />
                                )}

                            </div>
                        );
                    })}
                </div>

                {isEditing && (
                    <>
                        <div className="form_group form_group_image">
                            <label>Upload Images (max 5): </label>
                            <input type="file" name="imgUrls" accept="image/*" multiple onChange={handleImagesChange} />
                        </div>
                        <div className="product-detail-actions">
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                            <button onClick={handleUpdate}>Save</button>
                        </div>
                    </>
                )}

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close_modal_btn" onClick={() => setShowDeleteModal(false)}>×</button>
                            <h5>Are you sure you want to delete this product?</h5>
                            <div className="modal-buttons">
                                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button onClick={handleDelete}>Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;

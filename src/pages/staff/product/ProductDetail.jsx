import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/admin/product/ProductDetail.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
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

        if (!b.ok || !c.ok || !t.ok) throw new Error("Failed to fetch options");

        const bd = await b.json();
        const cd = await c.json();
        const td = await t.json();

        setBrands(bd.data);
        setCategories(cd);
        setProductTypes(td);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load options");
      }
    };

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/products/admin-and-staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProduct(data.product);
          setExistingImages(data.product.imgUrls || []);
        } else {
          toast.error(data.message || "Failed to load product.");
        }
      } catch (e) {
        console.error("Fetch product failed:", e);
        toast.error("Error fetching product.");
      }
    };

    fetchOptions();
    fetchProduct();
  }, [id]);

  const startEditing = () => {
    setEditedProduct({ ...product });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductTypeChange = (e) => {
    const selectedTypeId = e.target.value;
    const selectedType = productTypes.find((t) => t._id === selectedTypeId);
    setEditedProduct((prev) => ({
      ...prev,
      productTypeId: selectedTypeId,
      categoryId: selectedType?.category || "",
    }));
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

  const getIdValue = (field, value) => {
    if (value && typeof value === "object" && value._id) return value._id;

    if (typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value))
      return value;

    if (typeof value === "string") {
      if (field === "brand") {
        const brand = brands.find(
          (b) => b.brandName === value || b._id === value || b.id === value
        );
        return brand?._id || brand?.id || "";
      }
      if (field === "categoryId") {
        const category = categories.find(
          (c) => c.name === value || c._id === value
        );
        return category?._id || "";
      }
      if (field === "productTypeId") {
        const productType = productTypes.find(
          (t) => t.name === value || t._id === value
        );
        return productType?._id || "";
      }
    }

    return "";
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      const fieldsToSend = {
        name: editedProduct.name || "",
        price: editedProduct.price || "",
        brand: getIdValue("brand", editedProduct.brand),
        sex: editedProduct.sex || "",
        skinType: editedProduct.skinType || "",
        skinColor: editedProduct.skinColor || "",
        volume: editedProduct.volume || "",
        instructions: editedProduct.instructions || "",
        preservation: editedProduct.preservation || "",
        keyIngredients: editedProduct.keyIngredients || "",
        detailInfredients: editedProduct.detailInfredients || "",
        purpose: editedProduct.purpose || "",
        categoryId: getIdValue("categoryId", editedProduct.categoryId),
        productTypeId: getIdValue("productTypeId", editedProduct.productTypeId),
        stock: editedProduct.stock || "",
      };

      const objectIdFields = ["brand", "categoryId", "productTypeId"];
      for (const field of objectIdFields) {
        const value = fieldsToSend[field];
        if (value && !/^[0-9a-fA-F]{24}$/.test(value)) {
          toast.error(
            `Invalid ${field} selected. Please select a valid option.`
          );
          return;
        }
      }

      Object.entries(fieldsToSend).forEach(([key, value]) => {
        formData.append(key, value || "");
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      for (const file of newImages) {
        if (file instanceof File) {
          const fileType = file.type;
          if (!["image/png", "image/jpg", "image/jpeg"].includes(fileType)) {
            toast.error("Images must be png, jpg or jpeg.");
            return;
          }
          formData.append("imgUrls", file);
        }
      }

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
        setEditedProduct(null);
        setExistingImages(data.product.imgUrls || []);
        setNewImages([]);
        setIsEditing(false);
      } else {
        toast.error(data.error || data.message || "Update failed.");
      }
    } catch (e) {
      console.error("Update error:", e);
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

  const getFieldValue = (field) => {
    const source = isEditing ? editedProduct : product;

    if (!source) return "";

    if (field === "brand") {
      return typeof source.brand === "object" && source.brand?._id
        ? source.brand._id
        : typeof source.brand === "string"
        ? source.brand
        : "";
    }

    if (field === "categoryId") {
      return typeof source.categoryId === "object" && source.categoryId?._id
        ? source.categoryId._id
        : typeof source.categoryId === "string"
        ? source.categoryId
        : "";
    }

    if (field === "productTypeId") {
      return typeof source.productTypeId === "object" &&
        source.productTypeId?._id
        ? source.productTypeId._id
        : typeof source.productTypeId === "string"
        ? source.productTypeId
        : "";
    }

    return source[field] || "";
  };

  const getDisplayValue = (field) => {
    if (!product) return "";
    if (field === "brand") return product.brand?.brandName || "";
    if (field === "categoryId") return product.categoryId?.name || "";
    if (field === "productTypeId") return product.productTypeId?.name || "";
    return product[field] || "";
  };

  if (!product) return <p>Loading...</p>;

  const formFields = [
    { label: "Name", value: "name" },
    { label: "Price", value: "price" },
    {
      label: "Brand",
      value: "brand",
      isSelect: true,
      options: brands.map((b) => ({ key: b.id, label: b.brandName })),
    },
    {
      label: "Sex",
      value: "sex",
      isSelect: true,
      options: ["male", "female", "unisex"].map((v) => ({
        key: v,
        label: v.charAt(0).toUpperCase() + v.slice(1),
      })),
    },
    {
      label: "Skin Type",
      value: "skinType",
      isSelect: true,
      options: ["oily", "sensitive", "combination", "normal"].map((k) => ({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      })),
    },
    {
      label: "Skin Color",
      value: "skinColor",
      isSelect: true,
      options: ["neutral", "cool", "light", "dark", "warm"].map((k) => ({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      })),
    },
    { label: "Stock", value: "stock" },
    { label: "Volume", value: "volume" },
    { label: "Category", value: "categoryId", isSelect: false },
    {
      label: "Product Type",
      value: "productTypeId",
      isSelect: true,
      options: productTypes.map((t) => ({ key: t._id, label: t.name })),
    },
    { label: "Instructions", value: "instructions", isText: true },
    { label: "Preservation", value: "preservation", isText: true },
    { label: "Key Ingredients", value: "keyIngredients", isText: true },
    { label: "Detail Ingredients", value: "detailInfredients", isText: true },
    { label: "Purpose", value: "purpose", isText: true },
  ];

  return (
    <div>
      <div className="product-detail-container-back">
        <div
          className="admin_back"
          onClick={() => navigate("/staff/product-list")}>
          &lt; Back To Product List
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-header">
          <h2 className="admin_main_title">{product.name}</h2>
          <div className="product-detail-controls">
            <i className="fas fa-pen" title="Edit" onClick={startEditing}></i>
            <i
              className="delete_icon fas fa-trash-alt"
              title="Delete"
              onClick={() => setShowDeleteModal(true)}></i>
          </div>
        </div>

        <div className="product-images-carousel">
          {existingImages.map((img, idx) => (
            <div className="image-wrapper" key={idx}>
              <img src={img} alt={`existing-${idx}`} />
              {isEditing && (
                <span
                  className="remove-btn"
                  onClick={() => removeExistingImage(idx)}>
                  ×
                </span>
              )}
            </div>
          ))}
          {newImages.map((file, idx) => (
            <div className="image-wrapper" key={`new-${idx}`}>
              <img src={URL.createObjectURL(file)} alt="new" />
              {isEditing && (
                <span
                  className="remove-btn"
                  onClick={() => removeNewImage(idx)}>
                  ×
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="product-detail-grid">
          {formFields.map(
            ({ label, value, isSelect, isText, options = [] }) => (
              <div className="product-detail-field" key={value}>
                <label>{label}</label>
                {isEditing ? (
                  value === "categoryId" ? (
                    <input
                      type="text"
                      value={editedProduct?.categoryId?.name || ""}
                      disabled
                    />
                  ) : isSelect ? (
                    <select
                      name={value}
                      value={getFieldValue(value)}
                      onChange={
                        value === "productTypeId"
                          ? handleProductTypeChange
                          : handleInputChange
                      }>
                      <option value="">Select {label}</option>
                      {options.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : isText ? (
                    <textarea
                      name={value}
                      value={getFieldValue(value)}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      type="text"
                      name={value}
                      value={getFieldValue(value)}
                      onChange={handleInputChange}
                      disabled={value === "stock"}
                    />
                  )
                ) : (
                  <input type="text" readOnly value={getDisplayValue(value)} />
                )}
              </div>
            )
          )}
        </div>

        {isEditing && (
          <>
            <div className="form_group form_group_image">
              <label>Upload Images (max 5): </label>
              <input
                type="file"
                name="imgUrls"
                accept=".png, .jpg, .jpeg"
                multiple
                onChange={handleImagesChange}
              />
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
              <button
                className="close_modal_btn"
                onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
              <h5>Are you sure you want to delete this product?</h5>
              <div className="modal-buttons">
                <button onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
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

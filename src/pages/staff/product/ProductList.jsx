import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table/Table";
import { toast } from "sonner";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import "../../../styles/admin/product/ProductList.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProductList({ searchQuery = "" }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    document.title = "Manage Product - Alurà System Management";
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `${API_URL}/products/admin-and-staff?pageIndex=1&pageSize=20&searchByName=${encodeURIComponent(searchQuery)}`;
      if (filterType !== "All") {
        url += `&productTypeId=${filterType}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filterType]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandRes, typeRes] = await Promise.all([
          fetch(`${API_URL}/brands`),
          fetch(`${API_URL}/product-types`),
        ]);

        const brandData = await brandRes.json();
        const typeData = await typeRes.json();

        if (brandData.success) setBrands(brandData.data || []);
        if (Array.isArray(typeData)) setProductTypes(typeData);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleTogglePublic = async (id, isPublic) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/products/${isPublic ? "disable" : "enable"}/${id}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const message = isPublic
          ? "Hide product successfully."
          : "Show product successfully.";
        toast.success(message);
        fetchProducts();
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Toggle public error:", err);
      toast.error("Error when toggling product visibility.");
    }
  };

  const columns = ["Name", "Type", "Price", "Stock", "Public", "Detail"];

  const tableData = products.map((product) => ({
    name: product.name,
    type: product.productTypeId?.name || "None",
    price: `${product.price.toLocaleString()} VND`,
    stock: product.stock,
    public: (
      <button
        className={`btn_toggle_public ${product.isPublic ? "hide" : "show"}`}
        onClick={() => handleTogglePublic(product._id, product.isPublic)}>
        {product.isPublic ? "Hide" : "Show"}
      </button>
    ),
    detail: (
      <i
        className="fas fa-info-circle detail_icon"
        title="View Details"
        onClick={() => navigate(`/staff/product-list/${product._id}`)}
      />
    ),
  }));

  const handleTypeChange = (e) => {
    const selectedTypeId = e.target.value;
    const selectedType = productTypes.find((pt) => pt._id === selectedTypeId);

    if (selectedType?.category?._id && selectedType?.category?.name) {
      setSelectedCategoryId(selectedType.category._id);
      setSelectedCategoryName(selectedType.category.name);
    } else {
      setSelectedCategoryId("");
      setSelectedCategoryName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    const imageFiles = form.imgUrls.files;
    for (let i = 0; i < imageFiles.length; i++) {
      const fileType = imageFiles[i].type;
      if (!["image/png", "image/jpg", "image/jpeg"].includes(fileType)) {
        toast.error("Image must be png, jpg or jpeg.");
        return;
      }
      formData.append("imgUrls", imageFiles[i]);
    }

    for (let field of form.elements) {
      if (field.name && field.type !== "file") {
        formData.append(field.name, String(field.value));
      }
    }

    formData.set("categoryId", selectedCategoryId);
    formData.set("stock", 0);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product added successfully.");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Add product error:", err);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className="ProductList">
      <div className="product_list_container">
        <div className="product_list_header">
          <h2 className="admin_main_title">Manage Product</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FormControl variant="outlined" size="small">
              <InputLabel>Product Type</InputLabel>
              <Select
                label="Filter by Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ minWidth: 180, height: 35 }}>
                <MenuItem value="All">All</MenuItem>
                {productTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <button
              className="add_product_btn"
              onClick={() => setIsModalOpen(true)}>
              Add New Product
            </button> */}
          </div>
        </div>

        <Table columns={columns} data={tableData} />
      </div>


      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content product_form_modal">
            <button
              className="close_modal_btn"
              onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h5>Add New Product</h5>

            <form className="product_form" onSubmit={handleSubmit}>
              <div className="form_group">
                <label>Name</label>
                <input name="name" required />
              </div>

              <div className="form_group">
                <label>Price (VND)</label>
                <input type="number" name="price" required />
              </div>

              <div className="form_row">
                <div className="form_group half_width">
                  <label>Brand</label>
                  <select name="brand" required>
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_group half_width">
                  <label>Sex</label>
                  <select name="sex" required>
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="form_row">
                <div className="form_group half_width">
                  <label>Skin Type</label>
                  <select name="skinType" required>
                    <option value="">Select Skin Type</option>
                    <option value="oily">Oily</option>
                    <option value="sensitive">Sensitive</option>
                    <option value="combination">Combination</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div className="form_group half_width">
                  <label>Skin Color</label>
                  <select name="skinColor" required>
                    <option value="">Select Skin Color</option>
                    <option value="neutral">Neutral</option>
                    <option value="cool">Cool</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <div className="form_group">
                <label>Volume</label>
                <input name="volume" required placeholder="400ml, 3g" />
              </div>

              <div className="form_group">
                <label>Instructions</label>
                <textarea name="instructions" required />
              </div>

              <div className="form_group">
                <label>Preservation</label>
                <textarea name="preservation" required />
              </div>

              <div className="form_group">
                <label>Key Ingredients</label>
                <textarea name="keyIngredients" required />
              </div>

              <div className="form_group">
                <label>Detail Ingredients</label>
                <textarea name="detailInfredients" required />
              </div>

              <div className="form_group">
                <label>Purpose</label>
                <textarea name="purpose" required />
              </div>

              <div className="form_row">
                <div className="form_group half_width">
                  <label>Category (Auto fill)</label>
                  <input type="text" value={selectedCategoryName} disabled />
                </div>
                <div className="form_group half_width">
                  <label>Product Type</label>
                  <select
                    name="productTypeId"
                    required
                    onChange={handleTypeChange}>
                    <option value="">Select Product Type</option>
                    {productTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form_group form_group_image">
                <label>Upload Images (max 5)</label>
                <input
                  type="file"
                  name="imgUrls"
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                  required
                />
              </div>

              <div className="form_actions">
                <button
                  type="button"
                  className="cancel_btn"
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="add_product_btn">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;


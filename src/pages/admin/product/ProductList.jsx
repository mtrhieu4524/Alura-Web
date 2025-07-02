import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/product/ProductList.css';

const API_URL = import.meta.env.VITE_API_URL;

function ProductList({ searchQuery = "" }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "Manage Product - Alurà System Management";
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/products?pageIndex=1&pageSize=20&searchByName=${encodeURIComponent(searchQuery)}`
                );
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, [searchQuery]);

    const columns = ["Name", "Type", "Price", "Stock", "Detail"];

    const tableData = products.map(product => ({
        name: product.name,
        type: product.productTypeId?.name || "N/A",
        price: `${product.price} VND`,
        stock: product.stock,
        detail: (
            <i
                className="fas fa-info-circle detail_icon"
                title="View Details"
                onClick={() => navigate(`/admin/product-list/${product._id}`)}
            />
        )
    }));

    return (
        <div className="ProductList">
            <div className="product_list_container">
                <div className="product_list_header">
                    <h2 className="admin_main_title">Manage Product</h2>
                    <button className="add_product_btn" onClick={() => setIsModalOpen(true)}>
                        Add New Product
                    </button>
                </div>

                <Table columns={columns} data={tableData} />
            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h3>Add product modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList;

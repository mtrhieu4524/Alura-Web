import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/product/ProductList.css';

function ProductList() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Manage Product - Alurà System Management";
    }, []);

    const columns = ["Name", "Category", "Price", "Stock", "Detail"];

    const fakeData = [
        { name: "Vitamin C Serum", category: "Skincare", price: "$25", stock: 120 },
        { name: "Hyaluronic Acid", category: "Skincare", price: "$18", stock: 90 },
        { name: "Sunscreen SPF50", category: "Sun Care", price: "$20", stock: 60 },
        { name: "Retinol Cream", category: "Anti-Aging", price: "$30", stock: 35 },
        { name: "Collagen Booster", category: "Supplements", price: "$45", stock: 75 },
        { name: "Hyaluronic Acid", category: "Skincare", price: "$18", stock: 90 },
        { name: "Sunscreen SPF50", category: "Sun Care", price: "$20", stock: 60 },
        { name: "Retinol Cream", category: "Anti-Aging", price: "$30", stock: 35 },
    ];

    const tableData = fakeData.map(product => ({
        ...product,
        detail: (
            <i
                className="fas fa-info-circle detail_icon"
                title="View Details"
                onClick={() => navigate(`/admin/products/${product.name.replace(/\s+/g, '-').toLowerCase()}`)}
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

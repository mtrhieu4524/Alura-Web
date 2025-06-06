import { useEffect } from "react";
// import '../../styles/admin/Dashboard.css';

function ProductList() {

    useEffect(() => {
        document.title = "Product List - Alurà System Management";
    }, []);

    return (
        <div className="ProductList">
            <div className="product_list_container">
                <h2 className="admin_main_title">Product</h2>

            </div>
        </div>
    );
}

export default ProductList;

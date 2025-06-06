import { useEffect } from "react";
// import '../../styles/admin/Dashboard.css';

function WarehouseList() {

    useEffect(() => {
        document.title = "Warehouse List - Alurà System Management";
    }, []);

    return (
        <div className="WarehouseList">
            <div className="warehouse-list_container">
                <h2 className="admin_main_title">Warehouse</h2>

            </div>
        </div>
    );
}

export default WarehouseList;

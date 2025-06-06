import { useEffect } from "react";
import '../../styles/admin/Dashboard.css';

function Dashboard() {

    useEffect(() => {
        document.title = "Dashboard - Alurà System Management";
    }, []);

    return (
        <div className="Dashboard">
            <div className="dashboard_container">
                <h2 className="admin_main_title">Dashboard</h2>

            </div>
        </div>
    );
}

export default Dashboard;

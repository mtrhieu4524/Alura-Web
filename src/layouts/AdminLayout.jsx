import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import './AdminLayout.css';
import logo from '../assets/logo.png';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const showSearch = ["/admin/account-list", "/admin/warehouse-list", "/admin/product-list"].includes(location.pathname);

    return (
        <div className="admin_layout">
            <AdminSidebar />
            <div className="admin_content_wrapper">
                <div className="admin_top_card">
                    <img src={logo} alt="Logo" className="admin_logo" />

                    {showSearch && (
                        <div className="admin_search_section">
                            <div className="admin_search_bar_container">
                                <i className="fas fa-search admin_search_icon"></i>
                                <input
                                    type="text"
                                    className="admin_search_bar"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="admin_content_card">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

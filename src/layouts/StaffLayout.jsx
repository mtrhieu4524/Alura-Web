import { useLocation } from "react-router-dom";
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import './AdminLayout.css';
import logo from '../assets/logo.png';

const StaffLayout = ({ children }) => {
    const location = useLocation();
    const showSearch = ["/staff/order-list"].includes(location.pathname);

    return (
        <div className="admin_layout">
            <StaffSidebar />
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
                                    placeholder="Search by order id..."
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

export default StaffLayout;

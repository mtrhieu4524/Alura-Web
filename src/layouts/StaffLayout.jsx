import StaffSidebar from "../components/Sidebar/StaffSidebar";
import './AdminLayout.css';
import logo from '../assets/logo.png';

const StaffLayout = ({ children }) => {
    return (
        <div className="admin_layout">
            <StaffSidebar />
            <div className="admin_content_wrapper">
                <div className="admin_top_card">
                    <img src={logo} alt="Logo" className="admin_logo" />
                </div>
                <div className="admin_content_card">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;

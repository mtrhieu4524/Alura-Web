import AdminSidebar from "../components/Sidebar/AdminSidebar";
import './AdminLayout.css';
import logo from '../assets/logo.png';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin_layout">
            <AdminSidebar />
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

export default AdminLayout;

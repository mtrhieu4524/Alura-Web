import AdminSidebar from "../components/Sidebar/AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <>
            <AdminSidebar />
            <main>{children}</main>
        </>
    );
};

export default AdminLayout;

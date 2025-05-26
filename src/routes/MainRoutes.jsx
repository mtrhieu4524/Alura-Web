import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import UserLayout from "../layouts/UserLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import AdminDashboard from "../pages/AdminDashboard"; 

const MainRoutes = () => {
    return (
        <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />

            {/* Admin Routes */}
            {/* <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      /> */}
        </Routes>
    );
};

export default MainRoutes;

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Contact from "../pages/constants/Contact";
import Introduce from "../pages/constants/Introduce";
import Faqs from "../pages/constants/Faqs";

import UserLayout from "../layouts/UserLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import AdminDashboard from "../pages/AdminDashboard"; 

const MainRoutes = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route path="/introduce" element={<UserLayout><Introduce /></UserLayout>} />
      <Route path="/faqs" element={<UserLayout><Faqs /></UserLayout>} />

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

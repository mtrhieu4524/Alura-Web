import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import VisualSearch from "../pages/visual/VisualSearch";
import Result from "../pages/visual/Result";
import Contact from "../pages/constants/Contact";
import Introduce from "../pages/constants/Introduce";
import Faqs from "../pages/constants/Faqs";
import Login from "../pages/authen/Login";
import Register from "../pages/authen/Register";
import ProductList from "../pages/product/ProductList";
import CosmeticList from "../pages/product/CosmeticList";
import MedicalList from "../pages/product/MedicalList";
import ProductDetail from "../pages/product/ProductDetail";
import ProductSearch from "../pages/product/ProductSearch";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import Invoice from "../pages/cart/Invoice";
import Profile from "../pages/setting/Profile";
import OrderHistory from "../pages/setting/OrderHistory";
import OrderDetail from "../pages/setting/OrderDetail";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminWarehouseList from "../pages/admin/warehouse/WarehouseList";
import AdminProductList from "../pages/admin/product/ProductList";
import AdminAccountList from "../pages/admin/account/AccountList";


const MainRoutes = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />

      {/* User Routes */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route path="/introduce" element={<UserLayout><Introduce /></UserLayout>} />
      <Route path="/faqs" element={<UserLayout><Faqs /></UserLayout>} />
      <Route path="/visual-search" element={<UserLayout><VisualSearch /></UserLayout>} />
      <Route path="/visual-search-result" element={<UserLayout><Result /></UserLayout>} />
      <Route path="/search" element={<UserLayout><ProductSearch /></UserLayout>} />
      <Route path="/product" element={<UserLayout><ProductList /></UserLayout>} />
      <Route path="/cosmetic" element={<UserLayout><CosmeticList /></UserLayout>} />
      <Route path="/medical-treatment" element={<UserLayout><MedicalList /></UserLayout>} />
      <Route path="/product-detail/:name" element={<UserLayout><ProductDetail /></UserLayout>} />
      <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
      <Route path="/invoice" element={<UserLayout><Invoice /></UserLayout>} />
      <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
      <Route path="/order-history" element={<UserLayout><OrderHistory /></UserLayout>} />
      <Route path="/order-detail/:id" element={<UserLayout><OrderDetail /></UserLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/account-list" element={<AdminLayout><AdminAccountList /></AdminLayout>} />
      <Route path="/admin/product-list" element={<AdminLayout><AdminProductList /></AdminLayout>} />
      <Route path="/admin/warehouse-list" element={<AdminLayout><AdminWarehouseList /></AdminLayout>} />

      {/* Staff Routes */}
      {/* <Route path="/dashboard" element={<StaffLayout><AdminDashboard /></StaffLayout>} /> */}

    </Routes>
  );
};

export default MainRoutes;

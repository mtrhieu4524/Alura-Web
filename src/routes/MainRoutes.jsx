import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import Contact from "../views/Contact";

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    );
};

export default MainRoutes;

import HeaderComponent from "../components/Header/HeaderComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

const UserLayout = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <main>{children}</main>
            <ScrollToTop />
            <FooterComponent />
        </>
    );
};

export default UserLayout;

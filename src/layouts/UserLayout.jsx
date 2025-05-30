import HeaderComponent from "../components/Header/HeaderComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import AutoScroll from "../components/AutoScroll/AutoScroll";

const UserLayout = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <main>{children}</main>
            <ScrollToTop />
            <AutoScroll />
            <FooterComponent />
        </>
    );
};

export default UserLayout;

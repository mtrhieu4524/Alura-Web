import HeaderComponent from "../components/Header/HeaderComponent";
import FooterComponent from "../components/Footer/FooterComponent";

const UserLayout = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            <main>{children}</main>
            <FooterComponent />
        </>
    );
};

export default UserLayout;

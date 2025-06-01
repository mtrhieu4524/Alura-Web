import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import logo from "../../assets/logo.png";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <header className="header">
            <div className="top_announcement">

                Free shipping nationwide in Vietnam for all orders. Order today for best service.
            </div>
            <div className="top_header container-fluid">
                <div
                    className="row align-items-center"
                    style={{ backgroundColor: "white" }}
                >
                    <div className="col-md-5 col-lg-5 col-sm-12">
                        <div className="contact_info">
                            <Link to="tel:0795795959">
                                <p className="contact_phone">
                                    <i className="fas fa-phone-alt"></i>0795 795 959
                                </p>
                            </Link>

                            <a
                                href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+FPT+TP.+HCM/@10.8411278,106.8092999,19z/data=!4m6!3m5!1s0x31752731176b07b1:0xb752b24b379bae5e!8m2!3d10.8411276!4d106.809883!16s%2Fg%2F11j2zx_fz_?entry=ttu"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p className="contact_address">
                                    <i className="fas fa-map-marker-alt"></i> D1 Street, Long
                                    Thanh My, Thu Duc City, Ho Chi Minh City
                                </p>
                            </a>
                        </div>
                    </div>
                    <div className="logo_container col-md-2 col-lg-2 col-sm-12 text-center">
                        <Link to="/">
                            <img className="logo" src={logo} alt="Logo" />
                        </Link>
                    </div>
                    <div className="col-md-5 col-lg-5 col-sm-12 text-end">
                        <div className="header_icons">
                            <div className="col-sm-12 search_section">
                                <div className="search_bar_container">
                                    <i className="fas fa-search search_icon"></i>
                                    <input
                                        type="text"
                                        className="search_bar"
                                        placeholder="Search by name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                navigate(`/search`);
                                                setSearchTerm("");
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <Link to="/cart" className="cart_icon">
                                <i className="icon_cart fas fa-shopping-bag"></i>
                            </Link>

                            <div className="account_dropdown_section">
                                <div className="dropdown-toggle-icon">
                                    <i className="icon_account fas fa-user"></i>
                                    <i className="fas fa-chevron-down arrow-icon"></i>
                                </div>

                                <div className="user-dropdown-menu">
                                    {isLoggedIn ? (
                                        <div className="user-logged-in">
                                            <div className="user-info">
                                                <div className="avatar-circle">NT</div>
                                                <p className="username">Nguyen Tran</p>
                                            </div>
                                            <Link to="/profile" className="user-dropdown-menu-link">
                                                <i className="fas fa-user-circle dropdown-icon"></i> Profile
                                            </Link>
                                            <Link to="/order-history" className="user-dropdown-menu-link">
                                                <i className="fas fa-history dropdown-icon"></i> Order history
                                            </Link>
                                            <Link to="/sign-in" className="user-dropdown-menu-link">
                                                <i className="fas fa-sign-in-alt dropdown-icon"></i> Sign out
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="user-not-logged-in">
                                            <Link to="/sign-in" className="user-dropdown-menu-link">
                                                <i className="fas fa-sign-in-alt dropdown-icon"></i>  Sign in
                                            </Link>
                                            <Link to="/sign-up" className="user-dropdown-menu-link">
                                                <i className="fas fa-user-plus dropdown-icon"></i> Sign up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse justify-content-center"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="home nav-link" to="/">
                                    HOME
                                </Link>
                            </li>
                            <li className="nav-item dropdown-cosmetics">
                                <Link className="home nav-link cosmetics-link" to="/cosmetic">
                                    COSMETIC
                                    <i className="cosmetics-arrow-icon fas fa-chevron-down arrow-icon"></i>
                                </Link>
                                <div className="cosmetics-dropdown">
                                    <div className="dropdown-column">
                                        <h6>Facial</h6>
                                        <p>Cleanser</p>
                                        <p>Toner</p>
                                        <p>Serum</p>
                                        <p>Face Mask</p>
                                        <p>Cream</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6>Hair</h6>
                                        <p>Shampoo</p>
                                        <p>Conditioner</p>
                                        <p>Hair Serum</p>
                                        <p>Hair Tonic</p>
                                        <p>Scalp Treatment</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6>Body</h6>
                                        <p>Body Lotion</p>
                                        <p>Body Wash</p>
                                        <p>Deodorant</p>
                                        <p>Sunscreen</p>
                                        <p>Body Scrub</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6>Lips & Nails</h6>
                                        <p>Lip Stick</p>
                                        <p>Lip Scrub</p>
                                        <p>Nail Strengthener</p>
                                        <p>Cuticle Oil</p>
                                        <p>Nail Treatment</p>
                                    </div>
                                    <div className="dropdown-viewall">
                                        <Link to="/cosmetic">View all →</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="nav-item dropdown-medical">
                                <Link className="home nav-link medical-link" to="/medical-treatment">
                                    MEDICAL & TREATMENT
                                    <i className="medical-arrow-icon fas fa-chevron-down arrow-icon"></i>
                                </Link>
                                <div className="medical-dropdown">
                                    <div className="dropdown-column">
                                        <h6>Medical Products</h6>
                                        <p>Body Lotion</p>
                                        <p>Body Wash</p>
                                        <p>Deodorant</p>
                                        <p>Sunscreen</p>
                                        <p>Body Scrub</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6> </h6>
                                        <p>Lip Balm</p>
                                        <p>Lip Scrub</p>
                                        <p>Nail Strengthener</p>
                                        <p>Cuticle Oil</p>
                                        <p>Nail Treatment</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6>Treatment Products</h6>
                                        <p>Cleanser</p>
                                        <p>Toner</p>
                                        <p>Serum</p>
                                        <p>Face Mask</p>
                                        <p>Cream</p>
                                    </div>
                                    <div className="dropdown-column">
                                        <h6> </h6>
                                        <p>Shampoo</p>
                                        <p>Conditioner</p>
                                        <p>Hair Serum</p>
                                        <p>Hair Tonic</p>
                                        <p>Scalp Treatment</p>
                                    </div>
                                    <div className="dropdown-viewall">
                                        <Link to="/medical-treatment">View all →</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="nav-item">
                                <Link className="home nav-link" to="/visual-search">
                                    VISUAL SEARCH
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="home nav-link" to="/faqs">
                                    FAQS
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="home nav-link" to="/introduce">
                                    INTRODUCE
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="home nav-link" to="/contact">
                                    CONTACT US
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;

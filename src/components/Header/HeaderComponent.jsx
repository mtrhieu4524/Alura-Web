import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Header/Header.css";
import logo from "../../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const { cartCount, setCartCount } = useCart();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        fetch(`${API_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.status === 401) {
              console.log("401 Unauthorized - Token may be expired or invalid");
              setIsLoggedIn(false);
              handleLogout();
              return null; // Return null to prevent further processing
            }

            if (!res.ok) {
              console.log(`HTTP Error: ${res.status} - ${res.statusText}`);
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            return res.json();
          })
          .then((data) => {
            if (data?.success) setUserInfo(data.user);
          })
          .catch((err) => console.error("Error fetching user profile:", err));

        fetchCartCount(token);
      } catch (err) {
        setIsLoggedIn(false);
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  const fetchCartCount = async (token) => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setCartCount(data?.items?.length || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    navigate(`/sign-in`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <header className="header">
      <div className="top_announcement">
        Free shipping nationwide in Vietnam for all orders. Order today for best
        service.
      </div>
      <div className="top_header container-fluid">
        <div
          className="row align-items-center"
          style={{ backgroundColor: "white" }}>
          <div className="col-md-5 col-lg-5 col-sm-12">
            <div className="contact_info">
              <Link to="tel:0795795959">
                <p className="contact_phone">
                  <i className="fas fa-phone-alt"></i>0795 795 959
                </p>
              </Link>
              <a
                href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+FPT+TP.+HCM"
                target="_blank"
                rel="noopener noreferrer">
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
              <Link to="/cart" className="cart_icon position-relative">
                <i className="icon_cart fas fa-shopping-bag"></i>
                {cartCount > 0 && (
                  <span className="cart_count_badge">{cartCount}</span>
                )}
              </Link>

              <div className="account_dropdown_section">
                <div className="dropdown-toggle-icon" onClick={toggleDropdown}>
                  <i className="icon_account fas fa-user"></i>
                  <i
                    className={`fas fa-chevron-down arrow-icon ${
                      isDropdownOpen ? "rotate" : ""
                    }`}></i>
                </div>

                <div
                  className={`user-dropdown-menu ${
                    isDropdownOpen ? "open" : ""
                  }`}>
                  {isLoggedIn ? (
                    <div className="user-logged-in">
                      <div className="user-info">
                        <p className="username">
                          {userInfo?.name || "User"} (
                          {userInfo?.email || "Email"})
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        state={{
                          userId: jwtDecode(localStorage.getItem("token"))
                            .userId,
                        }}
                        className="user-dropdown-menu-link">
                        <i className="fas fa-user-circle dropdown-icon"></i>{" "}
                        Profile
                      </Link>
                      <Link
                        to="/order-history"
                        className="user-dropdown-menu-link">
                        <i className="fas fa-history dropdown-icon"></i> Order
                        history
                      </Link>
                      <div
                        onClick={handleLogout}
                        className="user-dropdown-menu-link handle-logout"
                        style={{ cursor: "pointer" }}>
                        <i className="fas fa-sign-in-alt dropdown-icon"></i>{" "}
                        Sign out
                      </div>
                    </div>
                  ) : (
                    <div className="user-not-logged-in">
                      <Link to="/sign-in" className="user-dropdown-menu-link">
                        <i className="fas fa-sign-in-alt dropdown-icon"></i>{" "}
                        Sign in
                      </Link>
                      <Link to="/sign-up" className="user-dropdown-menu-link">
                        <i className="fas fa-user-plus dropdown-icon"></i> Sign
                        up
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
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="home nav-link" to="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item dropdown-cosmetics">
                <Link className="home nav-link cosmetics-link" to="/cosmetics">
                  COSMETICS
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
                    <Link to="/cosmetics">View all →</Link>
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

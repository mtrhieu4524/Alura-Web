import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/authen/Register.css";
import rightImage from "../../assets/r1.jpeg";
import rightImage2 from "../../assets/r2.jpg";
import rightImage3 from "../../assets/r3.jpg";
// import { getUserInfo, registerCustomerApi } from "../../services/UserService";
import { Link } from "react-router-dom";

const Register = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Alurà - Sign Up";
    }, []);


    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        const rememberedPassword = localStorage.getItem("rememberedPassword");

        const allCartItems = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("cartItems")) {
                allCartItems[key] = localStorage.getItem(key);
            }
        }

        localStorage.clear();
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        localStorage.removeItem("points");

        if (rememberedEmail && rememberedPassword) {
            localStorage.setItem("rememberedEmail", rememberedEmail);
            localStorage.setItem("rememberedPassword", rememberedPassword);
        }

        for (const key in allCartItems) {
            localStorage.setItem(key, allCartItems[key]);
        }
    }, []);

    useEffect(() => {
        const togglePassword = document.getElementById("togglePassword");
        const handleTogglePassword = () => {
            const password = document.getElementById("password");
            const type =
                password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            togglePassword.classList.toggle("fa-eye");
            togglePassword.classList.toggle("fa-eye-slash");
        };

        const toggleRePassword = document.getElementById("toggleRePassword");
        const handleToggleRePassword = () => {
            const rePassword = document.getElementById("re_password");
            const type =
                rePassword.getAttribute("type") === "password" ? "text" : "password";
            rePassword.setAttribute("type", type);
            toggleRePassword.classList.toggle("fa-eye");
            toggleRePassword.classList.toggle("fa-eye-slash");
        };

        togglePassword.addEventListener("click", handleTogglePassword);
        toggleRePassword.addEventListener("click", handleToggleRePassword);

        const modal = document.getElementById("tosModal");
        const btn = document.getElementById("tosLink");
        const span = document.getElementsByClassName("close")[0];

        btn.onclick = function (e) {
            e.preventDefault();
            modal.style.display = "block";
            document.body.classList.add("modal-open");
        };
        span.onclick = function () {
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        };
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
            }
        };

        const btnSuccessPopup = document.getElementById("successPopup");
        btnSuccessPopup.onclick = async function (e) {
            e.preventDefault();
            setLoading(true);
            const firstName = document.getElementById("first_name").value.trim();
            const lastName = document.getElementById("last_name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const rePassword = document.getElementById("re_password").value.trim();
            const tosCheckbox = document.getElementById("tos_checkbox");

            if (!firstName || !lastName || !email || !password || !rePassword) {
                toast.error("Please fill in all fields first.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }

            const isValidEmail = (email) => {
                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                return emailPattern.test(email);
            };

            const isValidPassword = (password) => {
                const passwordPattern =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
                return passwordPattern.test(password);
            };

            if (!isValidEmail(email)) {
                toast.error("Wrong email format! Please enter a valid email.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }

            if (!isValidPassword(password)) {
                toast.error(
                    "Password must be between 6 to 20 characters long and include lowercase with uppercase letter, number, and special character.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
                setLoading(false);
                return;
            }

            if (password !== rePassword) {
                toast.error("Passwords have to be the same! Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }

            if (!tosCheckbox.checked) {
                toast.error(
                    "Can not sign up if you do not agree with our terms of service.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
                setLoading(false);
                return;
            }

            try {
                const userInfoRes = await getUserInfo(email);
                if (userInfoRes && userInfoRes.data) {
                    toast.error(
                        "Email has been registered! Please use another email to sign up.",
                        {
                            position: "top-right",
                            autoClose: 3000,
                        }
                    );
                    setLoading(false);
                    return;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                } else {
                    setLoading(false);
                    return;
                }
            }

            const requestData = {
                firstName,
                lastName,
                email,
                password,
                accountType: "None",
            };

            try {
                const response = await registerCustomerApi(requestData);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = response.data;

                if (!result.success) {
                    toast.error(
                        result.message || "Registration failed. Please try again.",
                        {
                            position: "top-right",
                            autoClose: 3000,
                        }
                    );
                } else {
                    toast.success(
                        "Sign up successfully! You now can sign in with your account.",
                        {
                            position: "top-right",
                            autoClose: 3000,
                        }
                    );
                    window.location.href = "/login";
                }
            } catch (error) {
                toast.success(
                    "Sign up successfully! You now can sign in with your account.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                    }
                );
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        };

        return () => {
            togglePassword.removeEventListener("click", handleTogglePassword);
            toggleRePassword.removeEventListener("click", handleToggleRePassword);
        };
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear",
    };

    return (
        <div className="register_main_container container-fluid">
            <div className="row register_wrapper">
                {/* Left Side: register Form */}
                <div className="col-lg-6 col-md-6 col-sm-12 register_left_side">
                    <form className="sign_up_form">
                        <h3 className="sign_up_title">Sign up</h3>
                        {/* <div className="name_section">
                            <div className="name_section_row">
                                <div className="first_name_wrapper">
                                    <label className="first_name_label" htmlFor="first_name">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                                <div className="last_name_wrapper">
                                    <label className="last_name_label" htmlFor="last_name">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div className="email_section">
                            <label className="email_label" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="password_section mb-3 position-relative">
                            <label className="password_label" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                required
                            />
                            <span className="password_eye">
                                <i
                                    className="far fa-eye"
                                    id="togglePassword"
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>
                        <div className="re_password_section mb-3 position-relative">
                            <label className="password_label" htmlFor="re_password">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="re_password"
                                placeholder="Confirm password"
                                required
                            />
                            <span className="re_password_eye">
                                <i
                                    className="far fa-eye"
                                    id="toggleRePassword"
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>
                        <div className="term_of_service mb-3">
                            <input id="tos_checkbox" type="checkbox" />
                            <label style={{ fontSize: "13px" }} className="tos">
                                I agree with the{" "}
                                <Link className="tos_link" to="#" id="tosLink">
                                    Terms of Service & Privacy Policy
                                </Link>
                            </label>
                        </div>
                        <div className="submit_section">
                            <button
                                id="successPopup"
                                type="submit"
                                className="sign_up_button btn btn-block"
                                disabled={loading}
                            >
                                {loading && (
                                    <i
                                        className="fas fa-spinner fa-spin"
                                        style={{ marginRight: "5px" }}
                                    ></i>
                                )}
                                Sign up
                            </button>
                        </div>
                        <div className="sign_up_section">
                            <span>
                                Already have an account?{" "}
                                <Link className="sign_up_link" to="/sign-in">
                                    Sign in
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 register_right_side">
                    <Slider {...sliderSettings}>
                        <div>
                            <img
                                className="register_image"
                                src={rightImage}
                                alt="Ring photo"
                            />
                        </div>
                        <div>
                            <img
                                className="register_image"
                                src={rightImage2}
                                alt="Ring photo"
                            />
                        </div>
                        <div>
                            <img
                                className="register_image"
                                src={rightImage3}
                                alt="Model with jewelry photo"
                            />
                        </div>
                    </Slider>
                </div>
            </div>

            <div id="tosModal" className="modal">
                <div className="modal-content">
                    <span className="close" style={{ textAlign: "end" }}>
                        &times;
                    </span>
                    <h4 className="tos_title">Terms of Service & Privacy Policy</h4>
                    <p class="tos_introduce">
                        Welcome to Dian Jewelry! By signing up and creating an account on
                        our website, you agree to the following terms, conditions, and
                        privacy policy. You acknowledge that you have read and agree to our
                        Terms of Service & Privacy Policy. Thank you for your visit.
                    </p>

                    <p>
                        <strong>1. Introduction</strong>
                        <br />
                        We value your privacy and are committed to protecting your personal
                        information. This Privacy Policy outlines how we collect, use, and
                        protect your data.
                    </p>

                    <p>
                        <strong>2. Information We Collect</strong>
                        <br />
                        We collect information that you provide to us directly, such as when
                        you create an account, make a purchase, or contact us. This may
                        include your name, email address, phone number, shipping address,
                        and payment information. We also collect information automatically
                        as you navigate our site, including IP address, browser type, and
                        usage data.
                    </p>

                    <p>
                        <strong>3. How We Use Your Information</strong>
                        <br />
                        We use your information to provide and improve our services, process
                        transactions, communicate with you, and for marketing purposes. We
                        may also use your information to comply with legal obligations and
                        protect our rights.
                    </p>

                    <p>
                        <strong>4. Sharing Your Information</strong>
                        <br />
                        We do not sell your personal information. We may share your
                        information with third parties to facilitate our services, such as
                        payment processors, shipping companies, and marketing partners.
                        These third parties are obligated to protect your information and
                        use it only for the purposes we specify.
                    </p>

                    <p>
                        <strong>5. Data Security</strong>
                        <br />
                        We implement various security measures to protect your personal
                        information. However, no method of transmission over the internet or
                        electronic storage is 100% secure. We strive to use commercially
                        acceptable means to protect your data but cannot guarantee absolute
                        security.
                    </p>

                    <p>
                        <strong>6. Your Choices</strong>
                        <br />
                        You have the right to access, update, and delete your personal
                        information. You can manage your account settings or contact us to
                        make changes. You can also opt out of receiving promotional emails
                        by following the unsubscribe instructions in the emails.
                    </p>

                    <p>
                        <strong>7. Changes to This Policy</strong>
                        <br />
                        We may update this Privacy Policy periodically. Any changes will be
                        posted on our website, and your continued use of our services
                        constitutes acceptance of the updated policy.
                    </p>

                    <p>
                        <strong>8. Contact Us</strong>
                        <br />
                        If you have any questions or concerns about this Privacy Policy or
                        our data practices, please contact us at{" "}
                        <a href="/contact"> Alurà</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

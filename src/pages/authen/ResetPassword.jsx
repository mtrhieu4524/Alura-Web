import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import rightImage from "../../assets/r1.jpeg";
import rightImage2 from "../../assets/r2.jpg";
import rightImage3 from "../../assets/r3.jpg";
import "../../styles/authen/Login.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const code = location.state?.code || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Alurà - Reset Password";
        if (!email || !code) {
            // toast.error("Unauthorized! Redirecting to sign in page.");
            navigate("/sign-in");
        }
    }, [email, code, navigate]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear",
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error("Password must have at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${VITE_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, newPassword }),
            });

            if (response.ok) {
                toast.success("Password reset successfully!");
                navigate("/sign-in");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to reset password.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container main_container">
            <div className="row login_wrapper">
                <div className="col-lg-6 col-md-6 col-sm-12 left_side">
                    <form className="sign_in_form" onSubmit={handleResetPassword}>
                        <h3 className="sign_in_title">Reset Password</h3>

                        <div className="password_section mb-3 position-relative">
                            <label className="email_label" htmlFor="newPassword">New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                id="newPassword"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <span className="password_eye">
                                <i
                                    className={`far ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>

                        <div className="re_password_section mb-3 position-relative">
                            <label className="email_label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="re_password_eye">
                                <i
                                    className={`far ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    style={{ cursor: "pointer" }}
                                ></i>
                            </span>
                        </div>

                        <br />
                        <div className="submit_section">
                            <button type="submit" className="sign_in_button btn btn-block" disabled={loading}>
                                {loading && (
                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: "5px" }}></i>
                                )}
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 right_side">
                    <Slider {...sliderSettings}>
                        <div><img className="right_image" src={rightImage} alt="Ring photo" /></div>
                        <div><img className="right_image" src={rightImage2} alt="Ring photo" /></div>
                        <div><img className="right_image" src={rightImage3} alt="Ring photo" /></div>
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

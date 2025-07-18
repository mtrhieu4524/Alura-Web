import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import rightImage from "../../assets/r1.jpeg";
import rightImage2 from "../../assets/r2.jpg";
import rightImage3 from "../../assets/r3.jpg";
import "../../styles/authen/Login.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Alurà - Verify Code";
        if (!email) {
            // toast.error("Unauthorized! Redirecting to sign in page.");
            navigate("/sign-in");
        }
    }, [email, navigate]);

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

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${VITE_API_URL}/auth/verify-reset-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            if (response.ok) {
                navigate("/reset-password", { state: { email, code } });
            } else {
                toast.error("Verify code is incorrect.");
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
                    <form className="sign_in_form" onSubmit={handleVerifyCode}>
                        <h3 className="sign_in_title">Verify Code</h3>
                        <p className="under_sign_in_title">(Enter code received through email for reset password)</p>
                        <div className="email_section">
                            <label className="email_label" htmlFor="code">Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="code"
                                placeholder="Enter code"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="submit_section">
                            <button type="submit" className="sign_in_button btn btn-block" disabled={loading}>
                                {loading && <i className="fas fa-spinner fa-spin" style={{ marginRight: "5px" }}></i>}
                                Confirm
                            </button>
                        </div>
                        <div className="sign_up_section">
                            <span>Haven't received the code? <Link className="sign_up_link" to="/forget-password">Resend</Link></span>
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

export default VerifyCode;

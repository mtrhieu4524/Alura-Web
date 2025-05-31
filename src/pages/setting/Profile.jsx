import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../styles/setting/Profile.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import {
//     getUserInfo,
//     updateCustomerInfo,
//     changePasswordApi,
// } from "../../services/UserService";
// import { UserContext } from "../../services/UserContext";

function Profile() {
    const navigate = useNavigate();
    // const { user, setUser } = useContext(UserContext);
    const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tempFirstName, setTempFirstName] = useState(""); // Temporary state for form input
    const [tempLastName, setTempLastName] = useState(""); // Temporary state for form input
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [points, setPoints] = useState(0);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [storedPassword, setStoredPassword] = useState("");
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const storedEmail = localStorage.getItem("email");
    //     const isGoogle = localStorage.getItem("Google");
    //     setIsGoogleUser(Boolean(isGoogle));
    //     if (storedEmail) {
    //         getUserInfo(storedEmail)
    //             .then((response) => {
    //                 const userData = response.data;
    //                 setFirstName(userData.firstName || "");
    //                 setLastName(userData.lastName || "");
    //                 setTempFirstName(userData.firstName || ""); // Set temp state
    //                 setTempLastName(userData.lastName || ""); // Set temp state
    //                 setAddress(userData.address || "");
    //                 setPhoneNumber(userData.phoneNumber || "");
    //                 setEmail(userData.email || "");
    //                 setPoints(userData.points || 0);
    //                 setStoredPassword(userData.password || "");
    //                 setLoading(false);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching user data:", error);
    //                 setLoading(false);
    //             });
    //     }
    // }, []);

    useEffect(() => {
        document.title = "Alurà - Profile";
    }, []);

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Profile", link: "" },
    ];
    const menuItems = [
        {
            name: "Profile",
            path: "/profile",
            icon: "fas fa-user-edit",
            iconClass: "icon-edit-profile",
        },
        {
            name: "Order History",
            path: "/order-history",
            icon: "fas fa-history",
            iconClass: "icon-order-history",
        },
    ];

    const togglePasswordForm = () => {
        setPasswordFormVisible(!isPasswordFormVisible);
    };

    const togglePasswordVisibility = (id, eyeId) => {
        const passwordField = document.getElementById(id);
        const eyeIcon = document.getElementById(eyeId);
        const type =
            passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);
        eyeIcon.classList.toggle("fa-eye");
        eyeIcon.classList.toggle("fa-eye-slash");
    };

    const isValidPhoneNumber = (phone) => {
        const phonePattern = /^[0-9]{10,15}$/;
        return phonePattern.test(phone);
    };

    const isValidPassword = (password) => {
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
        return passwordPattern.test(password);
    };

    const handleSaveProfileChanges = async () => {
        if (!tempFirstName || !tempLastName) {
            toast.error(
                "Field cannot be empty! Please fill out all required fields.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
            return;
        }

        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
            toast.error("Phone number is invalid! Please try again.");
            return;
        }

        const updatedData = {
            email,
            password: storedPassword,
            lastName: tempLastName,
            firstName: tempFirstName,
            address,
            phoneNumber,
            points,
            status: true,
        };

        try {
            const response = await updateCustomerInfo(email, updatedData);
            if (response.status === 200) {
                toast.success("Profile has been updated successfully.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setFirstName(tempFirstName);
                setLastName(tempLastName);
                localStorage.setItem("firstName", tempFirstName);
                localStorage.setItem("lastName", tempLastName);
                setUser({
                    firstName: tempFirstName,
                    lastName: tempLastName,
                    email,
                    points,
                });
            }
        } catch (error) {
            toast.error("Failed to update profile! Please try again.");
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error(
                "Please fill in all fields. All password fields are required.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
            return;
        }

        if (!isValidPassword(newPassword)) {
            toast.error(
                "Password must be between 6 to 20 characters long and include lowercase with uppercase letter, number, and special character.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(
                "New password and confirm password do not match! Please try again.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
            return;
        }

        try {
            const changePasswordResponse = await changePasswordApi({
                email,
                oldPassword: currentPassword,
                newPassword: newPassword,
            });

            if (
                changePasswordResponse.data ===
                "Cannot update password due to password is not match."
            ) {
                toast.error("Current password is incorrect! Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else if (changePasswordResponse.data) {
                toast.success("Password has been changed successfully.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            toast.error("Failed to change password! Please try again.");
        }
    };

    return (
        <div className="Profile">
            <Breadcrumb items={navItems} />
            <div className="edit_profile_container">
                <div className="setting_menu">
                    <div className="setting_menu_section">
                        {/* <div className="setting_full_name">{`${firstName} ${lastName}`}</div> */}
                        <div className="setting_full_name">Nguyen Tran</div>
                        {/* <div className="setting_point">
                            <p>{`${points} points`}</p>
                        </div> */}
                    </div>
                    <div className="setting_menu_items">
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                className={`setting_menu_item ${item.path === "/profile" ? "profile-item" : ""
                                    }`}
                                onClick={() => navigate(item.path)}
                            >
                                <i
                                    className={`${item.icon} setting_menu_icon ${item.iconClass}`}
                                ></i>
                                <span className="setting_menu_item_name">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="edit_profile_form">
                    <h2>Profile Setting</h2>
                    <form>
                        <div className="edit_form_group full_width">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={tempFirstName}
                                onChange={(e) => setTempFirstName(e.target.value)}
                                disabled={isGoogleUser}
                                className={isGoogleUser ? "disabled_input" : ""}
                            />
                        </div>
                        <div className="edit_form_group">
                            <label>Email *</label>
                            <input
                                className="edit_email"
                                type="email"
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className="edit_form_group">
                            <label>Phone number</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="edit_form_group full_width">
                            <label>Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="edit_form_save_button"
                            onClick={handleSaveProfileChanges}
                        >
                            Save change
                        </button>
                    </form>

                    {!isGoogleUser && (
                        <>
                            <hr className="edit_profile_line"></hr>
                            <h2 onClick={togglePasswordForm} className="toggle_password_form">
                                Change Password
                                <i
                                    className={`fas ${isPasswordFormVisible ? "fa-chevron-up" : "fa-chevron-down"
                                        } toggle_icon`}
                                ></i>
                            </h2>
                            {isPasswordFormVisible && (
                                <form>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>Current password</label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className="far fa-eye"
                                                id="edit_current_password_eye"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "current_password",
                                                        "edit_current_password_eye"
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>New password</label>
                                        <input
                                            type="password"
                                            id="new_password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className="far fa-eye"
                                                id="edit_new_password_eye"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "new_password",
                                                        "edit_new_password_eye"
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <div className="edit_form_group full_width position-relative">
                                        <label>Confirm new password</label>
                                        <input
                                            type="password"
                                            id="confirm_password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span className="edit_password_eye">
                                            <i
                                                className="far fa-eye"
                                                id="edit_confirm_password_eye"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "confirm_password",
                                                        "edit_confirm_password_eye"
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="edit_form_save_button"
                                        onClick={handleChangePassword}
                                    >
                                        Save new password
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Profile;

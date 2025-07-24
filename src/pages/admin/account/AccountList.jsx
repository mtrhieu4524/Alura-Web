import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import "../../../styles/admin/account/AccountList.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function AccountList({ searchQuery }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const [updateForm, setUpdateForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const getUserId = (user) => user?.id || "";

    useEffect(() => {
        document.title = "Manage Account - Alurà System Management";
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const url = searchQuery
                ? `${API_URL}/profile?searchByEmail=${encodeURIComponent(searchQuery)}`
                : `${API_URL}/profile`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            const data = await response.json();

            if (data.success && data.users) setUsers(data.users);
            else toast.error("Failed to load user accounts");
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error loading accounts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            return toast.error("Password must be at least 8 characters.");
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            return toast.error("Phone number must be 10 digits.");
        }
        try {
            const res = await fetch(`${API_URL}/auth/register-staff`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Staff account created successfully.");
                setIsModalOpen(false);
                setFormData({ name: "", email: "", password: "", phone: "", address: "" });
                fetchUsers();
            } else toast.error(data.message || "Failed to create staff account.");
        } catch (err) {
            toast.error("An error occurred while creating the account.");
        }
    };

    const openUpdateModal = (user) => {
        setSelectedUser(user);
        setUpdateForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        if (updateForm.phone && !/^\d{10}$/.test(updateForm.phone)) {
            return toast.error("Phone number must be 10 digits.");
        }

        const userId = getUserId(selectedUser);
        if (!userId) return toast.error("User ID not found.");

        try {
            const res = await fetch(`${API_URL}/profile/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(updateForm),
            });
            if (res.ok) {
                toast.success("Account updated successfully!");
                fetchUsers();
                setIsUpdateModalOpen(false);
                setSelectedUser(null);
            } else toast.error("Failed to update user");
        } catch (error) {
            toast.error("Error updating user");
        }
    };

    const columns = ["Role", "Email", "Name", "Phone Number", "Address", "Update"];
    const adminData = users.filter(user => user.role === "ADMIN" || user.role === "STAFF");
    const userData = users.filter(user => user.role === "USER");

    const transformAdminData = (data) =>
        data.map((user) => ({
            role: user.role,
            email: user.email,
            name: user.name,
            phone_number: user.phone || "None",
            address: user.address || "None",
            update: (
                <i
                    className="fas fa-pen account_edit_icon"
                    onClick={() => openUpdateModal(user)}
                    style={{ cursor: "pointer" }}
                />
            ),
        }));

    const transformUserData = (data) =>
        data.map((user) => ({
            role: user.role,
            email: user.email,
            name: user.name,
            phone_number: user.phone || "None",
            address: user.address || "None",
        }));

    return (
        <div className="AccountList">
            <div className="account_list_container">
                <div className="account_list_header">
                    <h2 className="admin_main_title">Admin & Staff Accounts</h2>
                    <button className="add_account_btn" onClick={() => setIsModalOpen(true)}>
                        Add New Staff Account
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Table columns={columns} data={transformAdminData(adminData)} />
                        <div className="account_list_header">
                            <h2 className="admin_main_title" style={{ marginTop: "10px" }}>User Accounts</h2>
                        </div>
                        <Table columns={columns.slice(0, -1)} data={transformUserData(userData)} />
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h5>Add New Staff Account</h5>
                        <form className="product_form" onSubmit={handleSubmit}>
                            {["name", "email", "password", "phone", "address"].map((field) => (
                                <div className="form_group" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        type={field === "password" ? (showPassword ? "text" : "password") : "text"}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        required={field !== "phone" && field !== "address"}
                                    />
                                    {field === "password" && (
                                        <span className="admin_password_eye">
                                            <i
                                                className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => setShowPassword(prev => !prev)}
                                                style={{
                                                    position: "absolute", right: "35px", top: "45%",
                                                    transform: "translateY(-50%)", cursor: "pointer", color: "#999"
                                                }}
                                            />
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsUpdateModalOpen(false)}>×</button>
                        <h5>Update Account</h5>
                        <form className="product_form" onSubmit={handleUpdateUser}>
                            {["name", "email", "phone", "address"].map((field) => (
                                <div className="form_group" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        name={field}
                                        value={updateForm[field]}
                                        onChange={(e) => setUpdateForm({ ...updateForm, [field]: e.target.value })}
                                        required={field !== "phone" && field !== "address"}
                                        disabled={field === "email"}
                                    />
                                </div>
                            ))}
                            <div className="form_group">
                                <button type="submit" className="add_account_btn">Update Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountList;

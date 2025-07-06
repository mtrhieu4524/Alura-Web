import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/account/AccountList.css';

const API_URL = import.meta.env.VITE_API_URL;

function AccountList({ searchQuery }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Manage Account - Alurà System Management";
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const url = searchQuery
                    ? `${API_URL}/profile?searchByEmail=${encodeURIComponent(searchQuery)}`
                    : `${API_URL}/profile`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success && data.users) {
                    setUsers(data.users);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    const columns = ["Role", "Email", "Name", "Phone Number", "Address"];

    const adminData = users.filter(user => user.role === "ADMIN" || user.role === "ADMINISTRATOR");
    const userData = users.filter(user => user.role === "USER");

    const transformData = (data) =>
        data.map(user => ({
            role: user.role,
            email: user.email,
            name: user.name,
            phone_number: user.phone || "N/A",
            address: user.address || "N/A",
        }));

    return (
        <div className="AccountList">
            <div className="account_list_container">
                <div className="account_list_header">
                    <h2 className="admin_main_title">Admin & Staff Accounts</h2>
                    <button className="add_account_btn" onClick={() => setIsModalOpen(true)}>
                        Add New Account
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Table columns={columns} data={transformData(adminData)} />
                        <div className="account_list_header">
                            <h2 className="admin_main_title" style={{ marginTop: '10px' }}>User Accounts</h2>
                        </div>
                        <Table columns={columns} data={transformData(userData)} />
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h3>Add account modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountList;

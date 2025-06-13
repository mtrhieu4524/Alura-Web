import { useEffect, useState } from "react";
import Table from '../../../components/Table/Table';
import '../../../styles/admin/account/AccountList.css';

function AccountList() {
    useEffect(() => {
        document.title = "Account List - Alurà System Management";
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = ["Role", "Email", "Name", "Phone Number", "Birth"];

    const fakeData = [
        { email: "alice@example.com", name: "Alice Johnson", phone_number: "123-456-7890", birth: "1992-05-14", role: "Admin" },
        { email: "bob@example.com", name: "Bob Smith", phone_number: "987-654-3210", birth: "1988-11-02", role: "User" },
        { email: "carol@example.com", name: "Carol Danvers", phone_number: "555-123-4567", birth: "1995-09-23", role: "User" },
        { email: "alice@example.com", name: "Alice Johnson", phone_number: "123-456-7890", birth: "1992-05-14", role: "Admin" },
        { email: "bob@example.com", name: "Bob Smith", phone_number: "987-654-3210", birth: "1988-11-02", role: "User" },
        { email: "carol@example.com", name: "Carol Danvers", phone_number: "555-123-4567", birth: "1995-09-23", role: "User" },
        { email: "bob@example.com", name: "Bob Smith", phone_number: "987-654-3210", birth: "1988-11-02", role: "User" },
        { email: "carol@example.com", name: "Carol Danvers", phone_number: "555-123-4567", birth: "1995-09-23", role: "User" },
        { email: "carol@example.com", name: "Carol Danvers", phone_number: "555-123-4567", birth: "1995-09-23", role: "User" },
        { email: "carol@example.com", name: "Carol Danvers", phone_number: "555-123-4567", birth: "1995-09-23", role: "User" },
    ];

    const adminData = fakeData.filter(user => user.role === "Admin");
    const userData = fakeData.filter(user => user.role === "User");

    return (
        <div className="AccountList">
            <div className="account_list_container">
                <div className="account_list_header">
                    <h2 className="admin_main_title" >Admin & Staff Accounts</h2>
                    <button className="add_account_btn" onClick={() => setIsModalOpen(true)}>
                        Add New Account
                    </button>
                </div>
                <Table columns={columns} data={adminData} />

                <div className="account_list_header">
                    <h2 className="admin_main_title" style={{ marginTop: '10px' }}>User Accounts</h2>

                </div>
                <Table columns={columns} data={userData} />

            </div>

            {isModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <h3>Add Account Modal</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountList;

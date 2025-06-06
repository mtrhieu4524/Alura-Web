import { useEffect } from "react";
// import '../../styles/admin/Dashboard.css';

function AccountList() {

    useEffect(() => {
        document.title = "Account List - Alurà System Management";
    }, []);

    return (
        <div className="AccountList">
            <div className="account_list_container">
                <h2 className="admin_main_title">Account</h2>

            </div>
        </div>
    );
}

export default AccountList;

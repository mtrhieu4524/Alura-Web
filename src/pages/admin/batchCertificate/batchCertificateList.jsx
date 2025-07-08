import { useEffect, useState } from "react";
import '../../../styles/admin/batchCertificate/BatchCertificateList.css';

const API_URL = import.meta.env.VITE_API_URL;

function BatchCertificateList() {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [certificates, setCertificates] = useState([]);

    const [formData, setFormData] = useState({
        certificateCode: "",
        issueDate: "",
        issuedBy: "",
        fileUrl: "",
        note: ""
    });

    useEffect(() => {
        document.title = "Manage Batch Certificate - Alurà System Management";
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(`${API_URL}/batch-certificate`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCertificates(data);
            }
        } catch (error) {
            console.error("Failed to fetch batch certificates", error);
        }
    };

    const handleSaveCertificate = async () => {
        if (!formData.certificateCode || !formData.issueDate || !formData.issuedBy || !formData.fileUrl) {
            alert("Please fill in all required fields.");
            return;
        }

        if (selectedCertificate) {
            
            try {
                const res = await fetch(`${API_URL}/batch-certificate/${selectedCertificate._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const updated = await res.json();
                    setCertificates(prev =>
                        prev.map(c => (c._id === updated._id ? updated : c))
                    );
                    closeModal();
                } else {
                    console.error("Failed to update certificate");
                }
            } catch (error) {
                console.error("Failed to update certificate", error);
            }
        } else {
            
            try {
                const res = await fetch(`${API_URL}/batch-certificate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const newCertificate = await res.json();
                    setCertificates(prev => [...prev, newCertificate]);
                    closeModal();
                } else {
                    console.error("Failed to add certificate");
                }
            } catch (error) {
                console.error("Failed to add certificate", error);
            }
        }
    };

    const handleDeleteCertificate = async () => {
        if (!selectedCertificate) return;

        try {
            const res = await fetch(`${API_URL}/batch-certificate/${selectedCertificate._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCertificates(prev =>
                    prev.filter(c => c._id !== selectedCertificate._id)
                );
                setIsDeleteModalOpen(false);
                setSelectedCertificate(null);
            } else {
                console.error("Failed to delete certificate");
            }
        } catch (error) {
            console.error("Error deleting certificate", error);
        }
    };

    const openAddModal = () => {
        setSelectedCertificate(null);
        setFormData({
            certificateCode: "",
            issueDate: "",
            issuedBy: "",
            fileUrl: "",
            note: ""
        });
        setIsUpdateModalOpen(true);
    };

    const openEditModal = (certificate) => {
        setSelectedCertificate(certificate);
        setFormData({
            certificateCode: certificate.certificateCode,
            issueDate: certificate.issueDate ? certificate.issueDate.split("T")[0] : "",
            issuedBy: certificate.issuedBy,
            fileUrl: certificate.fileUrl,
            note: certificate.note || ""
        });
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCertificate(null);
        setFormData({
            certificateCode: "",
            issueDate: "",
            issuedBy: "",
            fileUrl: "",
            note: ""
        });
    };

    const columns = ["Certificate Code", "Issue Date", "Issued By", "File", "Note", "Action"];

    const tableData = certificates.map((certificate) => [
        certificate.certificateCode,
        certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A',
        certificate.issuedBy,
        <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer" key={certificate._id}>
            View File
        </a>,
        certificate.note,
        <div className="action_icons" key={certificate._id}>
            <i
                className="fas fa-pen edit_icon"
                title="Edit Certificate"
                onClick={() => openEditModal(certificate)}
            />
            <i
                className="fas fa-trash delete_icon"
                title="Delete Certificate"
                onClick={() => {
                    setSelectedCertificate(certificate);
                    setIsDeleteModalOpen(true);
                }}
            />
        </div>
    ]);

    return (
        <div className="BatchCertificateList">
            <div className="batch_certificate_list_container">
                <div className="batch_certificate_list_header">
                    <h2 className="admin_main_title">Manage Batch Certificate</h2>
                    <button className="add_batch_certificate_btn" onClick={openAddModal}>
                        Add New Certificate
                    </button>
                </div>

                {/* Table */}
                <table className="batch_certificate_table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add / Update Modal */}
            {isUpdateModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={closeModal}>×</button>
                        <h3>{selectedCertificate ? "Update Certificate" : "Add New Certificate"}</h3>

                        <div className="modal_form">
                            <input
                                type="text"
                                placeholder="Certificate Code"
                                value={formData.certificateCode}
                                onChange={(e) => setFormData({ ...formData, certificateCode: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Issue Date"
                                value={formData.issueDate}
                                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Issued By"
                                value={formData.issuedBy}
                                onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="File URL"
                                value={formData.fileUrl}
                                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Note"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />

                            <button className="save_btn" onClick={handleSaveCertificate}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal_content">
                        <button className="close_modal_btn" onClick={() => setIsDeleteModalOpen(false)}>×</button>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete <b>{selectedCertificate?.certificateCode}</b>?</p>
                        <button className="delete_btn" onClick={handleDeleteCertificate}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchCertificateList;

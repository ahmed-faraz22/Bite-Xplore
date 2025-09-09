import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/style/newsletter.css";

const Newsletter = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/users/getNewsletters");
            setSubmissions(res.data.data);
        } catch (err) {
            console.error("Error fetching submissions:", err);
            toast.error("Failed to load submissions ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this submission?")) return;

        try {
            await axios.delete(`http://localhost:4000/api/v1/users/deleteNewsletter/${id}`);
            setSubmissions((prev) => prev.filter((s) => s._id !== id));
            toast.success("Submission deleted ✅");
        } catch (err) {
            console.error("Error deleting submission:", err);
            toast.error("Failed to delete ❌");
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear ALL submissions?")) return;

        try {
            await axios.delete("http://localhost:4000/api/v1/users/clearNewsletters");
            setSubmissions([]);
            toast.success("All submissions cleared ✅");
        } catch (err) {
            console.error("Error clearing submissions:", err);
            toast.error("Failed to clear submissions ❌");
        }
    };

    if (loading) return <p>Loading submissions...</p>;

    return (
        <div className="newsletter-tab">
            <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Newsletter Submissions</h3>
                {submissions.length > 0 && (
                    <button className="clear-btn" onClick={handleClearAll}>
                        Clear All
                    </button>
                )}
            </div>

            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="newsletter-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s) => (
                                <tr key={s._id}>
                                    <td>{s.userName}</td>
                                    <td>{s.userEmail}</td>
                                    <td>{s.userSubject}</td>
                                    <td>{s.userMessage}</td>
                                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                                    <td>
                                        <MdDelete
                                            className="delete-icon"
                                            onClick={() => handleDelete(s._id)}
                                            style={{ cursor: "pointer", fontSize: "20px" }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Newsletter;
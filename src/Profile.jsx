
import React from "react";

function Profile({ isAdmin = false }) {

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
        return (
            <h2 style={{ textAlign: "center" }}>
                User profile not found. Please login again.
            </h2>
        );
    }

    return (
        <div className="profile-page">

            <style>{`
                * {
                    box-sizing: border-box;
                }

                .profile-page {
                    min-height: 90vh;
                    padding: 50px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #dbeafe, #ede9fe, #fce7f3);
                    font-family: Arial, sans-serif;
                }

                .profile-card {
                    width: 100%;
                    max-width: 520px;
                    background: white;
                    border-radius: 22px;
                    overflow: hidden;
                    box-shadow: 0 15px 45px rgba(30, 41, 59, 0.15);
                }

                .profile-header {
                    background: linear-gradient(135deg, #2563eb, #7c3aed);
                    padding: 35px 20px;
                    text-align: center;
                    color: white;
                }

                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 15px;
                    border-radius: 50%;
                    background: white;
                    color: #4f46e5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 42px;
                    font-weight: bold;
                    border: 5px solid rgba(255,255,255,0.6);
                    overflow: hidden;
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    display: block;
                }

                .profile-header h2 {
                    margin: 8px 0;
                    font-size: 25px;
                }

                .profile-header p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                }

                .profile-body {
                    padding: 28px;
                }

                .profile-title {
                    color: #1e293b;
                    font-size: 19px;
                    margin-bottom: 22px;
                }

                .profile-detail {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    padding: 15px 5px;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 14px;
                }

                .profile-detail span {
                    color: #64748b;
                    font-weight: 600;
                }

                .profile-detail strong {
                    color: #1e293b;
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .profile-status {
                    color: #15803d !important;
                    background: #dcfce7;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                }

                .profile-footer {
                    text-align: center;
                    padding: 18px;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 12px;
                }

                @media(max-width: 480px) {
                    .profile-body {
                        padding: 20px;
                    }

                    .profile-detail {
                        font-size: 13px;
                    }
                }
            `}</style>

            <div className="profile-card">

                <div className="profile-header">

                    <div className="profile-avatar">
                        {isAdmin ? (
                            <img src="/admin.png" alt="Admin" />
                        ) : (
                            user.name?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <h2>{user.name}</h2>

                    <p>Campus Connect Member</p>

                </div>

                <div className="profile-body">

                    <h3 className="profile-title">
                        👤 Personal Information
                    </h3>

                    <div className="profile-detail">
                        <span>Full Name</span>
                        <strong>{user.name}</strong>
                    </div>

                    <div className="profile-detail">
                        <span>Email Address</span>
                        <strong>{user.email}</strong>
                    </div>

                    <div className="profile-detail">
                        <span>Phone Number</span>
                        <strong>{user.phone}</strong>
                    </div>

                    <div className="profile-detail">
                        <span>Year of Joining</span>
                        <strong>{user.yearOfJoining}</strong>
                    </div>

                    <div className="profile-detail">
                        <span>Role</span>
                        <strong>{user.role?.toUpperCase()}</strong>
                    </div>

                    <div className="profile-detail">
                        <span>Account Status</span>
                        <strong className="profile-status">
                            {user.status?.toUpperCase()}
                        </strong>
                    </div>

                </div>

                <div className="profile-footer">
                    © Campus Connect | Learn · Connect · Grow
                </div>

            </div>

        </div>
    );
}

export default Profile;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ViewClub() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userid");
  const role = localStorage.getItem("role");

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // Image URL
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return `http://localhost:8000${image}`;
    return `http://localhost:8000/clubs/${image}`;
  };

  // Fetch club details
  const fetchClub = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8000/club/viewClub/${id}`
      );

      setClub(res.data.club || res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to load club.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  // Creator checking
  const creatorId = club?.createdBy?._id || club?.createdBy;

  const isCreator =
    creatorId?.toString() === userId?.toString();

  // Member checking
  const members = club?.members || [];

  const isMember = members.some((member) => {
    const memberId = member?._id || member;
    return memberId?.toString() === userId?.toString();
  });

  // Permissions
  const canDelete =
    role === "admin" ||
    (role === "student" && isCreator);

  const canJoin =
    role === "student" &&
    !isCreator &&
    !isMember &&
    club?.status === "active";

  const canLeave =
    role === "student" &&
    isMember &&
    !isCreator &&
    club?.status === "active";

  // Join Club
  const handleJoinClub = async () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      setActionLoading(true);

      const res = await axios.post(
        `http://localhost:8000/club/joinClub/${id}`,
        { userId, role }
      );

      alert(res.data.message || "Joined successfully!");
      await fetchClub();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to join club.");
    } finally {
      setActionLoading(false);
    }
  };

  // Leave Club
  const handleLeaveClub = async () => {
    if (!window.confirm("Are you sure you want to leave this club?")) {
      return;
    }

    try {
      setActionLoading(true);

      const res = await axios.delete(
        `http://localhost:8000/club/leaveClub/${id}`,
        {
          data: { userId, role }
        }
      );

      alert(res.data.message || "You left the club.");
      await fetchClub();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to leave club.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Club with reason popup
  const handleDeleteClub = async () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    const reason = window.prompt(
      "Enter the reason for deleting this club:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Deletion reason is required!");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this club?\n\nReason: ${reason.trim()}`
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);

      const res = await axios.delete(
        `http://localhost:8000/club/deleteClub/${id}`,
        {
          data: {
            userId,
            role,
            deletionReason: reason.trim()
          }
        }
      );

      alert(res.data.message || "Club deleted successfully!");
      navigate("/allClub");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete club.");
    } finally {
      setActionLoading(false);
    }
  };

  // OPEN REPORT POPUP
  const handleOpenReport = () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    if (role !== "student") {
      alert("Only students can report a club.");
      return;
    }

    setReportMessage("");
    setShowReportModal(true);
  };

  // SUBMIT CLUB REPORT
  const handleReportClub = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first.");
      return;
    }

    if (!reportMessage.trim()) {
      alert("Please enter a report message.");
      return;
    }

    try {
      setReportLoading(true);

      const res = await axios.post(
        "http://localhost:8000/club/reportClub",
        {
          clubId: id,
          studentId: userId,
          ReportMessage: reportMessage.trim()
        }
      );

      alert(res.data.message || "Report submitted successfully!");

      setReportMessage("");
      setShowReportModal(false);

    } catch (error) {
      console.error("Report club error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to submit report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="club-loading">
        <div className="club-loader"></div>
        <h3>Loading Club...</h3>

        <style>{`
          .club-loading {
            min-height: 100vh;
            background: #0f172a;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial;
          }

          .club-loader {
            width: 55px;
            height: 55px;
            border: 5px solid #334155;
            border-top-color: #a78bfa;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="club-loading">
        <h2>Club Not Found</h2>
        <button onClick={() => navigate("/allClub")}>
          Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div className="club-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        .club-page {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #ff9a9e,
            #fad0c4,
            #fbc2eb,
            #a6c1ee,
            #84fab0,
            #f6d365
          );
          background-size: 400% 400%;
          animation: rainbowBackground 12s ease infinite;
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #20243a;
          padding-bottom: 40px;
        }

        @keyframes rainbowBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .back-club-wrapper {
          max-width: 1150px;
          margin: auto;
          padding: 25px 20px 0;
        }

        .back-club-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(
            90deg,
            #ff512f,
            #dd2476,
            #8e44ad,
            #4776e6
          );
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 5px 15px rgba(100, 50, 150, 0.25);
        }

        .back-club-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(100, 50, 150, 0.35);
        }

        .club-container {
          max-width: 1150px;
          margin: 25px auto 35px;
          padding: 0 20px;
        }

        .club-hero {
          position: relative;
          height: 400px;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, #312e81, #7c3aed, #06b6d4);
          box-shadow: 0 15px 40px rgba(49, 46, 129, 0.2);
        }

        .club-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .club-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(15, 23, 42, 0.85),
            rgba(15, 23, 42, 0.35),
            rgba(15, 23, 42, 0.05)
          );
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 55px;
          color: white;
        }

        .club-tag {
          display: inline-block;
          width: fit-content;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 9px 17px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(10px);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .club-hero-overlay h1 {
          font-size: clamp(32px, 5vw, 52px);
          margin: 18px 0 10px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .club-hero-overlay p {
          max-width: 550px;
          color: #e2e8f0;
          font-size: 16px;
          line-height: 1.7;
          margin: 0;
        }

        .club-status {
          position: absolute;
          right: 25px;
          top: 25px;
          background: #dcfce7;
          color: #15803d;
          padding: 10px 18px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .club-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: -35px;
          position: relative;
          z-index: 2;
          padding: 0 30px;
        }

        .club-stat-card {
          background: white;
          padding: 24px;
          border-radius: 17px;
          display: flex;
          align-items: center;
          gap: 17px;
          box-shadow: 0 8px 30px rgba(20, 20, 50, 0.09);
          transition: 0.3s;
        }

        .club-stat-card:hover {
          transform: translateY(-5px);
        }

        .club-stat-icon {
          width: 55px;
          height: 55px;
          border-radius: 15px;
          background: #eeecff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .club-stat-card h2 {
          margin: 0;
          font-size: 23px;
          color: #252044;
        }

        .club-stat-card p {
          margin: 5px 0 0;
          color: #888ba0;
          font-size: 13px;
        }

        .club-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 25px;
          margin-top: 35px;
        }

        .club-panel {
          background: white;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 5px 25px rgba(20, 20, 50, 0.04);
          margin-bottom: 22px;
        }

        .club-panel h2 {
          font-size: 20px;
          margin: 0 0 20px;
          color: #282344;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .club-panel h2 span {
          font-size: 22px;
        }

        .club-description {
          color: #70748a;
          font-size: 15px;
          line-height: 1.9;
          white-space: pre-wrap;
        }

        .club-rules {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .club-rules li {
          padding: 12px 15px;
          background: #f8f7ff;
          border-radius: 9px;
          margin-bottom: 10px;
          color: #62647b;
          font-size: 14px;
        }

        .club-rules li::before {
          content: "✓";
          color: #6d5ce7;
          font-weight: bold;
          margin-right: 10px;
        }

        .club-creator {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f8f7ff;
          padding: 17px;
          border-radius: 13px;
        }

        .club-avatar {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #6254e7, #a855f7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
        }

        .club-creator-info {
          flex: 1;
          min-width: 0;
        }

        .club-creator-info h4 {
          margin: 0 0 5px;
          color: #282344;
        }

        .club-creator-info p {
          margin: 0;
          color: #9294a7;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .club-you {
          color: #16834c;
          background: #dcfce7;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .club-member-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .club-member {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #f0eff7;
          border-radius: 12px;
          transition: 0.2s;
        }

        .club-member:hover {
          background: #f9f8ff;
          border-color: #d9d3ff;
        }

        .club-member-info {
          flex: 1;
          min-width: 0;
        }

        .club-member-info h4 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #282344;
        }

        .club-member-info p {
          margin: 0;
          font-size: 12px;
          color: #9294a7;
          overflow-wrap: anywhere;
        }

        .club-role {
          font-size: 10px;
          font-weight: bold;
          color: #6754d8;
          background: #eeecff;
          padding: 6px 9px;
          border-radius: 20px;
        }

        .club-empty {
          background: #f8f7ff;
          color: #85879b;
          padding: 20px;
          text-align: center;
          border-radius: 12px;
          font-size: 14px;
        }

        .club-action-panel {
          background: linear-gradient(135deg, #312e81, #6548d8);
          color: white;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 10px 25px rgba(91, 75, 219, 0.18);
        }

        .club-action-panel h2 {
          margin: 0 0 10px;
          font-size: 21px;
        }

        .club-action-panel p {
          color: #dedaff;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .club-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .club-btn {
          width: 100%;
          border: none;
          padding: 14px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s;
        }

        .club-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .club-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .club-btn-join {
          background: #4ade80;
          color: #14532d;
        }

        .club-btn-leave {
          background: #fbbf24;
          color: #78350f;
        }

        .club-btn-delete {
          background: #fb7185;
          color: #881337;
        }

        /* NEW REPORT BUTTON */
        .club-btn-report {
          background: #f97316;
          color: white;
        }

        .club-btn-report:hover {
          background: #ea580c;
        }

        .club-member-status {
          text-align: center;
          padding: 13px;
          background: rgba(255,255,255,0.14);
          border-radius: 10px;
          font-size: 13px;
          color: white;
          font-weight: 600;
        }

        /* REPORT MODAL */
        .report-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .report-modal {
          background: white;
          width: 100%;
          max-width: 480px;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: reportPopup 0.25s ease;
        }

        @keyframes reportPopup {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .report-modal h2 {
          margin: 0 0 8px;
          color: #312e81;
          font-size: 23px;
        }

        .report-modal p {
          color: #77788b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .report-modal textarea {
          width: 100%;
          min-height: 130px;
          resize: vertical;
          padding: 14px;
          border: 1px solid #d9d6e8;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          color: #282344;
        }

        .report-modal textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .report-modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .report-modal-btn {
          flex: 1;
          border: none;
          padding: 13px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          font-size: 14px;
        }

        .report-submit {
          background: #dc2626;
          color: white;
        }

        .report-cancel {
          background: #eeeef5;
          color: #44445a;
        }

        .report-modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .club-footer {
          margin-top: 45px;
          padding: 25px;
          text-align: center;
          color: #4b386d;
          font-size: 13px;
        }

        @media(max-width: 800px) {
          .club-layout {
            grid-template-columns: 1fr;
          }

          .club-stats {
            padding: 0 10px;
          }

          .club-stat-card {
            padding: 15px;
          }

          .club-stat-icon {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }
        }

        @media(max-width: 550px) {
          .back-club-wrapper {
            padding: 18px 12px 0;
          }

          .club-container {
            padding: 0 12px;
            margin-top: 20px;
          }

          .club-hero {
            height: 300px;
            border-radius: 17px;
          }

          .club-hero-overlay {
            padding: 22px;
          }

          .club-hero-overlay h1 {
            font-size: 32px;
          }

          .club-hero-overlay p {
            font-size: 13px;
          }

          .club-status {
            top: 12px;
            right: 12px;
            padding: 7px 11px;
          }

          .club-stats {
            grid-template-columns: 1fr;
            margin-top: 15px;
            padding: 0;
            gap: 12px;
          }

          .club-stat-card {
            padding: 15px;
          }

          .club-panel,
          .club-action-panel {
            padding: 20px;
          }

          .club-layout {
            margin-top: 20px;
          }

          .report-modal {
            padding: 22px;
          }

          .report-modal-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* BACK TO CLUBS */}
      <div className="back-club-wrapper">
        <button
          className="back-club-btn"
          onClick={() => navigate("/allClub")}
        >
          ← Back to Clubs
        </button>
      </div>

      <main className="club-container">

        {/* HERO SECTION */}
        <section className="club-hero">

          {club.image && (
            <img
              src={getImageUrl(club.image)}
              alt={club.clubName}
              className="club-hero-image"
            />
          )}

          <div className="club-hero-overlay">
            <span className="club-tag">
              {club.category || "Campus Club"}
            </span>

            <h1>{club.clubName}</h1>

            <p>
              {club.description ||
                "Discover, connect and grow together with our campus community."}
            </p>
          </div>

          <span className="club-status">
            {club.status || "Active"}
          </span>

        </section>

        {/* STATISTICS */}
        <section className="club-stats">

          <div className="club-stat-card">
            <div className="club-stat-icon">👥</div>
            <div>
              <h2>{members.length}</h2>
              <p>Club Members</p>
            </div>
          </div>

          <div className="club-stat-card">
            <div className="club-stat-icon">🏆</div>
            <div>
              <h2>{club.category || "General"}</h2>
              <p>Club Category</p>
            </div>
          </div>

          <div className="club-stat-card">
            <div className="club-stat-icon">✨</div>
            <div>
              <h2>{club.status || "Active"}</h2>
              <p>Current Status</p>
            </div>
          </div>

        </section>

        {/* MAIN CONTENT */}
        <div className="club-layout">

          {/* LEFT COLUMN */}
          <div>

            {/* About */}
            <section className="club-panel">
              <h2>
                <span>📖</span> About This Club
              </h2>

              <p className="club-description">
                {club.description || "No description available."}
              </p>
            </section>

            {/* Rules */}
            <section className="club-panel">
              <h2>
                <span>📋</span> Club Rules
              </h2>

              {Array.isArray(club.rules) && club.rules.length > 0 ? (
                <ul className="club-rules">
                  {club.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              ) : (
                <p className="club-description">
                  {club.rules || "No rules added yet."}
                </p>
              )}
            </section>

            {/* Members */}
            <section className="club-panel">
              <h2>
                <span>🤝</span> Our Community Members
              </h2>

              {members.length > 0 ? (
                <div className="club-member-list">

                  {members.map((member, index) => {
                    const name = member?.name || "Club Member";
                    const email = member?.email || "Email unavailable";

                    return (
                      <div
                        className="club-member"
                        key={member?._id || index}
                      >
                        <div className="club-avatar">
                          {name.charAt(0).toUpperCase()}
                        </div>

                        <div className="club-member-info">
                          <h4>{name}</h4>
                          <p>{email}</p>
                        </div>

                        {member?._id?.toString() ===
                          creatorId?.toString() && (
                          <span className="club-role">
                            CREATOR
                          </span>
                        )}

                        {member?._id?.toString() ===
                          userId?.toString() && (
                          <span className="club-you">
                            YOU
                          </span>
                        )}
                      </div>
                    );
                  })}

                </div>
              ) : (
                <div className="club-empty">
                  No members have joined this club yet.
                </div>
              )}
            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div>

            {/* Creator */}
            <section className="club-panel">
              <h2>
                <span>👤</span> Club Organizer
              </h2>

              <div className="club-creator">

                <div className="club-avatar">
                  {(club.createdBy?.name || "U")
                    .charAt(0).toUpperCase()}
                </div>

                <div className="club-creator-info">
                  <h4>
                    {club.createdBy?.name || "Club Creator"}
                  </h4>

                  <p>
                    {club.createdBy?.email || "Email unavailable"}
                  </p>
                </div>

                {isCreator && (
                  <span className="club-you">YOU</span>
                )}

              </div>
            </section>

            {/* Actions */}
            <section className="club-action-panel">

              <h2>Become a Part of Us!</h2>

              <p>
                Connect with fellow students, share your
                interests and participate in exciting club activities.
              </p>

              <div className="club-actions">

                {canJoin && (
                  <button
                    className="club-btn club-btn-join"
                    onClick={handleJoinClub}
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Please wait..."
                      : "＋ Join This Club"}
                  </button>
                )}

                {canLeave && (
                  <button
                    className="club-btn club-btn-leave"
                    onClick={handleLeaveClub}
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Please wait..."
                      : "↩ Leave Club"}
                  </button>
                  
                )}

                {isMember && !isCreator && role === "student" && (
                  <div className="club-member-status">
                    ✓ You are already a member!
                  </div>
                )}

                {isCreator && role === "student" && (
                  <div className="club-member-status">
                    ⭐ You are the club creator!
                  </div>
                )}

                {role === "admin" && (
                  <div className="club-member-status">
                    🛡 Administrator Access
                  </div>
                )}

                {canDelete && (
                  <button
                    className="club-btn club-btn-delete"
                    onClick={handleDeleteClub}
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Please wait..."
                      : "🗑 Delete This Club"}
                  </button>
                )}

                {/* NEW: REPORT CLUB BUTTON */}
                {role === "student" && (
                  <button
                    className="club-btn club-btn-report"
                    onClick={handleOpenReport}
                    disabled={reportLoading}
                  >
                    🚩 Report This Club
                  </button>
                  
                )}
                                  <button
                      onClick={() => navigate(`/clubChat/${club._id}`)}
                      style={{
                          background: "#054941",
                          color: "white",
                          padding: "12px 25px",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold"
                      }}
                  >
                      💬 Club Chat
                  </button>

              </div>
            </section>

          </div>

        </div>

      </main>

      {/* REPORT CLUB POPUP */}
      {showReportModal && (
        <div
          className="report-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !reportLoading) {
              setShowReportModal(false);
            }
          }}
        >
          <div className="report-modal">

            <h2>🚩 Report This Club</h2>

            <p>
              Please explain why you are reporting
              <strong> {club.clubName}</strong>.
              Your report will be submitted to the administrator
              for review.
            </p>

            <form onSubmit={handleReportClub}>

              <textarea
                placeholder="Enter your reason for reporting this club..."
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                maxLength={1000}
                required
              />

              <div style={{
                textAlign: "right",
                color: "#9294a7",
                fontSize: "12px",
                marginTop: "7px"
              }}>
                {reportMessage.length}/1000 characters
              </div>

              <div className="report-modal-actions">

                <button
                  type="button"
                  className="report-modal-btn report-cancel"
                  onClick={() => setShowReportModal(false)}
                  disabled={reportLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="report-modal-btn report-submit"
                  disabled={reportLoading || !reportMessage.trim()}
                >
                  {reportLoading
                    ? "Submitting..."
                    : "🚩 Submit Report"}
                </button>
                

              </div>

            </form>

          </div>
        </div>
      )}

      <footer className="club-footer">
        © 2026 Campus Connect. Connecting Students, Building Communities.
      </footer>

    </div>
  );
}

export default ViewClub;

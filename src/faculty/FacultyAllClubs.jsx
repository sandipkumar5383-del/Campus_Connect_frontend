
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

function FacultyAllClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchClubs();
  }, []);

  // Fetch all clubs
  async function fetchClubs() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/api/allClub`);

      const clubData = Array.isArray(response.data)
        ? response.data
        : response.data.clubs || [];

      setClubs(clubData);
    } catch (err) {
      console.error("Fetch clubs error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load clubs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Image URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const imageName = image.split(/[\\/]/).pop();
    return `${API_URL}/clubs/${imageName}`;
  };

  // Delete club - Admin only, minimum 5 reports
  const handleDeleteClub = async (clubId, clubName, reportCount) => {
    if (role !== "admin") {
      alert("Only administrators can delete clubs.");
      return;
    }

    if (reportCount < 5) {
      alert("A club must have at least 5 reports before deletion.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${clubName}"?\n\nThis club has ${reportCount} reports.\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(clubId);

      await axios.delete(`${API_URL}/api/deleteClub/${clubId}`);

      setClubs((previousClubs) =>
        previousClubs.filter((club) => club._id !== clubId)
      );

      alert("Club deleted successfully!");
    } catch (err) {
      console.error("Delete club error:", err);
      alert(
        err.response?.data?.message ||
        "Unable to delete club. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Category list
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(clubs.map((club) => club.category).filter(Boolean))
    ];
  }, [clubs]);

  // Search and category filtering
  const filteredClubs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return clubs.filter((club) => {
      const matchesSearch =
        (club.clubName || "").toLowerCase().includes(searchText) ||
        (club.description || "").toLowerCase().includes(searchText) ||
        (club.category || "").toLowerCase().includes(searchText) ||
        (club.createdBy?.name || "").toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        club.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [clubs, search, selectedCategory]);

  // Total memberships
  const totalMemberships = useMemo(() => {
    return clubs.reduce(
      (total, club) => total + (club.members?.length || 0),
      0
    );
  }, [clubs]);

  // Total reports (calculated from reports returned by backend)
  const totalReports = useMemo(() => {
    return clubs.reduce(
      (total, club) => total + (Number(club.reports) || 0),
      0
    );
  }, [clubs]);

  // Clubs requiring moderation
  const flaggedClubs = useMemo(() => {
    return clubs.filter(
      (club) => (Number(club.reports) || 0) >= 5
    ).length;
  }, [clubs]);

  // Initials
  const getInitials = (name) => {
    return (name || "C").trim().charAt(0).toUpperCase();
  };

  // Category icons
  const getCategoryIcon = (category) => {
    const icons = {
      Technical: "⌘",
      Cultural: "✧",
      Sports: "⚡",
      Literary: "✎",
      Photography: "◎",
      Entrepreneurship: "↗",
      Other: "✦"
    };

    return icons[category] || "✦";
  };

  // Report styling
  const getReportStyle = (reportCount) => {
    const count = Math.min(
      Math.max(Number(reportCount) || 0, 0),
      5
    );

    if (count >= 5) return {};

    return {
      backgroundColor: `rgba(239, 68, 68, ${count * 0.055})`,
      border: `1px solid rgba(220, 38, 38, ${count * 0.12})`
    };
  };

  return (
    <div className="clubs-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .clubs-page {
          min-height: 100vh;
          padding: 35px 5%;
          font-family: "Segoe UI", Arial, sans-serif;
          color: #172033;
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
          animation: clubsRainbow 12s ease infinite;
          overflow: hidden;
        }

        @keyframes clubsRainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .clubs-page-inner {
          max-width: 1250px;
          margin: auto;
        }

        .clubs-decoration {
          position: fixed;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: .25;
          pointer-events: none;
        }

        .clubs-decoration-one {
          top: 5%;
          left: -150px;
          background: #ff4d8d;
        }

        .clubs-decoration-two {
          right: -150px;
          bottom: 5%;
          background: #4776e6;
        }

        .clubs-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
          color: #172b50;
          font-size: 19px;
          font-weight: 750;
        }

        .clubs-brand-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          color: white;
          background: #172b50;
          font-size: 25px;
        }

        .clubs-brand strong {
          color: #9b6c12;
        }

        .clubs-brand-divider {
          width: 1px;
          height: 25px;
          background: #172b5060;
        }

        .clubs-brand-section {
          color: #596579;
          font-size: 13px;
        }

        .clubs-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          min-height: 350px;
          padding: 55px;
          overflow: hidden;
          border-radius: 25px;
          color: white;
          background: linear-gradient(
            125deg,
            #101b35,
            #172b50,
            #263e64
          );
          box-shadow: 0 20px 45px #101b3535;
        }

        .clubs-hero-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .clubs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border: 1px solid #ffffff35;
          border-radius: 30px;
          color: #f5d98b;
          background: #ffffff12;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 1.5px;
        }

        .clubs-eyebrow-dot,
        .clubs-caption-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #84fab0;
        }

        .clubs-hero h1 {
          margin: 25px 0 18px;
          color: white;
          font-size: clamp(35px, 5vw, 55px);
          line-height: 1.15;
          font-weight: 900;
        }

        .clubs-hero h1 span {
          color: #f5d98b;
        }

        .clubs-hero p {
          max-width: 570px;
          color: #cbd5e1;
          font-size: 15px;
          line-height: 1.8;
        }

        .clubs-hero-stats {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-top: 28px;
        }

        .clubs-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .clubs-stat-number {
          color: #f5d98b;
          font-size: 27px;
          font-weight: 900;
        }

        .clubs-stat-label {
          color: #cbd5e1;
          font-size: 12px;
        }

        .clubs-stat-divider {
          width: 1px;
          height: 42px;
          background: #ffffff35;
        }

        .clubs-hero-art {
          position: relative;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: 290px;
          height: 270px;
        }

        .clubs-art-orbit {
          position: absolute;
          border: 1px solid #f5d98b55;
          border-radius: 50%;
        }

        .orbit-one {
          width: 235px;
          height: 235px;
        }

        .orbit-two {
          width: 175px;
          height: 175px;
          border-style: dashed;
          animation: orbitRotate 20s linear infinite;
        }

        @keyframes orbitRotate {
          to { transform: rotate(360deg); }
        }

        .clubs-art-center {
          display: grid;
          place-items: center;
          width: 105px;
          height: 105px;
          border: 1px solid #f5d98b;
          border-radius: 30px;
          color: #172b50;
          background: linear-gradient(135deg, #fff3c4, #e9bc56);
          box-shadow: 0 0 45px #f5d98b55;
          font-size: 65px;
          transform: rotate(-8deg);
        }

        .clubs-art-bubble {
          position: absolute;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid #ffffff40;
          border-radius: 15px;
          color: white;
          background: #ffffff20;
          font-size: 25px;
          backdrop-filter: blur(8px);
        }

        .bubble-one { top: 12px; left: 55px; }
        .bubble-two { top: 70px; right: 8px; }
        .bubble-three { bottom: 25px; left: 30px; }
        .bubble-four { right: 45px; bottom: 20px; }

        .clubs-art-caption {
          position: absolute;
          right: 20px;
          bottom: -5px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f5d98b;
          font-size: 12px;
          font-weight: 700;
        }

        .admin-club-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 28px 0;
        }

        .admin-summary-card {
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 23px;
          border: 1px solid #e5e8ef;
          border-radius: 15px;
          background: white;
          box-shadow: 0 7px 22px #1720330b;
          transition: .25s;
        }

        .admin-summary-card:hover {
          transform: translateY(-5px);
        }

        .admin-summary-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 55px;
          height: 55px;
          border-radius: 15px;
          color: #172b50;
          background: #fff3cf;
          font-size: 27px;
        }

        .admin-summary-card span {
          display: block;
          margin-bottom: 5px;
          color: #788196;
          font-size: 13px;
          font-weight: 650;
        }

        .admin-summary-card strong {
          color: #172b50;
          font-size: 29px;
          font-weight: 900;
        }

        .admin-summary-danger .admin-summary-icon {
          color: #b91c1c;
          background: #fee2e2;
        }

        .admin-summary-danger strong {
          color: #dc2626;
        }

        .clubs-discover {
          margin-top: 55px;
        }

        .clubs-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .clubs-section-kicker {
          color: #9b6c12;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .clubs-section-heading h2 {
          margin: 9px 0;
          color: #172b50;
          font-size: 32px;
          font-weight: 900;
        }

        .clubs-section-heading p {
          margin: 0;
          color: #596579;
          font-size: 14px;
        }

        .create-club-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 21px;
          border: none;
          border-radius: 10px;
          color: white;
          background: #172b50;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          transition: .25s;
        }

        .create-club-btn:hover {
          background: #9b6c12;
          transform: translateY(-3px);
          box-shadow: 0 8px 18px #172b5030;
        }

        .create-club-plus {
          font-size: 22px;
          line-height: 1;
        }

        .clubs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .clubs-search {
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(100%, 650px);
          padding: 0 17px;
          border: 1px solid #e1e5ec;
          border-radius: 12px;
          color: #788196;
          background: white;
          box-shadow: 0 5px 18px #1720330a;
        }

        .clubs-search:focus-within {
          border-color: #c39b38;
          box-shadow: 0 0 0 4px #c39b3818;
        }

        .clubs-search input {
          flex: 1;
          min-width: 0;
          padding: 16px 0;
          border: none;
          outline: none;
          color: #172033;
          background: transparent;
          font-size: 14px;
        }

        .clubs-clear-search {
          border: none;
          color: #64748b;
          background: transparent;
          font-size: 23px;
          cursor: pointer;
        }

        .clubs-results-count {
          color: #172b50;
          font-size: 13px;
          font-weight: 800;
        }

        .clubs-category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .clubs-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 16px;
          border: 1px solid #e1e5ec;
          border-radius: 25px;
          color: #536176;
          background: white;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: .2s;
        }

        .clubs-filter-btn:hover,
        .clubs-filter-btn.active {
          border-color: #172b50;
          color: white;
          background: #172b50;
        }

        .clubs-grid-section {
          margin-top: 30px;
        }

        .clubs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 25px;
        }

        .club-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #e5e8ef;
          border-radius: 17px;
          background: white;
          box-shadow: 0 8px 25px #1720330b;
          transition: transform .3s, box-shadow .3s;
        }

        .club-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 35px #17203320;
        }

        .club-card-banner {
          position: relative;
          height: 195px;
          overflow: hidden;
          background: linear-gradient(135deg, #e7d7a8, #f5eacb);
        }

        .club-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }

        .club-card:hover .club-image {
          transform: scale(1.06);
        }

        .club-placeholder {
          display: grid;
          place-items: center;
          height: 100%;
          color: #172b50;
          background: linear-gradient(135deg, #fff2cf, #d8e5f5);
        }

        .club-placeholder-decoration {
          position: absolute;
          font-size: 110px;
          opacity: .15;
        }

        .club-placeholder-initial {
          font-size: 65px;
          font-weight: 900;
        }

        .club-placeholder-bottom {
          margin-top: -12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .club-category {
          position: absolute;
          left: 14px;
          bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          border-radius: 7px;
          color: #172b50;
          background: #ffffffed;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .club-flagged-badge {
          position: absolute;
          top: 13px;
          right: 13px;
          padding: 9px 12px;
          border: 1px solid white;
          border-radius: 7px;
          color: white;
          background: #991b1b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .5px;
        }

        .club-card-content {
          padding: 22px;
        }

        .club-card-content h3 {
          margin: 0 0 12px;
          color: #172b50;
          font-size: 22px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .club-description {
          min-height: 65px;
          margin: 0 0 20px;
          color: #68748a;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .club-report-info {
          padding: 14px;
          border: 1px solid #e5e8ef;
          border-radius: 10px;
          background: #f8fafc;
        }

        .club-report-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #475569;
          font-size: 12px;
          font-weight: 750;
        }

        .club-report-icon {
          margin-right: 6px;
          color: #dc2626;
        }

        .club-report-heading strong {
          color: #dc2626;
          font-size: 14px;
        }

        .club-report-progress {
          height: 8px;
          margin-top: 11px;
          overflow: hidden;
          border-radius: 10px;
          background: #e2e8f0;
        }

        .club-report-progress-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #fca5a5, #ef4444, #991b1b);
          transition: width .4s;
        }

        .club-report-footer {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 9px;
          color: #788196;
          font-size: 10px;
        }

        .club-report-warning {
          color: #991b1b;
          font-weight: 900;
        }

        .club-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5e8ef;
        }

        .club-owner {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .club-owner-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #172b50;
          background: #fff2cf;
          font-size: 16px;
          font-weight: 900;
        }

        .club-owner-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .club-meta-label {
          color: #9aa3b2;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .club-owner-name {
          overflow: hidden;
          color: #172b50;
          font-size: 12px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .club-member-count {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #172b50;
        }

        .club-members-icon {
          font-size: 22px;
        }

        .club-member-count div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .club-member-count strong {
          font-size: 15px;
        }

        .club-member-count span:last-child {
          color: #788196;
          font-size: 10px;
        }

        .club-card-actions {
          display: flex;
          gap: 10px;
          margin-top: 17px;
        }

        .club-high-reports {
          border: 3px solid #991b1b !important;
          color: white !important;
          background: #dc2626 !important;
          box-shadow: 0 12px 35px #991b1b55 !important;
        }

        .club-high-reports:hover {
          box-shadow: 0 18px 42px #7f1d1d70 !important;
        }

        .club-high-reports .club-card-content h3,
        .club-high-reports .club-description,
        .club-high-reports .club-owner-name,
        .club-high-reports .club-member-count,
        .club-high-reports .club-member-count strong,
        .club-high-reports .club-report-heading,
        .club-high-reports .club-report-heading strong,
        .club-high-reports .club-report-footer {
          color: white !important;
        }

        .club-high-reports .club-card-meta {
          border-color: #fecaca;
        }

        .club-high-reports .club-owner-avatar {
          color: #991b1b;
          background: white;
        }

        .club-high-reports .club-report-info {
          border-color: #fecaca;
          background: #b91c1c;
        }

        .club-high-reports .club-report-progress {
          background: #7f1d1d;
        }

        .club-high-reports .club-report-progress-fill {
          background: white;
        }

        .club-high-reports .club-report-warning {
          color: #fee2e2;
        }

        .club-high-reports .club-report-icon {
          color: white;
        }

        .club-high-reports .club-category {
          color: #991b1b;
          background: white;
        }

        .club-high-reports .club-member-count span:last-child,
        .club-high-reports .club-meta-label {
          color: #fee2e2;
        }

        .delete-club-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 14px;
          border: 2px solid white;
          border-radius: 9px;
          color: #991b1b;
          background: white;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: .25s;
        }

        .delete-club-btn:hover {
          color: white;
          background: #7f1d1d;
          border-color: #7f1d1d;
          transform: translateY(-2px);
        }

        .delete-club-btn:disabled {
          opacity: .6;
          cursor: wait;
        }

        .clubs-empty-state {
          padding: 65px 20px;
          border: 1px dashed #c5ccd9;
          border-radius: 17px;
          background: white;
          text-align: center;
        }

        .clubs-empty-icon {
          display: grid;
          place-items: center;
          width: 75px;
          height: 75px;
          margin: 0 auto 18px;
          border-radius: 22px;
          color: #172b50;
          background: #fff2cf;
          font-size: 42px;
        }

        .clubs-empty-state h3 {
          margin: 0 0 10px;
          color: #172b50;
          font-size: 23px;
        }

        .clubs-empty-state p {
          margin: 0 0 20px;
          color: #788196;
          font-size: 14px;
        }

        .clubs-loading-heading {
          margin: 25px 0;
          padding: 30px;
          border-radius: 15px;
          background: white;
        }

        .clubs-skeleton {
          border-radius: 8px;
          background: linear-gradient(90deg, #e9edf3, #f7f8fa, #e9edf3);
          background-size: 200% 100%;
          animation: clubsShimmer 1.5s infinite;
        }

        @keyframes clubsShimmer {
          to { background-position: -200% 0; }
        }

        .clubs-skeleton-title {
          width: 55%;
          height: 22px;
          margin-bottom: 15px;
        }

        .clubs-skeleton-subtitle {
          width: 75%;
          height: 13px;
        }

        .club-loading-card {
          padding-bottom: 20px;
          background: white;
        }

        .club-skeleton-image {
          height: 190px;
        }

        .clubs-skeleton-badge {
          width: 90px;
          height: 20px;
          margin: 15px 0;
        }

        .clubs-skeleton-line {
          height: 13px;
          margin: 13px 0;
        }

        .clubs-skeleton-line.short {
          width: 65%;
        }

        .clubs-skeleton-button {
          height: 42px;
          margin-top: 20px;
        }

        .clubs-state-card {
          max-width: 550px;
          margin: 100px auto;
          padding: 45px;
          border-radius: 17px;
          background: white;
          text-align: center;
          box-shadow: 0 12px 30px #17203320;
        }

        .clubs-state-icon {
          display: grid;
          place-items: center;
          width: 65px;
          height: 65px;
          margin: 0 auto 18px;
          border-radius: 50%;
          font-size: 30px;
          font-weight: 900;
        }

        .error-icon {
          color: #991b1b;
          background: #fee2e2;
        }

        .clubs-state-card h2 {
          color: #172b50;
        }

        .clubs-state-card p {
          color: #788196;
        }

        .clubs-retry-btn {
          padding: 12px 22px;
          border: none;
          border-radius: 9px;
          color: white;
          background: #172b50;
          font-weight: 800;
          cursor: pointer;
        }

        .clubs-bottom-cta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 50px;
          padding: 28px;
          border-radius: 17px;
          background: linear-gradient(120deg, #172b50, #263e64);
          box-shadow: 0 12px 30px #172b5030;
        }

        .clubs-cta-icon {
          display: grid;
          place-items: center;
          width: 55px;
          height: 55px;
          border-radius: 15px;
          color: #172b50;
          background: #f5d98b;
          font-size: 32px;
        }

        .clubs-cta-text {
          flex: 1;
        }

        .clubs-cta-text h3 {
          margin: 0 0 7px;
          color: #f5d98b;
          font-size: 19px;
        }

        .clubs-cta-text p {
          margin: 0;
          color: #cbd5e1;
          font-size: 13px;
        }

        .clubs-cta-button {
          padding: 13px 19px;
          border-radius: 9px;
          color: #172b50;
          background: #f5d98b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .clubs-cta-button:hover {
          background: white;
        }

        .clubs-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 35px;
          padding: 20px 0;
          border-top: 1px solid #172b5030;
          color: #172b50;
          font-size: 12px;
          font-weight: 750;
        }

        @media(max-width: 900px) {
          .clubs-hero {
            padding: 35px;
          }

          .clubs-hero-art {
            width: 220px;
            transform: scale(.85);
          }

          .admin-club-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width: 650px) {
          .clubs-page {
            padding: 20px 14px;
          }

          .clubs-brand {
            flex-wrap: wrap;
            font-size: 16px;
          }

          .clubs-hero {
            padding: 30px 22px;
          }

          .clubs-hero-art {
            display: none;
          }

          .clubs-hero h1 {
            font-size: 36px;
          }

          .admin-club-summary {
            grid-template-columns: 1fr;
          }

          .clubs-section-heading h2 {
            font-size: 25px;
          }

          .clubs-toolbar {
            align-items: stretch;
          }

          .clubs-search {
            width: 100%;
          }

          .clubs-results-count {
            text-align: right;
          }

          .clubs-grid {
            grid-template-columns: 1fr;
          }

          .clubs-bottom-cta {
            padding: 20px;
          }

          .clubs-cta-button {
            width: 100%;
            text-align: center;
          }

          .clubs-footer {
            flex-direction: column;
            text-align: center;
          }
        }

      `}</style>

      <div className="clubs-decoration clubs-decoration-one"></div>
      <div className="clubs-decoration clubs-decoration-two"></div>

      <main className="clubs-page-inner">

        {/* BRAND */}
        <div className="clubs-brand">
          <div className="clubs-brand-icon">✦</div>

          <span>
            Campus <strong>Connect</strong>
          </span>

          <span className="clubs-brand-divider"></span>

          <span className="clubs-brand-section">
            {role === "admin" ? "Club Management" : "Communities"}
          </span>
        </div>

        {/* HERO */}
        <section className="clubs-hero">
          <div className="clubs-hero-content">

            <span className="clubs-eyebrow">
              <span className="clubs-eyebrow-dot"></span>
              {role === "admin"
                ? "ADMINISTRATION PANEL"
                : "FIND YOUR PEOPLE"}
            </span>

            <h1>
              Your interests.
              <br />
              Your <span>community.</span>
            </h1>

            <p>
              Discover communities that share your passions.
              Meet like-minded students, exchange ideas, and grow together.
            </p>

            <div className="clubs-hero-stats">
              <div className="clubs-stat">
                <span className="clubs-stat-number">{clubs.length}</span>
                <span className="clubs-stat-label">Communities</span>
              </div>

              <span className="clubs-stat-divider"></span>

              <div className="clubs-stat">
                <span className="clubs-stat-number">{totalMemberships}</span>
                <span className="clubs-stat-label">Memberships</span>
              </div>
            </div>
          </div>

          <div className="clubs-hero-art" aria-hidden="true">
            <div className="clubs-art-orbit orbit-one"></div>
            <div className="clubs-art-orbit orbit-two"></div>
            <div className="clubs-art-center"><span>✦</span></div>
            <div className="clubs-art-bubble bubble-one">⌘</div>
            <div className="clubs-art-bubble bubble-two">♡</div>
            <div className="clubs-art-bubble bubble-three">✧</div>
            <div className="clubs-art-bubble bubble-four">↗</div>
            <div className="clubs-art-caption">
              <span className="clubs-caption-dot"></span>
              Better together
            </div>
          </div>
        </section>

        {/* ADMIN REPORT SUMMARY */}
        {role === "admin" && (
          <section className="admin-club-summary">

            <div className="admin-summary-card">
              <div className="admin-summary-icon">♧</div>
              <div>
                <span>Total Communities</span>
                <strong>{clubs.length}</strong>
              </div>
            </div>

            <div className="admin-summary-card">
              <div className="admin-summary-icon">⚑</div>
              <div>
                <span>Total Reports</span>
                <strong>{totalReports}</strong>
              </div>
            </div>

            <div className="admin-summary-card admin-summary-danger">
              <div className="admin-summary-icon">⚠</div>
              <div>
                <span>Flagged Clubs</span>
                <strong>{flaggedClubs}</strong>
              </div>
            </div>

          </section>
        )}

        {/* DISCOVER */}
        <section className="clubs-discover">
          <div className="clubs-section-heading">
            <div>
              <span className="clubs-section-kicker">EXPLORE & CONNECT</span>
              <h2>Discover your community</h2>
              <p>There's a place for everyone. Find yours.</p>
            </div>

            {role !== "admin" && (
              <Link to="/createClub" className="create-club-btn">
                <span className="create-club-plus">+</span>
                Create a Club
              </Link>
            )}
          </div>

          {/* SEARCH */}
          <div className="clubs-toolbar">
            <div className="clubs-search">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-4-4"></path>
              </svg>

              <input
                type="search"
                placeholder="Search clubs, interests, or creators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search clubs"
              />

              {search && (
                <button
                  type="button"
                  className="clubs-clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <span className="clubs-results-count">
              {filteredClubs.length}{" "}
              {filteredClubs.length === 1 ? "club" : "clubs"} found
            </span>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="clubs-category-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`clubs-filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category !== "All" && (
                  <span>{getCategoryIcon(category)}</span>
                )}
                {category === "All" ? "All Clubs" : category}
              </button>
            ))}
          </div>
        </section>

        {/* CLUB GRID */}
        <section className="clubs-grid-section">

          {loading ? (
            <div className="clubs-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="club-card club-loading-card" key={item}>
                  <div className="clubs-skeleton club-skeleton-image"></div>
                  <div className="club-card-content">
                    <div className="clubs-skeleton clubs-skeleton-badge"></div>
                    <div className="clubs-skeleton clubs-skeleton-title"></div>
                    <div className="clubs-skeleton clubs-skeleton-line"></div>
                    <div className="clubs-skeleton clubs-skeleton-line short"></div>
                    <div className="clubs-skeleton clubs-skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="clubs-state-card">
              <div className="clubs-state-icon error-icon">!</div>
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <button
                type="button"
                className="clubs-retry-btn"
                onClick={fetchClubs}
              >
                Try Again ↻
              </button>
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="clubs-empty-state">
              <div className="clubs-empty-icon">
                {clubs.length === 0 ? "✦" : "⌕"}
              </div>

              <h3>
                {clubs.length === 0 ? "No communities yet" : "No clubs found"}
              </h3>

              <p>
                {clubs.length === 0
                  ? "There are currently no active clubs."
                  : "Try a different search term or category."}
              </p>

              {clubs.length === 0 && role !== "admin" && (
                <Link to="/createClub" className="create-club-btn">
                  + Create the First Club
                </Link>
              )}

              {clubs.length > 0 && (
                <button
                  type="button"
                  className="clubs-retry-btn"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="clubs-grid">
              {filteredClubs.map((club) => {
                const reportCount = Number(club.reports) || 0;
                const isFlagged = reportCount >= 5;
                const imageUrl = getImageUrl(club.image);

                return (
                  <article
                    className={`club-card ${
                      isFlagged ? "club-high-reports" : ""
                    }`}
                    key={club._id}
                    style={getReportStyle(reportCount)}
                  >
                    {/* IMAGE */}
                    <div className="club-card-banner">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`${club.clubName} cover`}
                          className="club-image"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = "grid";
                            }
                          }}
                        />
                      )}

                      <div
                        className="club-placeholder"
                        style={{ display: imageUrl ? "none" : "grid" }}
                      >
                        <span className="club-placeholder-decoration">✧</span>
                        <span className="club-placeholder-initial">
                          {getInitials(club.clubName)}
                        </span>
                        <span className="club-placeholder-bottom">
                          CAMPUS COMMUNITY
                        </span>
                      </div>

                      <span className="club-category">
                        <span>{getCategoryIcon(club.category)}</span>
                        {club.category || "Community"}
                      </span>

                      {isFlagged && (
                        <span className="club-flagged-badge">
                          ⚠ HIGHLY REPORTED
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="club-card-content">
                      <h3 title={club.clubName}>{club.clubName}</h3>

                      <p className="club-description">
                        {club.description ||
                          "A community for students to connect and grow."}
                      </p>

                      {/* REPORT PROGRESS */}
                      <div className="club-report-info">
                        <div className="club-report-heading">
                          <span>
                            <span className="club-report-icon">⚑</span>
                            Community Reports
                          </span>
                          <strong>{reportCount} / 5</strong>
                        </div>

                        <div className="club-report-progress">
                          <div
                            className="club-report-progress-fill"
                            style={{
                              width: `${Math.min(reportCount * 20, 100)}%`
                            }}
                          ></div>
                        </div>

                        <div className="club-report-footer">
                          <span>
                            {reportCount === 0
                              ? "No reports"
                              : reportCount < 5
                              ? `${5 - reportCount} more reports to moderation threshold`
                              : "Moderation threshold reached"}
                          </span>

                          {isFlagged && (
                            <span className="club-report-warning">
                              Needs attention
                            </span>
                          )}
                        </div>
                      </div>

                      {/* OWNER AND MEMBERS */}
                      <div className="club-card-meta">
                        <div className="club-owner">
                          <div className="club-owner-avatar">
                            {getInitials(club.createdBy?.name)}
                          </div>

                          <div className="club-owner-details">
                            <span className="club-meta-label">CREATED BY</span>
                            <span
                              className="club-owner-name"
                              title={club.createdBy?.name || "Unknown"}
                            >
                              {club.createdBy?.name || "Unknown"}
                            </span>
                          </div>
                        </div>

                        <div className="club-member-count">
                          <span className="club-members-icon">♧</span>
                          <div>
                            <strong>{club.members?.length || 0}</strong>
                            <span>Members</span>
                          </div>
                        </div>
                      </div>

                      {/* ADMIN DELETE ACTION */}
                      {role === "admin" && isFlagged && (
                        <div className="club-card-actions">
                          <button
                            type="button"
                            className="delete-club-btn"
                            disabled={deletingId === club._id}
                            onClick={() =>
                              handleDeleteClub(
                                club._id,
                                club.clubName,
                                reportCount
                              )
                            }
                          >
                            {deletingId === club._id ? (
                              "Deleting..."
                            ) : (
                              <>
                                <span>🗑</span>
                                Delete Club
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM CTA */}
        {clubs.length > 0 && role !== "admin" && (
          <section className="clubs-bottom-cta">
            <div className="clubs-cta-icon">✦</div>

            <div className="clubs-cta-text">
              <h3>Can't find your kind of community?</h3>
              <p>Start something new. Your people are waiting.</p>
            </div>

            <Link to="/createClub" className="clubs-cta-button">
              Start a Club <span>↗</span>
            </Link>
          </section>
        )}

        {/* FOOTER */}
        <footer className="clubs-footer">
          <span>Campus Connect</span>
          <span>Connect. Collaborate. Grow. ✦</span>
        </footer>

      </main>
    </div>
  );
}

export default FacultyAllClubs;

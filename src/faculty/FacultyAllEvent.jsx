
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

function FacultyAllEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const role = localStorage.getItem("role");

  // FETCH EVENTS
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/api/allEvent`);

      const eventData = Array.isArray(res.data)
        ? res.data
        : res.data.events || [];

      setEvents(eventData);

    } catch (err) {
      console.error("Fetch events error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE EVENT
  const deleteEvent = async (id, title) => {
    if (role !== "admin") {
      alert("Only administrators can delete events.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await axios.delete(
        `${API_URL}/api/deleteEvent/${id}`
      );

      alert(res.data.message || "Event deleted successfully!");

      setEvents((prev) =>
        prev.filter((event) => event._id !== id)
      );

    } catch (err) {
      console.error("Delete event error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // IMAGE URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const imageName = image.replace(/\\/g, "/").split("/").pop();

    return `${API_URL}/events/${imageName}`;
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "Not specified";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // CATEGORIES
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        events.map((event) => event.category).filter(Boolean)
      )
    ];
  }, [events]);

  // STATISTICS
  const upcomingEvents = events.filter(
    (event) => event.status?.toLowerCase() === "upcoming"
  ).length;

  const completedEvents = events.filter(
    (event) => event.status?.toLowerCase() === "completed"
  ).length;

  const totalParticipants = events.reduce(
    (total, event) =>
      total + (Number(event.maxParticipants) || 0),
    0
  );

  // FILTER EVENTS
  const filteredEvents = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        (event.title || "").toLowerCase().includes(searchText) ||
        (event.description || "").toLowerCase().includes(searchText) ||
        (event.category || "").toLowerCase().includes(searchText) ||
        (event.venue || "").toLowerCase().includes(searchText) ||
        (event.organizer || "").toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        event.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        (event.status || "").toLowerCase() ===
          selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, selectedCategory, selectedStatus]);

  // CATEGORY ICONS
  const getCategoryIcon = (category) => {
    const icons = {
      Technical: "⌘",
      Cultural: "✧",
      Sports: "⚡",
      Workshop: "⚒",
      Seminar: "▤",
      Other: "✦"
    };

    return icons[category] || "✦";
  };

  // STATUS CLASS
  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "upcoming":
        return "event-status-upcoming";
      case "ongoing":
        return "event-status-ongoing";
      case "completed":
        return "event-status-completed";
      case "cancelled":
        return "event-status-cancelled";
      default:
        return "event-status-default";
    }
  };

  return (
    <div className="events-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .events-page {
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
          animation: eventRainbow 15s ease infinite;
        }

        @keyframes eventRainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .events-container {
          max-width: 1300px;
          margin: auto;
        }

        /* BRAND */

        .events-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
          color: #172b50;
          font-size: 19px;
          font-weight: 800;
        }

        .events-brand-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          color: white;
          background: #172b50;
          font-size: 25px;
        }

        .events-brand strong {
          color: #9b6c12;
        }

        .events-brand-divider {
          width: 1px;
          height: 25px;
          background: #172b5060;
        }

        .events-brand-label {
          color: #596579;
          font-size: 13px;
        }

        /* HERO */

        .events-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          min-height: 290px;
          padding: 48px;
          overflow: hidden;
          border-radius: 25px;
          color: white;
          background: linear-gradient(
            125deg,
            #101b35,
            #172b50,
            #304d78
          );
          box-shadow: 0 20px 45px #101b3535;
        }

        .events-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .events-eyebrow {
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

        .events-eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #84fab0;
        }

        .events-hero h1 {
          margin: 22px 0 15px;
          color: white;
          font-size: clamp(35px, 5vw, 53px);
          font-weight: 900;
          line-height: 1.15;
        }

        .events-hero h1 span {
          color: #f5d98b;
        }

        .events-hero p {
          max-width: 570px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.8;
        }

        .events-hero-art {
          position: relative;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 230px;
          height: 220px;
        }

        .events-art-orbit {
          position: absolute;
          width: 190px;
          height: 190px;
          border: 1px solid #f5d98b60;
          border-radius: 50%;
        }

        .events-art-orbit-two {
          width: 140px;
          height: 140px;
          border-style: dashed;
          animation: eventRotate 20s linear infinite;
        }

        @keyframes eventRotate {
          to { transform: rotate(360deg); }
        }

        .events-art-center {
          display: grid;
          place-items: center;
          width: 95px;
          height: 95px;
          border: 1px solid #f5d98b;
          border-radius: 28px;
          color: #172b50;
          background: linear-gradient(135deg, #fff3c4, #e9bc56);
          box-shadow: 0 0 45px #f5d98b55;
          font-size: 53px;
          transform: rotate(-8deg);
        }

        .events-art-bubble {
          position: absolute;
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border: 1px solid #ffffff40;
          border-radius: 13px;
          color: white;
          background: #ffffff20;
          font-size: 23px;
        }

        .events-bubble-one {
          top: 8px;
          left: 25px;
        }

        .events-bubble-two {
          top: 35px;
          right: 5px;
        }

        .events-bubble-three {
          bottom: 10px;
          left: 35px;
        }

        .events-bubble-four {
          right: 25px;
          bottom: 5px;
        }

        /* STATISTICS */

        .events-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin: 28px 0 40px;
        }

        .event-stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 22px;
          border: 1px solid #e5e8ef;
          border-radius: 15px;
          background: white;
          box-shadow: 0 7px 22px #1720330b;
          transition: .25s;
        }

        .event-stat-card:hover {
          transform: translateY(-5px);
        }

        .event-stat-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          color: #172b50;
          background: #fff3cf;
          font-size: 26px;
        }

        .event-stat-card span {
          display: block;
          margin-bottom: 5px;
          color: #788196;
          font-size: 12px;
          font-weight: 650;
        }

        .event-stat-card strong {
          color: #172b50;
          font-size: 27px;
          font-weight: 900;
        }

        /* SECTION */

        .events-section {
          margin-top: 25px;
        }

        .events-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .events-kicker {
          color: #9b6c12;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .events-section-heading h2 {
          margin: 9px 0;
          color: #172b50;
          font-size: 32px;
          font-weight: 900;
        }

        .events-section-heading p {
          margin: 0;
          color: #596579;
          font-size: 14px;
        }

        .events-count {
          padding: 11px 17px;
          border-radius: 25px;
          color: #172b50;
          background: white;
          font-size: 13px;
          font-weight: 850;
          box-shadow: 0 5px 15px #17203310;
        }

        /* TOOLBAR */

        .events-toolbar {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .events-search {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 230px;
          padding: 0 17px;
          border: 1px solid #e1e5ec;
          border-radius: 12px;
          background: white;
          box-shadow: 0 5px 18px #1720330a;
        }

        .events-search:focus-within {
          border-color: #c39b38;
          box-shadow: 0 0 0 4px #c39b3818;
        }

        .events-search-icon {
          color: #788196;
          font-size: 21px;
        }

        .events-search input {
          flex: 1;
          min-width: 0;
          padding: 16px 0;
          border: none;
          outline: none;
          color: #172033;
          background: transparent;
          font-size: 14px;
        }

        .events-clear {
          border: none;
          color: #64748b;
          background: transparent;
          font-size: 22px;
          cursor: pointer;
        }

        .events-select {
          min-width: 160px;
          padding: 15px;
          border: 1px solid #e1e5ec;
          border-radius: 11px;
          outline: none;
          color: #172b50;
          background: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .events-select:focus {
          border-color: #c39b38;
        }

        /* CATEGORY FILTER */

        .events-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .events-category-btn {
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

        .events-category-btn:hover,
        .events-category-btn.active {
          border-color: #172b50;
          color: white;
          background: #172b50;
        }

        /* EVENT GRID */

        .events-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(280px, 1fr)
          );
          gap: 25px;
          margin-top: 28px;
        }

        .event-card {
          overflow: hidden;
          border: 1px solid #e5e8ef;
          border-radius: 17px;
          background: white;
          box-shadow: 0 8px 25px #1720330b;
          transition: .3s;
        }

        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 35px #17203320;
        }

        /* EVENT IMAGE */

        .event-image-wrap {
          position: relative;
          height: 195px;
          overflow: hidden;
          background: linear-gradient(135deg, #fff2cf, #d8e5f5);
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }

        .event-card:hover .event-image {
          transform: scale(1.06);
        }

        .event-image-placeholder {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          color: #172b50;
          font-size: 65px;
        }

        .event-image-category {
          position: absolute;
          left: 14px;
          bottom: 14px;
          padding: 8px 13px;
          border-radius: 7px;
          color: #172b50;
          background: #ffffffed;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .event-status {
          position: absolute;
          top: 13px;
          right: 13px;
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .event-status-upcoming {
          color: #166534;
          background: #dcfce7;
        }

        .event-status-ongoing {
          color: #075985;
          background: #e0f2fe;
        }

        .event-status-completed {
          color: #475569;
          background: #e2e8f0;
        }

        .event-status-cancelled {
          color: #991b1b;
          background: #fee2e2;
        }

        .event-status-default {
          color: #475569;
          background: #f1f5f9;
        }

        /* EVENT CONTENT */

        .event-content {
          padding: 21px;
        }

        .event-content h3 {
          margin: 0 0 10px;
          color: #172b50;
          font-size: 21px;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .event-description {
          display: -webkit-box;
          min-height: 62px;
          margin: 0 0 18px;
          overflow: hidden;
          color: #68748a;
          font-size: 13px;
          line-height: 1.7;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        /* EVENT DETAILS */

        .event-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
          padding: 16px 0;
          border-top: 1px solid #e5e8ef;
          border-bottom: 1px solid #e5e8ef;
        }

        .event-detail {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          min-width: 0;
        }

        .event-detail-icon {
          flex-shrink: 0;
          font-size: 19px;
        }

        .event-detail-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .event-detail-label {
          color: #9aa3b2;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .event-detail-value {
          overflow-wrap: anywhere;
          color: #172b50;
          font-size: 12px;
          font-weight: 750;
        }

        /* ORGANIZER */

        .event-organizer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 17px;
        }

        .event-organizer-info {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .event-organizer-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 37px;
          height: 37px;
          border-radius: 50%;
          color: #172b50;
          background: #fff2cf;
          font-size: 15px;
          font-weight: 900;
        }

        .event-organizer-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .event-organizer-text span:first-child {
          color: #9aa3b2;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .8px;
        }

        .event-organizer-text strong {
          overflow: hidden;
          color: #172b50;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .event-type-badge {
          padding: 7px 10px;
          border-radius: 7px;
          color: #9b6c12;
          background: #fff5d9;
          font-size: 10px;
          font-weight: 850;
        }

        /* DELETE */

        .event-delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          margin-top: 18px;
          padding: 12px;
          border: 1px solid #fecaca;
          border-radius: 9px;
          color: #b91c1c;
          background: #fff1f2;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          transition: .2s;
        }

        .event-delete-btn:hover {
          color: white;
          background: #dc2626;
          border-color: #dc2626;
        }

        .event-delete-btn:disabled {
          opacity: .6;
          cursor: wait;
        }

        /* EMPTY / ERROR */

        .events-state {
          grid-column: 1 / -1;
          padding: 60px 20px;
          border: 1px solid #e5e8ef;
          border-radius: 17px;
          background: white;
          text-align: center;
          box-shadow: 0 8px 25px #1720330b;
        }

        .events-state-icon {
          display: grid;
          place-items: center;
          width: 75px;
          height: 75px;
          margin: 0 auto 18px;
          border-radius: 22px;
          color: #172b50;
          background: #fff2cf;
          font-size: 38px;
        }

        .events-state h3 {
          margin: 0 0 10px;
          color: #172b50;
          font-size: 23px;
        }

        .events-state p {
          color: #788196;
          font-size: 14px;
        }

        .events-retry-btn {
          padding: 12px 22px;
          border: none;
          border-radius: 9px;
          color: white;
          background: #172b50;
          font-weight: 800;
          cursor: pointer;
        }

        /* LOADING */

        .event-skeleton {
          height: 400px;
          border-radius: 17px;
          background: linear-gradient(
            90deg,
            #e9edf3,
            #f7f8fa,
            #e9edf3
          );
          background-size: 200% 100%;
          animation: eventShimmer 1.5s infinite;
        }

        @keyframes eventShimmer {
          to { background-position: -200% 0; }
        }

        /* FOOTER */

        .events-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 45px;
          padding: 22px 0;
          border-top: 1px solid #172b5030;
          color: #172b50;
          font-size: 12px;
          font-weight: 750;
        }

        /* RESPONSIVE */

        @media(max-width: 950px) {
          .events-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .events-hero {
            padding: 35px;
          }

          .events-hero-art {
            transform: scale(.85);
          }
        }

        @media(max-width: 650px) {
          .events-page {
            padding: 20px 14px;
          }

          .events-brand {
            flex-wrap: wrap;
            font-size: 16px;
          }

          .events-hero {
            padding: 30px 22px;
          }

          .events-hero-art {
            display: none;
          }

          .events-hero h1 {
            font-size: 36px;
          }

          .events-stats {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .event-stat-card {
            padding: 14px;
            gap: 10px;
          }

          .event-stat-icon {
            width: 42px;
            height: 42px;
            font-size: 21px;
          }

          .event-stat-card strong {
            font-size: 22px;
          }

          .events-section-heading h2 {
            font-size: 25px;
          }

          .events-toolbar {
            align-items: stretch;
          }

          .events-search {
            flex-basis: 100%;
          }

          .events-select {
            flex: 1;
            min-width: 0;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-footer {
            flex-direction: column;
            text-align: center;
          }
        }

        @media(max-width: 380px) {
          .events-stats {
            grid-template-columns: 1fr;
          }

          .event-details {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

      <main className="events-container">

        {/* BRAND */}
        <div className="events-brand">
          <div className="events-brand-icon">✦</div>

          <span>
            Campus <strong>Connect</strong>
          </span>

          <span className="events-brand-divider"></span>

          <span className="events-brand-label">
            {role === "admin" ? "Event Management" : "Event Explorer"}
          </span>
        </div>

        {/* HERO */}
        <section className="events-hero">

          <div className="events-hero-content">

            <span className="events-eyebrow">
              <span className="events-eyebrow-dot"></span>
              CAMPUS EVENTS
            </span>

            <h1>
              Discover.
              <br />
              Experience <span>More.</span>
            </h1>

            <p>
              Explore exciting campus events, workshops, seminars,
              cultural programs and sports activities.
              Connect with students and create unforgettable memories.
            </p>

          </div>

          <div className="events-hero-art">
            <div className="events-art-orbit"></div>
            <div className="events-art-orbit events-art-orbit-two"></div>

            <div className="events-art-center">✦</div>

            <div className="events-art-bubble events-bubble-one">✧</div>
            <div className="events-art-bubble events-bubble-two">⚡</div>
            <div className="events-art-bubble events-bubble-three">⌘</div>
            <div className="events-art-bubble events-bubble-four">♡</div>
          </div>

        </section>

        {/* STATISTICS */}
        <section className="events-stats">

          <div className="event-stat-card">
            <div className="event-stat-icon">▣</div>
            <div>
              <span>Total Events</span>
              <strong>{events.length}</strong>
            </div>
          </div>

          <div className="event-stat-card">
            <div className="event-stat-icon">◷</div>
            <div>
              <span>Upcoming Events</span>
              <strong>{upcomingEvents}</strong>
            </div>
          </div>

          <div className="event-stat-card">
            <div className="event-stat-icon">✓</div>
            <div>
              <span>Completed Events</span>
              <strong>{completedEvents}</strong>
            </div>
          </div>

          <div className="event-stat-card">
            <div className="event-stat-icon">♧</div>
            <div>
              <span>Total Capacity</span>
              <strong>{totalParticipants}</strong>
            </div>
          </div>

        </section>

        {/* DISCOVER EVENTS */}
        <section className="events-section">

          <div className="events-section-heading">

            <div>
              <span className="events-kicker">
                EXPLORE & PARTICIPATE
              </span>

              <h2>Discover Campus Events</h2>

              <p>
                Find events that match your interests and passion.
              </p>
            </div>

            <div className="events-count">
              {filteredEvents.length} Events Found
            </div>

          </div>

          {/* SEARCH AND STATUS */}
          <div className="events-toolbar">

            <div className="events-search">
              <span className="events-search-icon">⌕</span>

              <input
                type="search"
                placeholder="Search events, venue, category or organizer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="events-clear"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}
            </div>

            <select
              className="events-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

          </div>

          {/* CATEGORY FILTER */}
          <div className="events-categories">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`events-category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category !== "All" && (
                  <span>{getCategoryIcon(category)}</span>
                )}

                {category === "All" ? "All Events" : category}
              </button>
            ))}

          </div>

        </section>

        {/* EVENT CARDS */}
        <section className="events-grid">

          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div className="event-skeleton" key={item}></div>
            ))
          ) : error ? (
            <div className="events-state">
              <div className="events-state-icon">!</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>

              <button
                className="events-retry-btn"
                onClick={fetchEvents}
              >
                Try Again ↻
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="events-state">
              <div className="events-state-icon">✦</div>

              <h3>
                {events.length === 0
                  ? "No Events Available"
                  : "No Events Found"}
              </h3>

              <p>
                {events.length === 0
                  ? "There are currently no campus events."
                  : "Try another search term or filter."}
              </p>

              {events.length > 0 && (
                <button
                  className="events-retry-btn"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map((event) => {

              const imageUrl = getImageUrl(event.image);

              return (
                <article className="event-card" key={event._id}>

                  {/* IMAGE */}
                  <div className="event-image-wrap">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={event.title || "Event"}
                        className="event-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = "grid";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="event-image-placeholder"
                      style={{
                        display: imageUrl ? "none" : "grid"
                      }}
                    >
                      ✦
                    </div>

                    <span className="event-image-category">
                      {getCategoryIcon(event.category)}{" "}
                      {event.category || "Event"}
                    </span>

                    <span className={`event-status ${getStatusClass(event.status)}`}>
                      {event.status || "Not specified"}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="event-content">

                    <h3>{event.title || "Untitled Event"}</h3>

                    <p className="event-description">
                      {event.description || "No description available."}
                    </p>

                    {/* DETAILS */}
                    <div className="event-details">

                      <div className="event-detail">
                        <span className="event-detail-icon">📅</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Event Date</span>
                          <span className="event-detail-value">
                            {formatDate(event.eventDate)}
                          </span>
                        </div>
                      </div>

                      <div className="event-detail">
                        <span className="event-detail-icon">◷</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Time</span>
                          <span className="event-detail-value">
                            {event.startTime || "--"} - {event.endTime || "--"}
                          </span>
                        </div>
                      </div>

                      <div className="event-detail">
                        <span className="event-detail-icon">📍</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Venue</span>
                          <span className="event-detail-value">
                            {event.venue || "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="event-detail">
                        <span className="event-detail-icon">♧</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Max Participants</span>
                          <span className="event-detail-value">
                            {event.maxParticipants || "Unlimited"}
                          </span>
                        </div>
                      </div>

                      <div className="event-detail">
                        <span className="event-detail-icon">⏳</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Registration Deadline</span>
                          <span className="event-detail-value">
                            {formatDate(event.registrationDeadline)}
                          </span>
                        </div>
                      </div>

                      <div className="event-detail">
                        <span className="event-detail-icon">✦</span>

                        <div className="event-detail-text">
                          <span className="event-detail-label">Event Type</span>
                          <span className="event-detail-value">
                            {event.eventType || "Not specified"}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* ORGANIZER */}
                    <div className="event-organizer">

                      <div className="event-organizer-info">

                        <div className="event-organizer-avatar">
                          {(event.organizer || "E").charAt(0).toUpperCase()}
                        </div>

                        <div className="event-organizer-text">
                          <span>ORGANIZED BY</span>
                          <strong>{event.organizer || "Unknown"}</strong>
                        </div>

                      </div>

                      <span className="event-type-badge">
                        {event.createdBy?.role || "Campus"}
                      </span>

                    </div>

                    {/* ADMIN DELETE */}
                    {role === "admin" && (
                      <button
                        type="button"
                        className="event-delete-btn"
                        disabled={deletingId === event._id}
                        onClick={() => deleteEvent(event._id, event.title)}
                      >
                        {deletingId === event._id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <span>🗑</span>
                            Delete Event
                          </>
                        )}
                      </button>
                    )}

                  </div>

                </article>
              );
            })
          )}

        </section>

        {/* FOOTER */}
        <footer className="events-footer">
          <span>Campus Connect</span>
          <span>Discover. Participate. Grow. ✦</span>
        </footer>

      </main>
    </div>
  );
}

export default FacultyAllEvent;

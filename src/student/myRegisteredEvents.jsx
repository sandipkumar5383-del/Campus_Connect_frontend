
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyRegistered() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const API = "http://localhost:8000";
  const userid = localStorage.getItem("userid");

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!userid) {
        setError("Please login to view your registrations.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API}/api/myRegisteredEvents/${userid}`
        );

        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
          "Failed to load registered events"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [userid]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    return isNaN(d.getTime())
      ? "N/A"
      : d.toLocaleDateString("en-GB");
  };

  const getImage = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const path = image.replace(/^\/+/, "");

    return `${API}/${path}`;
  };

  const filteredEvents = events.filter((item) => {
    const event = item.eventId;

    if (!event) return false;

    const keyword = search.toLowerCase();

    return (
      (event.title || "").toLowerCase().includes(keyword) ||
      (event.category || "").toLowerCase().includes(keyword) ||
      (event.venue || "").toLowerCase().includes(keyword)
    );
  });

  const upcoming = events.filter(
    (item) => item.eventId?.status === "upcoming"
  ).length;

  const completed = events.filter(
    (item) => item.eventId?.status === "completed"
  ).length;

  const styles = `
    .myreg-page {
      min-height: 100vh;
      padding: 30px;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #1e293b;
      background: linear-gradient(
        -45deg,
        #ff9a9e,
        #fad0c4,
        #a18cd1,
        #84fab0,
        #8fd3f4,
        #c2e9fb,
        #fbc2eb
      );
      background-size: 400% 400%;
      animation: myregBg 15s ease infinite;
    }

    @keyframes myregBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .myreg-container {
      max-width: 1250px;
      margin: auto;
    }

    .myreg-hero {
      background: linear-gradient(
        120deg,
        #7c3aed,
        #ec4899,
        #f97316
      );
      color: white;
      padding: 42px;
      border-radius: 22px;
      margin-bottom: 25px;
      box-shadow: 0 12px 35px rgba(124,58,237,0.2);
    }

    .myreg-hero span {
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: bold;
      color: #fce7f3;
    }

    .myreg-hero h1 {
      font-size: 35px;
      margin: 12px 0;
    }

    .myreg-hero p {
      color: #fff7ed;
      line-height: 1.7;
      max-width: 650px;
    }

    .myreg-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .myreg-stat {
      padding: 25px;
      border-radius: 18px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    }

    .myreg-stat:nth-child(1) {
      background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
    }

    .myreg-stat:nth-child(2) {
      background: linear-gradient(135deg, #bfdbfe, #93c5fd);
    }

    .myreg-stat:nth-child(3) {
      background: linear-gradient(135deg, #bbf7d0, #86efac);
    }

    .myreg-stat p {
      font-weight: 600;
      margin: 0;
      color: #334155;
    }

    .myreg-stat h2 {
      font-size: 36px;
      color: #312e81;
      margin: 12px 0;
    }

    .myreg-stat small {
      color: #475569;
    }

    .myreg-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .myreg-toolbar h2 {
      font-size: 26px;
      color: #312e81;
      margin: 0 0 6px;
    }

    .myreg-toolbar p {
      margin: 0;
      color: #334155;
    }

    .myreg-search {
      padding: 13px 16px;
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 12px;
      background: rgba(255,255,255,0.9);
      outline: none;
      min-width: 250px;
      font-size: 14px;
    }

    .myreg-search:focus {
      border-color: #7c3aed;
    }

    .myreg-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 25px;
    }

    .myreg-card {
      background: linear-gradient(
        145deg,
        #ffffff,
        #fdf2f8,
        #eef2ff
      );
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(30,41,59,0.1);
      transition: 0.3s;
    }

    .myreg-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 35px rgba(30,41,59,0.18);
    }

    .myreg-image {
      height: 210px;
      background: linear-gradient(135deg, #c4b5fd, #f9a8d4);
      position: relative;
    }

    .myreg-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .myreg-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      color: #4338ca;
      font-weight: bold;
    }

    .myreg-status {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 7px 13px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: capitalize;
      background: #e2e8f0;
      color: #334155;
    }

    .myreg-status.upcoming {
      background: #dcfce7;
      color: #15803d;
    }

    .myreg-status.ongoing {
      background: #fef3c7;
      color: #92400e;
    }

    .myreg-status.completed {
      background: #e0e7ff;
      color: #4338ca;
    }

    .myreg-status.cancelled {
      background: #fee2e2;
      color: #dc2626;
    }

    .myreg-content {
      padding: 23px;
    }

    .myreg-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .myreg-tags span {
      background: #ede9fe;
      color: #6d28d9;
      padding: 6px 11px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }

    .myreg-tags span:nth-child(2) {
      background: #fce7f3;
      color: #be185d;
    }

    .myreg-content h3 {
      font-size: 21px;
      color: #312e81;
      margin: 0 0 10px;
    }

    .myreg-description {
      color: #64748b;
      font-size: 14px;
      line-height: 1.7;
      min-height: 45px;
    }

    .myreg-details {
      border-top: 1px solid #e9d5ff;
      margin-top: 15px;
      padding-top: 12px;
    }

    .myreg-details p {
      font-size: 13px;
      color: #64748b;
      margin: 11px 0;
      overflow-wrap: anywhere;
    }

    .myreg-details strong {
      color: #334155;
    }

    .myreg-confirmation {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #166534;
      text-align: center;
      padding: 13px;
      border-radius: 11px;
      margin-top: 20px;
      font-weight: bold;
      font-size: 14px;
    }

    .myreg-empty {
      background: rgba(255,255,255,0.9);
      border-radius: 20px;
      padding: 45px;
      text-align: center;
      color: #475569;
    }

    .myreg-empty h3 {
      color: #312e81;
    }

    .myreg-btn {
      background: linear-gradient(90deg, #7c3aed, #ec4899);
      border: none;
      color: white;
      padding: 13px 22px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      margin-top: 15px;
    }

    @media (max-width: 1100px) {
      .myreg-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .myreg-page {
        padding: 15px;
      }

      .myreg-hero {
        padding: 25px;
      }

      .myreg-hero h1 {
        font-size: 27px;
      }

      .myreg-stats {
        grid-template-columns: 1fr;
      }

      .myreg-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .myreg-search {
        min-width: 0;
        width: 100%;
        box-sizing: border-box;
      }

      .myreg-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .myreg-page {
        animation: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="myreg-page">
        <div className="myreg-container">

          <div className="myreg-hero">
            <span>CAMPUS CONNECT | STUDENT PORTAL</span>
            <h1>My Registered Events</h1>
            <p>
              View all the campus events you have registered for,
              track upcoming activities and stay connected.
            </p>
          </div>

          <div className="myreg-stats">
            <div className="myreg-stat">
              <p>Total Registrations</p>
              <h2>{events.length}</h2>
              <small>Your registered events</small>
            </div>

            <div className="myreg-stat">
              <p>Upcoming Events</p>
              <h2>{upcoming}</h2>
              <small>Events coming soon</small>
            </div>

            <div className="myreg-stat">
              <p>Completed Events</p>
              <h2>{completed}</h2>
              <small>Events already completed</small>
            </div>
          </div>

          <div className="myreg-toolbar">
            <div>
              <h2>My Event Registrations</h2>
              <p>Explore your registered campus activities</p>
            </div>

            <input
              className="myreg-search"
              type="text"
              placeholder="Search registered events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="myreg-empty">
              Loading your registrations...
            </div>
          ) : error ? (
            <div className="myreg-empty">
              <h3>Unable to load registrations</h3>
              <p>{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="myreg-empty">
              <h3>No Registered Events Found</h3>
              <p>
                {search
                  ? "No registered events match your search."
                  : "You have not registered for any events yet."}
              </p>

              <button
                className="myreg-btn"
                onClick={() => navigate("/allEvent")}
              >
                Explore Campus Events
              </button>
            </div>
          ) : (
            <div className="myreg-grid">
              {filteredEvents.map((item) => {
                const event = item.eventId;

                if (!event) return null;

                return (
                  <div
                    className="myreg-card"
                    key={item._id}
                  >
                    <div className="myreg-image">
                      {event.image ? (
                        <img
                          src={getImage(event.image)}
                          alt={event.title}
                        />
                      ) : (
                        <div className="myreg-placeholder">
                          Campus Event
                        </div>
                      )}

                      <span
                        className={`myreg-status ${event.status || ""}`}
                      >
                        {event.status || "Upcoming"}
                      </span>
                    </div>

                    <div className="myreg-content">
                      <div className="myreg-tags">
                        <span>{event.category || "General"}</span>
                        <span>{event.eventType || "College"}</span>
                      </div>

                      <h3>{event.title}</h3>

                      <p className="myreg-description">
                        {event.description}
                      </p>

                      <div className="myreg-details">
                        <p>
                          <strong>Event Date:</strong>{" "}
                          {formatDate(event.eventDate)}
                        </p>

                        <p>
                          <strong>Time:</strong>{" "}
                          {event.startTime} - {event.endTime}
                        </p>

                        <p>
                          <strong>Venue:</strong> {event.venue}
                        </p>

                        <p>
                          <strong>Organizer:</strong> {event.organizer}
                        </p>

                        <p>
                          <strong>Registered On:</strong>{" "}
                          {formatDate(item.registeredAt)}
                        </p>
                      </div>

                      <div className="myreg-confirmation">
                        ✓ Registration Confirmed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default MyRegistered;

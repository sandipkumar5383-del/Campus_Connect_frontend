
import { useEffect, useState } from "react";
import axios from "axios";

function AdminAllEvent() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const API = "http://localhost:8000";
  const role = localStorage.getItem("role");
  const userid = localStorage.getItem("userid");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/api/allEvent`);
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "N/A"
      : d.toLocaleDateString("en-GB");
  };

  const deleteEvent = async (id) => {
    if (role !== "admin") return;

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API}/api/deleteEvent/${id}`
      );

      alert(res.data.message || "Event deleted successfully");

      if (selectedEvent?._id === id) {
        setSelectedEvent(null);
      }

      fetchEvents();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to delete event"
      );
    }
  };

  const registerEvent = async (eventid) => {
    if (role !== "student" || !userid) {
      alert("Please login as a student");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/registerEvent`,
        {
          eventId: eventid,
          userId: userid
        }
      );

      alert(res.data.message || "Registered successfully");
      fetchEvents();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Event registration failed"
      );
    }
  };

  const viewRegisteredStudents = async (event) => {
    if (role !== "admin") return;

    setSelectedEvent(event);
    setRegisteredStudents([]);
    setStudentsError("");
    setLoadingStudents(true);

    try {
      const res = await axios.get(
        `${API}/api/registeredStudents/${event._id}`
      );

      setRegisteredStudents(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.students)
          ? res.data.students
          : []
      );
    } catch (err) {
      console.error("Registered students error:", err);
      setStudentsError(
        err.response?.data?.message ||
        "Failed to load registered students"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  const categories = [
    "All",
    ...new Set(
      events.map(event => event.category).filter(Boolean)
    )
  ];

  const filteredEvents = events.filter(event => {
    const keyword = search.trim().toLowerCase();

    const matchesSearch =
      (event.title || "").toLowerCase().includes(keyword) ||
      (event.description || "").toLowerCase().includes(keyword) ||
      (event.venue || "").toLowerCase().includes(keyword);

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const upcoming = events.filter(
    event => event.status === "upcoming"
  ).length;

  const completed = events.filter(
    event => event.status === "completed"
  ).length;

  const styles = `
    .cc-page {
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
      animation: colorfulBackground 15s ease infinite;
    }

    @keyframes colorfulBackground {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .cc-hero {
      background: linear-gradient(
        120deg,
        #7c3aed,
        #ec4899,
        #f97316
      );
      color: white;
      padding: 45px;
      border-radius: 22px;
      margin-bottom: 25px;
      box-shadow: 0 12px 35px rgba(124,58,237,0.2);
    }

    .cc-hero span {
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: 700;
      color: #fce7f3;
    }

    .cc-hero h1 {
      font-size: 35px;
      margin: 12px 0;
    }

    .cc-hero p {
      color: #fff7ed;
      line-height: 1.7;
      max-width: 600px;
    }

    .cc-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .cc-stat {
      padding: 25px;
      border-radius: 18px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      transition: transform 0.3s;
    }

    .cc-stat:hover {
      transform: translateY(-5px);
    }

    .cc-stat:nth-child(1) {
      background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
    }

    .cc-stat:nth-child(2) {
      background: linear-gradient(135deg, #bfdbfe, #93c5fd);
    }

    .cc-stat:nth-child(3) {
      background: linear-gradient(135deg, #bbf7d0, #86efac);
    }

    .cc-stat p {
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .cc-stat h2 {
      color: #312e81;
      font-size: 36px;
      margin: 12px 0;
    }

    .cc-stat small {
      color: #475569;
    }

    .cc-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .cc-toolbar h2 {
      font-size: 27px;
      margin: 0 0 6px;
      color: #312e81;
    }

    .cc-toolbar p {
      margin: 0;
      color: #334155;
    }

    .cc-filters {
      display: flex;
      gap: 12px;
    }

    .cc-filters input,
    .cc-filters select {
      padding: 13px 16px;
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 12px;
      background: rgba(255,255,255,0.9);
      outline: none;
      font-size: 14px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .cc-filters input:focus,
    .cc-filters select:focus {
      border-color: #7c3aed;
    }

    .cc-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 25px;
    }

    .cc-card {
      background: linear-gradient(
        145deg,
        #ffffff,
        #fdf2f8,
        #eef2ff
      );
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.8);
      box-shadow: 0 8px 25px rgba(30,41,59,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .cc-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 18px 35px rgba(30,41,59,0.18);
    }

    .cc-image {
      height: 210px;
      background: linear-gradient(135deg, #c4b5fd, #f9a8d4);
      position: relative;
    }

    .cc-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cc-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: bold;
      color: #4338ca;
    }

    .cc-status {
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

    .cc-status.upcoming {
      background: #dcfce7;
      color: #15803d;
    }

    .cc-status.ongoing {
      background: #fef3c7;
      color: #92400e;
    }

    .cc-status.completed {
      background: #e0e7ff;
      color: #4338ca;
    }

    .cc-status.cancelled {
      background: #fee2e2;
      color: #dc2626;
    }

    .cc-content {
      padding: 23px;
    }

    .cc-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 14px;
    }

    .cc-tags span {
      background: #ede9fe;
      color: #6d28d9;
      padding: 6px 11px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }

    .cc-tags span:nth-child(2) {
      background: #fce7f3;
      color: #be185d;
    }

    .cc-content h3 {
      font-size: 21px;
      color: #312e81;
      margin: 0 0 10px;
    }

    .cc-description {
      color: #64748b;
      font-size: 14px;
      line-height: 1.7;
      min-height: 45px;
      overflow-wrap: anywhere;
    }

    .cc-details {
      border-top: 1px solid #e9d5ff;
      margin-top: 15px;
      padding-top: 12px;
    }

    .cc-details p {
      font-size: 13px;
      color: #64748b;
      margin: 11px 0;
      overflow-wrap: anywhere;
    }

    .cc-details strong {
      color: #334155;
    }

    .cc-actions {
      display: flex;
      flex-direction: column;
      gap: 11px;
      margin-top: 22px;
    }

    .cc-actions button {
      padding: 13px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      transition: 0.2s;
    }

    .cc-view {
      background: linear-gradient(90deg, #7c3aed, #6366f1);
      color: white;
    }

    .cc-register {
      background: linear-gradient(90deg, #059669, #10b981);
      color: white;
    }

    .cc-delete {
      background: linear-gradient(90deg, #fb7185, #ef4444);
      color: white;
    }

    .cc-actions button:hover:not(:disabled) {
      filter: brightness(0.92);
      transform: translateY(-2px);
    }

    .cc-actions button:disabled {
      background: #cbd5e1;
      color: #64748b;
      cursor: not-allowed;
    }

    .cc-empty {
      text-align: center;
      padding: 50px;
      color: #334155;
      font-weight: 600;
    }

    .cc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .cc-modal {
      background: linear-gradient(
        145deg,
        #ffffff,
        #fdf2f8,
        #eef2ff
      );
      border-radius: 20px;
      padding: 30px;
      width: 100%;
      max-width: 850px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 25px 70px rgba(0,0,0,0.25);
    }

    .cc-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 15px;
    }

    .cc-modal-header h2 {
      color: #312e81;
      margin: 0 0 8px;
    }

    .cc-modal-header p {
      color: #64748b;
      margin: 0;
    }

    .cc-close {
      background: #fee2e2;
      color: #dc2626;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      font-size: 26px;
      cursor: pointer;
    }

    .cc-count {
      background: linear-gradient(90deg, #ddd6fe, #fbcfe8);
      color: #4338ca;
      padding: 16px;
      border-radius: 10px;
      margin: 22px 0;
      font-weight: bold;
    }

    .cc-table-wrap {
      overflow-x: auto;
    }

    .cc-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      background: white;
      border-radius: 10px;
      overflow: hidden;
    }

    .cc-table th {
      background: #ddd6fe;
      color: #312e81;
      padding: 15px;
      font-size: 13px;
    }

    .cc-table td {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }

    .cc-table tbody tr:hover {
      background: #fdf2f8;
    }

    .cc-error {
      color: #dc2626;
    }

    @media (max-width: 1100px) {
      .cc-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .cc-page {
        padding: 15px;
      }

      .cc-hero {
        padding: 25px;
      }

      .cc-hero h1 {
        font-size: 26px;
      }

      .cc-stats {
        grid-template-columns: 1fr;
      }

      .cc-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .cc-filters {
        flex-direction: column;
      }

      .cc-grid {
        grid-template-columns: 1fr;
      }

      .cc-modal {
        padding: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .cc-page {
        animation: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="cc-page">

        <div className="cc-hero">
          <span>CAMPUS CONNECT</span>
          <h1>Explore Campus Events</h1>
          <p>
            Discover exciting campus activities, connect with
            students, and make unforgettable memories.
          </p>
        </div>

        <div className="cc-stats">
          <div className="cc-stat">
            <p>Total Events</p>
            <h2>{events.length}</h2>
            <small>Campus activities</small>
          </div>

          <div className="cc-stat">
            <p>Upcoming Events</p>
            <h2>{upcoming}</h2>
            <small>Coming soon</small>
          </div>

          <div className="cc-stat">
            <p>Completed Events</p>
            <h2>{completed}</h2>
            <small>Successfully finished</small>
          </div>
        </div>

        <div className="cc-toolbar">
          <div>
            <h2>All Campus Events</h2>
            <p>Find and explore exciting campus events</p>
          </div>

          <div className="cc-filters">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="cc-empty">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="cc-empty">No events found.</p>
        ) : (
          <div className="cc-grid">
            {filteredEvents.map(event => (
              <div className="cc-card" key={event._id}>

                <div className="cc-image">
                  {event.image ? (
                    <img
                      src={`${API}/${event.image.replace(/^\/+/, "")}`}
                      alt={event.title}
                    />
                  ) : (
                    <div className="cc-placeholder">
                      Campus Event
                    </div>
                  )}

                  <span className={`cc-status ${event.status}`}>
                    {event.status || "Upcoming"}
                  </span>
                </div>

                <div className="cc-content">

                  <div className="cc-tags">
                    <span>{event.category || "General"}</span>
                    <span>{event.eventType || "College"}</span>
                  </div>

                  <h3>{event.title}</h3>

                  <p className="cc-description">
                    {event.description}
                  </p>

                  <div className="cc-details">
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
                      <strong>Max Participants:</strong>{" "}
                      {event.maxParticipants}
                    </p>

                    <p>
                      <strong>Registration Deadline:</strong>{" "}
                      {formatDate(event.registrationDeadline)}
                    </p>

                    <p>
                      <strong>Created By:</strong>{" "}
                      {event.createdBy?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Created Role:</strong>{" "}
                      {event.createdBy?.role || "N/A"}
                    </p>
                  </div>

                  <div className="cc-actions">

                    {role === "admin" && (
                      <>
                        <button
                          className="cc-view"
                          onClick={() =>
                            viewRegisteredStudents(event)
                          }
                        >
                          View Registered Students
                        </button>

                        <button
                          className="cc-delete"
                          onClick={() =>
                            deleteEvent(event._id)
                          }
                        >
                          Delete Event
                        </button>
                      </>
                    )}

                    {role === "student" && (
                      <button
                        className="cc-register"
                        onClick={() =>
                          registerEvent(event._id)
                        }
                        disabled={event.status !== "upcoming"}
                      >
                        {event.status === "upcoming"
                          ? "Register Now"
                          : "Registration Unavailable"}
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {role === "admin" && selectedEvent && (
          <div
            className="cc-overlay"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="cc-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Registered Students"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="cc-modal-header">
                <div>
                  <h2>Registered Students</h2>
                  <p>{selectedEvent.title}</p>
                </div>

                <button
                  className="cc-close"
                  aria-label="Close student list"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>
              </div>

              <div className="cc-count">
                Total Registered: {registeredStudents.length}
              </div>

              {loadingStudents ? (
                <p>Loading students...</p>
              ) : studentsError ? (
                <p className="cc-error">{studentsError}</p>
              ) : registeredStudents.length === 0 ? (
                <p>No students registered for this event.</p>
              ) : (
                <div className="cc-table-wrap">
                  <table className="cc-table">
                    <thead>
                      <tr>
                        <th>Sl No</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Registered At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {registeredStudents.map((reg, index) => (
                        <tr key={reg._id || index}>
                          <td>{index + 1}</td>
                          <td>{reg.userId?.name || "N/A"}</td>
                          <td>{reg.userId?.email || "N/A"}</td>
                          <td>{formatDate(reg.registeredAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default AdminAllEvent;

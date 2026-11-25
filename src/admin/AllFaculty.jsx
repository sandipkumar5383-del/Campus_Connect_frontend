
import axios from "axios";
import { useEffect, useState } from "react";

function AllFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const API = "http://localhost:8000";

  const fetchFaculty = async () => {
    try {
      setError("");
      const res = await axios.get(`${API}/api/allFaculty`);
      setFaculty(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch faculty error:", err);
      setError("Failed to load faculty members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const changeStatus = async (id) => {
    if (!window.confirm("Do you want to change this faculty member's status?")) {
      return;
    }

    setUpdatingId(id);

    try {
      const res = await axios.get(
        `${API}/api/changeStatus/${id}`
      );

      alert(res.data.message || "Status updated successfully");
      await fetchFaculty();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to change faculty status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalFaculty = faculty.length;

  const activeFaculty = faculty.filter(
    user => String(user.status).toLowerCase() === "active"
  ).length;

  const inactiveFaculty = faculty.filter(
    user => String(user.status).toLowerCase() === "inactive"
  ).length;

  const filteredFaculty = faculty.filter(user => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      (user.name || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword) ||
      String(user.phone || "").includes(keyword);

    const matchesStatus =
      filter === "all" ||
      String(user.status || "").toLowerCase() === filter;

    return matchesSearch && matchesStatus;
  });

  const styles = `
    .faculty-page {
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
      animation: facultyBackground 15s ease infinite;
    }

    @keyframes facultyBackground {
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

    .faculty-hero {
      background: linear-gradient(
        120deg,
        #7c3aed,
        #ec4899,
        #f97316
      );
      padding: 42px;
      border-radius: 22px;
      color: white;
      margin-bottom: 25px;
      box-shadow: 0 12px 35px rgba(124,58,237,0.2);
    }

    .faculty-hero span {
      color: #fce7f3;
      letter-spacing: 2px;
      font-size: 12px;
      font-weight: bold;
    }

    .faculty-hero h1 {
      font-size: 34px;
      margin: 12px 0;
    }

    .faculty-hero p {
      color: #fff7ed;
      line-height: 1.6;
      margin: 0;
    }

    .faculty-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .faculty-stat {
      padding: 25px;
      border-radius: 18px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      transition: transform 0.3s;
    }

    .faculty-stat:hover {
      transform: translateY(-5px);
    }

    .faculty-stat:nth-child(1) {
      background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
    }

    .faculty-stat:nth-child(2) {
      background: linear-gradient(135deg, #bbf7d0, #86efac);
    }

    .faculty-stat:nth-child(3) {
      background: linear-gradient(135deg, #bfdbfe, #93c5fd);
    }

    .faculty-stat p {
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .faculty-stat h2 {
      font-size: 36px;
      color: #312e81;
      margin: 12px 0;
    }

    .faculty-stat small {
      color: #475569;
    }

    .faculty-panel {
      background: rgba(255,255,255,0.92);
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .faculty-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .faculty-toolbar h2 {
      margin: 0 0 6px;
      color: #312e81;
    }

    .faculty-toolbar p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .faculty-filters {
      display: flex;
      gap: 12px;
    }

    .faculty-filters input,
    .faculty-filters select {
      padding: 12px 15px;
      border: 1px solid #d8b4fe;
      border-radius: 10px;
      background: white;
      font-size: 14px;
      outline: none;
    }

    .faculty-filters input:focus,
    .faculty-filters select:focus {
      border-color: #7c3aed;
    }

    .faculty-table-wrap {
      width: 100%;
      overflow-x: auto;
    }

    .faculty-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 850px;
    }

    .faculty-table thead {
      background: linear-gradient(
        90deg,
        #7c3aed,
        #6366f1,
        #ec4899
      );
      color: white;
    }

    .faculty-table th {
      padding: 17px 15px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .faculty-table td {
      padding: 16px 15px;
      border-bottom: 1px solid #e9d5ff;
      font-size: 14px;
      color: #334155;
    }

    .faculty-table tbody tr:nth-child(even) {
      background: #fdf2f8;
    }

    .faculty-table tbody tr:hover {
      background: #ede9fe;
      transition: 0.2s;
    }

    .faculty-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }

    .faculty-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .faculty-role {
      background: #ede9fe;
      color: #6d28d9;
      padding: 6px 11px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .faculty-status {
      padding: 7px 13px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      text-transform: capitalize;
    }

    .faculty-status.active {
      background: #dcfce7;
      color: #15803d;
    }

    .faculty-status.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .faculty-status.other {
      background: #e2e8f0;
      color: #475569;
    }

    .faculty-action {
      padding: 10px 16px;
      border: none;
      border-radius: 9px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s;
      color: white;
      background: linear-gradient(90deg, #7c3aed, #6366f1);
      white-space: nowrap;
    }

    .faculty-action.deactivate {
      background: linear-gradient(90deg, #fb7185, #ef4444);
    }

    .faculty-action:hover:not(:disabled) {
      filter: brightness(0.92);
      transform: translateY(-2px);
    }

    .faculty-action:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .faculty-empty {
      text-align: center;
      padding: 45px;
      color: #64748b;
    }

    .faculty-error {
      color: #dc2626;
      text-align: center;
      padding: 20px;
    }

    .faculty-footer {
      margin-top: 20px;
      color: #64748b;
      font-size: 13px;
    }

    @media (max-width: 900px) {
      .faculty-stats {
        grid-template-columns: 1fr;
      }

      .faculty-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .faculty-filters {
        flex-direction: column;
      }
    }

    @media (max-width: 600px) {
      .faculty-page {
        padding: 15px;
      }

      .faculty-hero {
        padding: 25px;
      }

      .faculty-hero h1 {
        font-size: 26px;
      }

      .faculty-panel {
        padding: 15px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .faculty-page {
        animation: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="faculty-page">

        <div className="faculty-hero">
          <span>CAMPUS CONNECT</span>
          <h1>Faculty Management</h1>
          <p>
            Manage faculty accounts, monitor their status,
            and explore all registered faculty members.
          </p>
        </div>

        <div className="faculty-stats">
          <div className="faculty-stat">
            <p>Total Faculty</p>
            <h2>{totalFaculty}</h2>
            <small>Registered faculty members</small>
          </div>

          <div className="faculty-stat">
            <p>Active Faculty</p>
            <h2>{activeFaculty}</h2>
            <small>Currently active accounts</small>
          </div>

          <div className="faculty-stat">
            <p>Inactive Faculty</p>
            <h2>{inactiveFaculty}</h2>
            <small>Disabled accounts</small>
          </div>
        </div>

        <div className="faculty-panel">

          <div className="faculty-toolbar">
            <div>
              <h2>All Faculty</h2>
              <p>View and manage faculty member accounts</p>
            </div>

            <div className="faculty-filters">
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="faculty-table-wrap">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Year Of Joining</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="faculty-empty">
                      Loading faculty...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="faculty-error">
                      {error}
                    </td>
                  </tr>
                ) : filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="faculty-empty">
                      No faculty members found.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((user, index) => {
                    const status = String(
                      user.status || ""
                    ).toLowerCase();

                    return (
                      <tr key={user._id || index}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="faculty-name">
                            <div className="faculty-avatar">
                              {user.name?.charAt(0).toUpperCase() || "F"}
                            </div>
                            <span>{user.name || "N/A"}</span>
                          </div>
                        </td>

                        <td>{user.email || "N/A"}</td>
                        <td>{user.phone || "N/A"}</td>
                        <td>{user.yearOfJoining || "N/A"}</td>

                        <td>
                          <span className="faculty-role">
                            {user.role || "faculty"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`faculty-status ${
                              status === "active" || status === "inactive"
                                ? status
                                : "other"
                            }`}
                          >
                            {user.status || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <button
                            className={`faculty-action ${
                              status === "active" ? "deactivate" : ""
                            }`}
                            onClick={() => changeStatus(user._id)}
                            disabled={updatingId === user._id}
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="faculty-footer">
            Showing {filteredFaculty.length} of {totalFaculty} faculty members
          </div>

        </div>
      </div>
    </>
  );
}

export default AllFaculty;

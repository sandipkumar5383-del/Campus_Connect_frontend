
import axios from "axios";
import { useEffect, useState } from "react";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API = "http://localhost:8000";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/allUser`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch students error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeStatus = async (id) => {
    if (!window.confirm("Do you want to change this student's status?")){ 
      return;
    }

    setUpdatingId(id);

    try {
      const res = await axios.get(
        `${API}/api/changeStatus/${id}`
      );

      alert(res.data.message || "Status updated successfully");
      await fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to change student status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalStudents = users.length;

  const activeStudents = users.filter(
    user => user.status?.toLowerCase() === "active"
  ).length;

  const inactiveStudents = users.filter(
    user => user.status?.toLowerCase() === "inactive"
  ).length;

  const filteredUsers = users.filter(user => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      (user.name || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword) ||
      String(user.phone || "").includes(keyword);

    const matchesStatus =
      filter === "all" ||
      user.status?.toLowerCase() === filter;

    return matchesSearch && matchesStatus;
  });

  const styles = `
    .students-page {
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
      animation: studentBackground 15s ease infinite;
    }

    @keyframes studentBackground {
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

    .students-hero {
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

    .students-hero span {
      color: #fce7f3;
      letter-spacing: 2px;
      font-size: 12px;
      font-weight: bold;
    }

    .students-hero h1 {
      font-size: 34px;
      margin: 12px 0;
    }

    .students-hero p {
      color: #fff7ed;
      line-height: 1.6;
      margin: 0;
    }

    .students-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .students-stat {
      padding: 25px;
      border-radius: 18px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      transition: transform 0.3s;
    }

    .students-stat:hover {
      transform: translateY(-5px);
    }

    .students-stat:nth-child(1) {
      background: linear-gradient(135deg, #fbcfe8, #f9a8d4);
    }

    .students-stat:nth-child(2) {
      background: linear-gradient(135deg, #bbf7d0, #86efac);
    }

    .students-stat:nth-child(3) {
      background: linear-gradient(135deg, #bfdbfe, #93c5fd);
    }

    .students-stat p {
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .students-stat h2 {
      font-size: 36px;
      color: #312e81;
      margin: 12px 0;
    }

    .students-stat small {
      color: #475569;
    }

    .students-panel {
      background: rgba(255,255,255,0.92);
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .students-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .students-toolbar h2 {
      margin: 0 0 6px;
      color: #312e81;
    }

    .students-toolbar p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .students-filters {
      display: flex;
      gap: 12px;
    }

    .students-filters input,
    .students-filters select {
      padding: 12px 15px;
      border: 1px solid #d8b4fe;
      border-radius: 10px;
      background: white;
      font-size: 14px;
      outline: none;
    }

    .students-filters input:focus,
    .students-filters select:focus {
      border-color: #7c3aed;
    }

    .students-table-wrap {
      width: 100%;
      overflow-x: auto;
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 850px;
    }

    .students-table thead {
      background: linear-gradient(
        90deg,
        #7c3aed,
        #6366f1,
        #ec4899
      );
      color: white;
    }

    .students-table th {
      padding: 17px 15px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .students-table td {
      padding: 16px 15px;
      border-bottom: 1px solid #e9d5ff;
      font-size: 14px;
      color: #334155;
    }

    .students-table tbody tr:nth-child(even) {
      background: #fdf2f8;
    }

    .students-table tbody tr:hover {
      background: #ede9fe;
      transition: 0.2s;
    }

    .student-name {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }

    .student-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .student-role {
      background: #ede9fe;
      color: #6d28d9;
      padding: 6px 11px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .student-status {
      padding: 7px 13px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      text-transform: capitalize;
    }

    .student-status.active {
      background: #dcfce7;
      color: #15803d;
    }

    .student-status.inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    .student-status.other {
      background: #e2e8f0;
      color: #475569;
    }

    .student-action {
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

    .student-action.deactivate {
      background: linear-gradient(90deg, #fb7185, #ef4444);
    }

    .student-action:hover:not(:disabled) {
      filter: brightness(0.92);
      transform: translateY(-2px);
    }

    .student-action:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .students-empty {
      text-align: center;
      padding: 45px;
      color: #64748b;
    }

    .students-footer {
      margin-top: 20px;
      color: #64748b;
      font-size: 13px;
    }

    @media (max-width: 900px) {
      .students-stats {
        grid-template-columns: 1fr;
      }

      .students-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .students-filters {
        flex-direction: column;
      }
    }

    @media (max-width: 600px) {
      .students-page {
        padding: 15px;
      }

      .students-hero {
        padding: 25px;
      }

      .students-hero h1 {
        font-size: 26px;
      }

      .students-panel {
        padding: 15px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .students-page {
        animation: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="students-page">

        <div className="students-hero">
          <span>CAMPUS CONNECT</span>
          <h1>Student Management</h1>
          <p>
            Manage student accounts, monitor their status,
            and explore all registered students in one place.
          </p>
        </div>

        <div className="students-stats">
          <div className="students-stat">
            <p>Total Students</p>
            <h2>{totalStudents}</h2>
            <small>Registered students</small>
          </div>

          <div className="students-stat">
            <p>Active Students</p>
            <h2>{activeStudents}</h2>
            <small>Currently active accounts</small>
          </div>

          <div className="students-stat">
            <p>Inactive Students</p>
            <h2>{inactiveStudents}</h2>
            <small>Disabled accounts</small>
          </div>
        </div>

        <div className="students-panel">

          <div className="students-toolbar">
            <div>
              <h2>All Students</h2>
              <p>View and manage registered student accounts</p>
            </div>

            <div className="students-filters">
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

          <div className="students-table-wrap">
            <table className="students-table">
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
                    <td colSpan="8" className="students-empty">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="students-empty">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const status = String(
                      user.status || ""
                    ).toLowerCase();

                    return (
                      <tr key={user._id || index}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="student-name">
                            <div className="student-avatar">
                              {user.name?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <span>{user.name || "N/A"}</span>
                          </div>
                        </td>

                        <td>{user.email || "N/A"}</td>
                        <td>{user.phone || "N/A"}</td>
                        <td>{user.yearOfJoining || "N/A"}</td>

                        <td>
                          <span className="student-role">
                            {user.role || "student"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`student-status ${
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
                            className={`student-action ${
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

          <div className="students-footer">
            Showing {filteredUsers.length} of {totalStudents} students
          </div>

        </div>
      </div>
    </>
  );
}

export default AllUser;

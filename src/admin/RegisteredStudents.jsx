
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisteredStudents() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/registeredStudents/${eventId}`
      )
      .then((res) => {
        setStudents(res.data.students || []);
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(
          err.response?.data?.message ||
            "Failed to load registered students"
        );
      })
      .finally(() => setLoading(false));

    axios
      .get("http://localhost:8000/api/allEvent")
      .then((res) => {
        const event = res.data.find((item) => item._id === eventId);
        if (event) setEventTitle(event.title);
      })
      .catch((err) => console.error(err));
  }, [eventId]);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>Back to Events</button>

      <h2>Registered Students {eventTitle && `- ${eventTitle}`}</h2>
      <h3>Total Registered: {students.length}</h3>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students registered for this event.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          width="100%"
          style={{ textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Registered At</th>
            </tr>
          </thead>

          <tbody>
            {students.map((registration, index) => (
              <tr key={registration._id}>
                <td>{index + 1}</td>
                <td>{registration.userId?.name || "N/A"}</td>
                <td>{registration.userId?.email || "N/A"}</td>
                <td>
                  {registration.registeredAt
                    ? new Date(
                        registration.registeredAt
                      ).toLocaleString("en-GB")
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RegisteredStudents;

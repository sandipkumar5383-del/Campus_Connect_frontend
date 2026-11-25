import { useEffect, useState } from "react";
import axios from "axios";

function AllEvent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/allEvent").then((res) => {
      setEvents(res.data);
    });
  }, []);
  const role = localStorage.getItem("role");
  const deleteEvent = (id) => {
    axios.delete(`http://localhost:8000/api/deleteEvent/${id}`).then((res) => {
      alert(res.data.message);
      location.reload();
    })
    .catch((err) => {
      alert(err.response?.data?.message || "Failed to delete event");
    });
  };

  return (
    <>
      <p>All Events</p>
      <table
        border="1"
        width="100%"
        style={{ textAlign: "center" }}
      >
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Venue</th>
            <th>Organizer</th>
            <th>Image</th>
            <th>Max Participants</th>
            <th>Registration Deadline</th>
            <th>Created By</th>
            <th>Created is</th>
            <th>Status</th>
            <th>Action</th>
            

          </tr>
        </thead>
        <tbody>
          {events.map((events, index) => (
            <tr key={events._id || index}>
              <td>{index + 1}</td>
              <td>{events.title}</td>
              <td>{events.description}</td>
              <td>{events.category}</td>
              <td>{events.eventType}</td>
              <td>{events.startTime}</td>           
              <td>{events.endTime}</td>
              <td>
    {events.eventDate
        ? new Date(events.eventDate).toLocaleDateString("en-GB")
        : ""}
</td>
              <td>{events.venue}</td>
              <td>{events.organizer}</td>
              <td>
                <img src={`http://localhost:8000/${events.image}`} alt="event" height={"100px"} width={"100px"} />
                
              </td>
              <td>{events.maxParticipants}</td>
<td>
    {events.registrationDeadline
        ? new Date(events.registrationDeadline).toLocaleDateString("en-GB")
        : ""}
</td>             
              <td>{events.createdBy?.name}</td>
              <td>{events.createdBy?.role}</td>
              <td>{events.status}</td>
              <td>
                {role === "admin" && (
                  <button onClick={() => deleteEvent(events._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default AllEvent;

import { useState, useRef, useEffect } from "react";
import axios from "axios";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  eventType: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venue: "",
  organizer: "",
  registrationDeadline: "",
  maxParticipants: ""
};

function CreateEvent() {
  const [myFormData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0] || null;
    setImage(file);
  };

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const userid = localStorage.getItem("userid");

    if (!userid) {
      alert("Please login first");
      return;
    }

    if (!image) {
      alert("Please select an event image");
      return;
    }

    if (myFormData.endTime <= myFormData.startTime) {
      alert("End time must be after start time");
      return;
    }

    if (myFormData.registrationDeadline > myFormData.eventDate) {
      alert("Registration deadline cannot be after event date");
      return;
    }

    if (Number(myFormData.maxParticipants) < 1) {
      alert("Maximum participants must be at least 1");
      return;
    }

    const formData = new FormData();

    Object.entries(myFormData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("createdBy", userid);
    formData.append("image", image);

    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/createEvent",
        formData
      );

      alert(
        response.data.message ||
        "Event created successfully"
      );

      setFormData({ ...initialFormData });
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to create event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const styles = `
    .create-event-page {
      min-height: 100vh;
      padding: 35px 20px;
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
      animation: createEventBackground 15s ease infinite;
    }

    @keyframes createEventBackground {
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

    .create-event-container {
      max-width: 1050px;
      margin: auto;
    }

    .create-event-hero {
      background: linear-gradient(
        120deg,
        #7c3aed,
        #ec4899,
        #f97316
      );
      color: white;
      padding: 40px;
      border-radius: 22px 22px 0 0;
      box-shadow: 0 12px 35px rgba(124,58,237,0.2);
    }

    .create-event-hero span {
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: 700;
      color: #fce7f3;
    }

    .create-event-hero h1 {
      font-size: 34px;
      margin: 12px 0;
    }

    .create-event-hero p {
      color: #fff7ed;
      line-height: 1.7;
      margin: 0;
    }

    .create-event-form {
      background: rgba(255,255,255,0.95);
      padding: 35px;
      border-radius: 0 0 22px 22px;
      box-shadow: 0 15px 40px rgba(30,41,59,0.12);
    }

    .create-event-section-title {
      font-size: 20px;
      color: #6d28d9;
      margin: 0 0 22px;
      padding-bottom: 12px;
      border-bottom: 2px solid #ede9fe;
    }

    .create-event-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
      margin-bottom: 30px;
    }

    .create-event-field {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    .create-event-field.full {
      grid-column: 1 / -1;
    }

    .create-event-field label {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
    }

    .create-event-field label span {
      color: #ec4899;
    }

    .create-event-field input,
    .create-event-field textarea,
    .create-event-field select {
      width: 100%;
      box-sizing: border-box;
      padding: 13px 15px;
      border: 1.5px solid #ddd6fe;
      border-radius: 11px;
      background: #fafaff;
      font-family: inherit;
      font-size: 14px;
      color: #1e293b;
      outline: none;
      transition: 0.2s;
    }

    .create-event-field input:focus,
    .create-event-field textarea:focus,
    .create-event-field select:focus {
      border-color: #8b5cf6;
      background: white;
      box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
    }

    .create-event-field textarea {
      resize: vertical;
      min-height: 115px;
    }

    .create-event-field input[type="file"] {
      background: #fdf2f8;
      cursor: pointer;
    }

    .create-event-hint {
      font-size: 12px;
      color: #64748b;
    }

    .create-event-preview {
      border: 2px dashed #c4b5fd;
      background: linear-gradient(135deg, #faf5ff, #fdf2f8);
      border-radius: 14px;
      padding: 15px;
      margin-top: 10px;
    }

    .create-event-preview img {
      display: block;
      width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 10px;
    }

    .create-event-preview p {
      font-size: 13px;
      color: #64748b;
      margin: 12px 0 0;
      overflow-wrap: anywhere;
    }

    .create-event-actions {
      border-top: 1px solid #e9d5ff;
      padding-top: 25px;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    .create-event-btn {
      border: none;
      padding: 14px 25px;
      border-radius: 11px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
    }

    .create-event-reset {
      background: #f1f5f9;
      color: #475569;
    }

    .create-event-submit {
      background: linear-gradient(
        90deg,
        #7c3aed,
        #ec4899,
        #f97316
      );
      color: white;
      box-shadow: 0 5px 15px rgba(236,72,153,0.2);
    }

    .create-event-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      filter: brightness(0.95);
    }

    .create-event-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 700px) {
      .create-event-page {
        padding: 15px;
      }

      .create-event-hero {
        padding: 25px;
      }

      .create-event-hero h1 {
        font-size: 26px;
      }

      .create-event-form {
        padding: 20px;
      }

      .create-event-grid {
        grid-template-columns: 1fr;
      }

      .create-event-actions {
        flex-direction: column;
      }

      .create-event-btn {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .create-event-page {
        animation: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="create-event-page">
        <div className="create-event-container">

          <div className="create-event-hero">
            <span>CAMPUS CONNECT</span>
            <h1>Create New Event</h1>
            <p>
              Bring your campus ideas to life. Create and organize
              exciting events for students and faculty.
            </p>
          </div>

          <form
            className="create-event-form"
            onSubmit={handleSubmit}
          >

            <h2 className="create-event-section-title">
              Event Information
            </h2>

            <div className="create-event-grid">

              <div className="create-event-field full">
                <label htmlFor="title">
                  Event Title <span>*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={myFormData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="create-event-field full">
                <label htmlFor="description">
                  Event Description <span>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={myFormData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="category">
                  Category <span>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={myFormData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Category</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="create-event-field">
                <label htmlFor="eventType">
                  Event Type <span>*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={myFormData.eventType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Event Type</option>
                  <option value="College">College</option>
                  <option value="Department">Department</option>
                  <option value="Club">Club</option>
                </select>
              </div>

            </div>

            <h2 className="create-event-section-title">
              Event Schedule & Location
            </h2>

            <div className="create-event-grid">

              <div className="create-event-field">
                <label htmlFor="eventDate">
                  Event Date <span>*</span>
                </label>
                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={myFormData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="registrationDeadline">
                  Registration Deadline <span>*</span>
                </label>
                <input
                  id="registrationDeadline"
                  type="date"
                  name="registrationDeadline"
                  value={myFormData.registrationDeadline}
                  onChange={handleChange}
                  max={myFormData.eventDate || undefined}
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="startTime">
                  Start Time <span>*</span>
                </label>
                <input
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={myFormData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="endTime">
                  End Time <span>*</span>
                </label>
                <input
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={myFormData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="venue">
                  Venue <span>*</span>
                </label>
                <input
                  id="venue"
                  type="text"
                  name="venue"
                  value={myFormData.venue}
                  onChange={handleChange}
                  placeholder="Enter event venue"
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="organizer">
                  Organizer <span>*</span>
                </label>
                <input
                  id="organizer"
                  type="text"
                  name="organizer"
                  value={myFormData.organizer}
                  onChange={handleChange}
                  placeholder="Enter organizer name"
                  required
                />
              </div>

            </div>

            <h2 className="create-event-section-title">
              Registration & Event Image
            </h2>

            <div className="create-event-grid">

              <div className="create-event-field">
                <label htmlFor="maxParticipants">
                  Maximum Participants <span>*</span>
                </label>
                <input
                  id="maxParticipants"
                  type="number"
                  name="maxParticipants"
                  min="1"
                  value={myFormData.maxParticipants}
                  onChange={handleChange}
                  placeholder="Enter maximum participants"
                  required
                />
              </div>

              <div className="create-event-field">
                <label htmlFor="image">
                  Event Image <span>*</span>
                </label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  required
                />
                <span className="create-event-hint">
                  Select an image for your event poster.
                </span>
              </div>

              {preview && (
                <div className="create-event-field full">
                  <label>Image Preview</label>
                  <div className="create-event-preview">
                    <img src={preview} alt="Event preview" />
                    <p>{image?.name}</p>
                  </div>
                </div>
              )}

            </div>

            <div className="create-event-actions">
              <button
                type="button"
                className="create-event-btn create-event-reset"
                onClick={() => {
                  setFormData({ ...initialFormData });
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={submitting}
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="create-event-btn create-event-submit"
                disabled={submitting}
              >
                {submitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEvent;

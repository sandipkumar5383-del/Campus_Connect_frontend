
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const initialFormData = {
  clubName: "",
  description: "",
  category: "",
  rules: ""
};

function CreateClub() {
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fileRef = useRef(null);

  const userid = localStorage.getItem("userid");

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      setMessageType("error");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      setMessageType("error");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(file);
    setMessage("");
  };

  // Image preview
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageURL = URL.createObjectURL(image);
    setPreview(imageURL);

    return () => URL.revokeObjectURL(imageURL);
  }, [image]);

  // Reset form
  const resetForm = () => {
    setFormData({ ...initialFormData });
    setImage(null);
    setMessage("");
    setMessageType("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Submit club data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!userid) {
      setMessage("Please login before creating a club.");
      setMessageType("error");
      return;
    }

    if (
      !formData.clubName.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    const data = new FormData();

    data.append("clubName", formData.clubName.trim());
    data.append("description", formData.description.trim());
    data.append("category", formData.category);
    data.append("rules", formData.rules.trim());
    data.append("createdBy", userid);

    if (image) {
      data.append("image", image);
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.post(
        "http://localhost:8000/club/createClub",
        data,
        config
      );

      setMessage(
        response.data?.message ||
        "Club created successfully!"
      );

      setMessageType("success");

      setFormData({ ...initialFormData });
      setImage(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

    } catch (error) {
      console.error(
        "Create club error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "Please login again."
          : error.response?.status === 403
          ? "You do not have permission to create a club."
          : error.response?.status === 409
          ? "This club already exists."
          : error.response?.status === 400
          ? "Invalid club details. Check the required fields."
          : "Unable to create club. Please try again.")
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .create-club-page {
          min-height: 100vh;
          padding: 35px 20px;
          font-family: "Segoe UI", Arial, sans-serif;
          background: linear-gradient(
            -45deg,
            #ff9a9e,
            #fad0c4,
            #a18cd1,
            #84fab0,
            #8fd3f4,
            #fbc2eb
          );
          background-size: 400% 400%;
          animation: clubBg 15s ease infinite;
        }

        @keyframes clubBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .create-club-container {
          max-width: 900px;
          margin: auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .create-club-header {
          background: linear-gradient(
            120deg,
            #7c3aed,
            #ec4899,
            #f97316
          );
          padding: 40px;
          color: white;
        }

        .create-club-header h1 {
          font-size: 34px;
          margin: 10px 0;
        }

        .create-club-header p {
          line-height: 1.7;
          opacity: 0.95;
        }

        .create-club-tag {
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .create-club-form {
          padding: 35px;
          background: rgba(255,255,255,0.97);
        }

        .create-club-section {
          color: #6d28d9;
          font-size: 21px;
          margin-bottom: 25px;
          padding-bottom: 12px;
          border-bottom: 2px solid #ede9fe;
        }

        .create-club-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .create-club-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 18px;
        }

        .create-club-full {
          grid-column: 1 / -1;
        }

        .create-club-field label {
          font-weight: 600;
          color: #334155;
          font-size: 14px;
        }

        .create-club-field input,
        .create-club-field select,
        .create-club-field textarea {
          padding: 14px 16px;
          border: 1.5px solid #ddd6fe;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          background: #fafaff;
          width: 100%;
          box-sizing: border-box;
          transition: 0.3s;
        }

        .create-club-field input:focus,
        .create-club-field select:focus,
        .create-club-field textarea:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
          background: white;
        }

        .create-club-field textarea {
          min-height: 120px;
          resize: vertical;
        }

        .create-club-field input[type="file"] {
          background: #fdf2f8;
          cursor: pointer;
        }

        .create-club-required {
          color: #ec4899;
        }

        .create-club-preview {
          background: linear-gradient(
            135deg,
            #faf5ff,
            #fdf2f8
          );
          border: 2px dashed #c4b5fd;
          border-radius: 15px;
          padding: 15px;
          text-align: center;
        }

        .create-club-preview img {
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
          border-radius: 12px;
        }

        .create-club-preview p {
          font-size: 13px;
          color: #64748b;
          overflow-wrap: anywhere;
        }

        .create-club-message {
          padding: 15px;
          border-radius: 12px;
          margin: 15px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .create-club-success {
          background: #dcfce7;
          color: #166534;
        }

        .create-club-error {
          background: #fee2e2;
          color: #b91c1c;
        }

        .create-club-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #e9d5ff;
        }

        .create-club-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s;
        }

        .create-club-reset {
          background: #e2e8f0;
          color: #334155;
        }

        .create-club-submit {
          background: linear-gradient(
            90deg,
            #7c3aed,
            #ec4899,
            #f97316
          );
          color: white;
        }

        .create-club-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .create-club-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 700px) {
          .create-club-page {
            padding: 15px;
          }

          .create-club-header {
            padding: 25px;
          }

          .create-club-header h1 {
            font-size: 26px;
          }

          .create-club-form {
            padding: 20px;
          }

          .create-club-grid {
            grid-template-columns: 1fr;
          }

          .create-club-buttons {
            flex-direction: column;
          }

          .create-club-btn {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .create-club-page {
            animation: none;
          }
        }
      `}</style>

      <div className="create-club-page">
        <div className="create-club-container">

          <div className="create-club-header">
            <span className="create-club-tag">
              CAMPUS CONNECT | CLUB MANAGEMENT
            </span>

            <h1>Create New Club</h1>

            <p>
              Build your campus community, connect students,
              share ideas and organize exciting club activities.
            </p>
          </div>

          <form
            className="create-club-form"
            onSubmit={handleSubmit}
          >

            <h2 className="create-club-section">
              Club Information
            </h2>

            <div className="create-club-grid">

              <div className="create-club-field create-club-full">
                <label htmlFor="clubName">
                  Club Name
                  <span className="create-club-required"> *</span>
                </label>

                <input
                  id="clubName"
                  type="text"
                  name="clubName"
                  placeholder="Enter club name"
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-club-field create-club-full">
                <label htmlFor="description">
                  Club Description
                  <span className="create-club-required"> *</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your club's purpose and activities..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-club-field create-club-full">
                <label htmlFor="category">
                  Club Category
                  <span className="create-club-required"> *</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Literary">Literary</option>
                  <option value="Social">Social</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="create-club-field create-club-full">
                <label htmlFor="rules">
                  Club Rules
                </label>

                <textarea
                  id="rules"
                  name="rules"
                  placeholder="Enter club rules and guidelines..."
                  value={formData.rules}
                  onChange={handleChange}
                />
              </div>

              <div className="create-club-field create-club-full">
                <label htmlFor="image">
                  Club Image
                </label>

                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div>

              {preview && (
                <div className="create-club-field create-club-full">
                  <label>Image Preview</label>

                  <div className="create-club-preview">
                    <img
                      src={preview}
                      alt="Club preview"
                    />
                    <p>{image?.name}</p>
                  </div>
                </div>
              )}

            </div>

            {message && (
              <div
                className={`create-club-message ${
                  messageType === "success"
                    ? "create-club-success"
                    : "create-club-error"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <div className="create-club-buttons">
              <button
                type="button"
                className="create-club-btn create-club-reset"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>

              <button
                type="submit"
                className="create-club-btn create-club-submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Club"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default CreateClub;

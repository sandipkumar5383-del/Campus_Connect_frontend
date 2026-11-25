
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    yearOfJoining: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/createUser",
        formData
      );

      setSuccess(response.data.message || "Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        yearOfJoining: "",
        role: "student",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          padding: 35px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: Arial, sans-serif;
          background: #080d20;
        }

        .register-page::before,
        .register-page::after {
          content: "";
          position: fixed;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.6;
          pointer-events: none;
        }

        .register-page::before {
          background: #7c3aed;
          top: -140px;
          left: -100px;
        }

        .register-page::after {
          background: #0891b2;
          right: -120px;
          bottom: -140px;
        }

        .register-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1050px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 26px;
          background: rgba(255,255,255,0.07);
          box-shadow: 0 30px 90px rgba(0,0,0,0.4);
          backdrop-filter: blur(18px);
        }

        .register-info {
          padding: 45px 38px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
          background: linear-gradient(
            145deg,
            rgba(99,102,241,0.22),
            rgba(8,145,178,0.06)
          );
        }

        .register-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 21px;
          font-weight: 800;
        }

        .register-logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          font-size: 25px;
          box-shadow: 0 8px 25px rgba(99,102,241,0.3);
        }

        .register-info-content {
          margin: 40px 0;
        }

        .register-tag {
          display: inline-block;
          padding: 9px 12px;
          border: 1px solid rgba(165,180,252,0.3);
          border-radius: 30px;
          background: rgba(99,102,241,0.13);
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .register-info h1 {
          margin: 23px 0 17px;
          font-size: clamp(32px, 4vw, 45px);
          line-height: 1.17;
          letter-spacing: -1.5px;
        }

        .register-info h1 span {
          color: #67e8f9;
        }

        .register-info p {
          color: #b8c4df;
          font-size: 14px;
          line-height: 1.9;
        }

        .register-benefits {
          display: grid;
          gap: 18px;
          margin-top: 30px;
        }

        .register-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e2e8f0;
          font-size: 13px;
        }

        .register-benefit-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          font-size: 18px;
        }

        .register-footer {
          color: #94a3b8;
          font-size: 11px;
        }

        .register-form-panel {
          padding: 38px 42px;
          background: #ffffff;
        }

        .register-mobile-brand {
          display: none;
        }

        .register-heading {
          margin: 0 0 9px;
          color: #111827;
          font-size: 30px;
          letter-spacing: -1px;
        }

        .register-subheading {
          margin: 0 0 25px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .register-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 16px;
        }

        .register-field {
          min-width: 0;
          margin-bottom: 17px;
        }

        .register-field.full {
          grid-column: 1 / -1;
        }

        .register-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .register-input,
        .register-select {
          width: 100%;
          height: 47px;
          padding: 0 12px;
          outline: none;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          font-size: 13px;
          transition: 0.2s;
        }

        .register-input:focus,
        .register-select:focus {
          border-color: #8b5cf6;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
        }

        .register-input::placeholder {
          color: #94a3b8;
        }

        .register-error,
        .register-success {
          padding: 11px 12px;
          margin-bottom: 16px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
        }

        .register-error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .register-success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        .register-submit {
          width: 100%;
          min-height: 49px;
          margin-top: 3px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(110deg, #7c3aed, #4f46e5, #0891b2);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(99,102,241,0.22);
          transition: 0.2s;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(99,102,241,0.32);
        }

        .register-submit:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .register-login-link {
          margin-top: 20px;
          color: #64748b;
          text-align: center;
          font-size: 12px;
        }

        .register-login-link a {
          color: #6d28d9;
          font-weight: 700;
          text-decoration: none;
        }

        .register-login-link a:hover {
          text-decoration: underline;
        }

        .register-security {
          margin-top: 18px;
          color: #64748b;
          text-align: center;
          font-size: 11px;
        }

        @media (max-width: 760px) {
          .register-page {
            padding: 18px 12px;
          }

          .register-shell {
            max-width: 480px;
            grid-template-columns: 1fr;
          }

          .register-info {
            display: none;
          }

          .register-form-panel {
            padding: 30px 23px;
          }

          .register-mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 25px;
            color: #312e81;
            font-size: 19px;
            font-weight: 800;
          }

          .register-heading {
            font-size: 27px;
          }
        }

        @media (max-width: 390px) {
          .register-grid {
            grid-template-columns: 1fr;
          }

          .register-field.full {
            grid-column: auto;
          }

          .register-form-panel {
            padding: 26px 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .register-input,
          .register-select,
          .register-submit {
            transition: none;
          }
        }
      `}</style>

      <div className="register-shell">
        <section className="register-info">
          <div className="login-brand">
  <img
    src="/campus-connect-logo.png"
    alt="Campus Connect Logo"
    className="register-logo"
  />
  <span>Campus Connect</span>
</div>
          <div className="register-info-content">
            <span className="register-tag">
              JOIN OUR COMMUNITY
            </span>

            <h1>
              Your Campus.
              <br />
              Your <span>Future.</span>
            </h1>

            <p>
              Create your account and become part of a connected
              campus community. Discover events, connect with
              people, and make your college journey memorable.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <div className="register-benefit-icon">🌐</div>
                Connect with your campus community
              </div>

              <div className="register-benefit">
                <div className="register-benefit-icon">📚</div>
                Stay updated with campus activities
              </div>

              <div className="register-benefit">
                <div className="register-benefit-icon">🚀</div>
                Start your journey with us
              </div>
            </div>
          </div>

          <div className="register-footer">
            © {new Date().getFullYear()} Campus Connect
          </div>
        </section>

        <section className="register-form-panel">
          <div className="register-mobile-brand">
            <div className="register-logo">🎓</div>
            <span>Campus Connect</span>
          </div>

          <h2 className="register-heading">Create Account ✨</h2>

          <p className="register-subheading">
            Fill in your details to join Campus Connect.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="register-grid">
              <div className="register-field full">
                <label className="register-label" htmlFor="reg-name">
                  Full Name
                </label>
                <input
                  className="register-input"
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="register-field full">
                <label className="register-label" htmlFor="reg-email">
                  Email Address
                </label>
                <input
                  className="register-input"
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="you@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="register-field full">
                <label className="register-label" htmlFor="reg-password">
                  Password
                </label>
                <input
                  className="register-input"
                  id="reg-password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="register-field">
                <label className="register-label" htmlFor="reg-phone">
                  Phone Number
                </label>
                <input
                  className="register-input"
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="register-field">
                <label className="register-label" htmlFor="reg-year">
                  Year of Joining
                </label>
                <input
                  className="register-input"
                  id="reg-year"
                  type="number"
                  name="yearOfJoining"
                  placeholder="e.g. 2026"
                  value={formData.yearOfJoining}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  required
                />
              </div>

              <div className="register-field full">
                <label className="register-label" htmlFor="reg-role">
                  Account Role
                </label>
                <select
                  className="register-select"
                  id="reg-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">🎓 Student</option>
                  <option value="faculty">👨‍🏫 Faculty</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="register-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="register-success" role="status">
                {success}
              </div>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div className="register-login-link">
            Already have an account?{" "}
            <Link to="/">Sign In</Link>
          </div>

          <div className="register-security">
            🔒 Your campus journey starts here
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;

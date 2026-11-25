
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ handleIsloggedin, handleRole }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/loginUser",
        formData
      );

      if (res.data.status === "inactive") {
        setError("Your account is inactive. Please contact the administrator.");
        return;
      }

      localStorage.setItem("userid", res.data._id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data));

      handleIsloggedin(true);
      handleRole(res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "faculty") {
        navigate("/faculty");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          padding: 35px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: Arial, sans-serif;
          background: #080d20;
        }

        .login-page::before,
        .login-page::after {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.65;
          pointer-events: none;
        }

        .login-page::before {
          background: #6d28d9;
          top: -140px;
          left: -100px;
        }

        .login-page::after {
          background: #0891b2;
          right: -120px;
          bottom: -140px;
        }

        .login-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1020px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 90px rgba(0,0,0,0.4);
        }

        .login-info {
          padding: 48px 42px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(
            145deg,
            rgba(99,102,241,0.20),
            rgba(8,145,178,0.06)
          );
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .login-logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          font-size: 25px;
          box-shadow: 0 8px 25px rgba(99,102,241,0.3);
        }

        .login-info-content {
          margin: 45px 0;
        }

        .login-tag {
          display: inline-block;
          padding: 9px 13px;
          border: 1px solid rgba(165,180,252,0.3);
          border-radius: 30px;
          background: rgba(99,102,241,0.13);
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .login-info h1 {
          margin: 24px 0 18px;
          font-size: clamp(34px, 4vw, 49px);
          line-height: 1.15;
          letter-spacing: -1.8px;
        }

        .login-info h1 span {
          color: #67e8f9;
        }

        .login-info p {
          max-width: 360px;
          color: #b8c4df;
          font-size: 14px;
          line-height: 1.9;
        }

        .login-benefits {
          display: grid;
          gap: 19px;
          margin-top: 32px;
        }

        .login-benefit {
          display: flex;
          align-items: center;
          gap: 13px;
          color: #e2e8f0;
          font-size: 13px;
        }

        .login-benefit-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          font-size: 18px;
        }

        .login-footer {
          color: #94a3b8;
          font-size: 11px;
        }

        .login-form-panel {
          padding: 48px 42px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-mobile-brand {
          display: none;
        }

        .login-heading {
          margin: 0 0 10px;
          color: #111827;
          font-size: 31px;
          letter-spacing: -1px;
        }

        .login-subheading {
          margin: 0 0 32px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.8;
        }

        .login-label {
          display: block;
          margin-bottom: 9px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .login-input-wrap {
          position: relative;
          margin-bottom: 22px;
        }

        .login-input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          font-size: 17px;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          height: 52px;
          padding: 0 14px 0 45px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          background: #f8fafc;
          color: #0f172a;
          font-size: 14px;
          transition: 0.2s;
        }

        .login-input:focus {
          border-color: #8b5cf6;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
        }

        .login-error {
          margin-bottom: 17px;
          padding: 12px;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          line-height: 1.6;
        }

        .login-submit,
        .login-register {
          width: 100%;
          min-height: 51px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-submit {
          border: none;
          background: linear-gradient(110deg, #7c3aed, #4f46e5, #0891b2);
          color: white;
          box-shadow: 0 9px 22px rgba(99,102,241,0.23);
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(99,102,241,0.35);
        }

        .login-submit:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .login-register {
          margin-top: 13px;
          border: 1px solid #c4b5fd;
          background: #f5f3ff;
          color: #6d28d9;
        }

        .login-register:hover {
          background: #ede9fe;
          transform: translateY(-2px);
        }

        .login-secure {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #64748b;
          font-size: 11px;
        }

        .login-divider {
          height: 1px;
          margin: 25px 0 18px;
          background: #e2e8f0;
        }

        .login-help {
          text-align: center;
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
        }

        .login-help strong {
          color: #6d28d9;
        }

        @media (max-width: 760px) {
          .login-page {
            padding: 20px 14px;
          }

          .login-shell {
            max-width: 440px;
            grid-template-columns: 1fr;
          }

          .login-info {
            display: none;
          }

          .login-form-panel {
            padding: 35px 25px;
          }

          .login-mobile-brand {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-bottom: 28px;
            color: #312e81;
            font-size: 20px;
            font-weight: 800;
          }

          .login-mobile-brand .login-logo {
            color: white;
          }

          .login-heading {
            font-size: 28px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-input,
          .login-submit,
          .login-register {
            transition: none;
          }
        }
      `}</style>

      <div className="login-shell">
        <section className="login-info">
          <div className="login-brand">
            <img
              src="/campus-connect-logo.png"
              alt="Campus Connect Logo"
              className="login-logo"
            />
            <span>Campus Connect</span>
          </div>

          <div className="login-info-content">
            <span className="login-tag">YOUR CAMPUS. YOUR COMMUNITY.</span>

            <h1>
              Your Future
              <br />
              Starts <span>Here.</span>
            </h1>

            <p>
              Discover a smarter way to experience college.
              Connect with classmates, explore events, and
              make every campus moment count.
            </p>

            <div className="login-benefits">
              <div className="login-benefit">
                <div className="login-benefit-icon">📚</div>
                <span>Learning resources in one place</span>
              </div>

              <div className="login-benefit">
                <div className="login-benefit-icon">🤝</div>
                <span>Stronger campus connections</span>
              </div>

              <div className="login-benefit">
                <div className="login-benefit-icon">🚀</div>
                <span>Opportunities to learn and grow</span>
              </div>
            </div>
          </div>

          <div className="login-footer">
            © {new Date().getFullYear()} Campus Connect
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-mobile-brand">
            <div className="login-logo">🎓</div>
            <span>Campus Connect</span>
          </div>

          <h2 className="login-heading">Welcome back 👋</h2>

          <p className="login-subheading">
            Sign in to continue your campus journey.
            We're happy to have you back!
          </p>

          <form onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="login-email">
              Email Address
            </label>

            <div className="login-input-wrap">
              <span className="login-input-icon">✉️</span>
              <input
                className="login-input"
                id="login-email"
                type="email"
                name="email"
                placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <label className="login-label" htmlFor="login-password">
              Password
            </label>

            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                className="login-input"
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In  →"}
            </button>

            <button
              className="login-register"
              type="button"
              onClick={() => navigate("/register")}
            >
              Create New Account  ↗
            </button>
          </form>

          <div className="login-secure">
            🛡️ Secure access to your campus account
          </div>

          <div className="login-divider" />

          <div className="login-help">
            Having trouble signing in?
            <br />
            <strong>Contact your campus administrator</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;


import { Link } from "react-router-dom";

function AdminLanding() {

  // Logged-in admin name
  const adminName = localStorage.getItem("name") || "Admin";

  const cards = [
    {
      icon: "👨‍🎓",
      title: "All Students",
      description: "Manage student accounts and view student details.",
      link: "/allStudent",
      color: "#6366f1",
    },
    {
      icon: "👨‍🏫",
      title: "All Faculty",
      description: "View and manage faculty members.",
      link: "/allFaculty",
      color: "#0891b2",
    },
    {
      icon: "📅",
      title: "All Events",
      description: "Explore and manage campus events.",
      link: "/allEvent",
      color: "#d946ef",
    },
    {
      icon: "✨",
      title: "Create Event",
      description: "Create new events and campus activities.",
      link: "/createEvent",
      color: "#f59e0b",
    },
    {
      icon: "🎓",
      title: "All Clubs",
      description: "Manage and view all student clubs.",
      link: "/adminAllClub",
      color: "#0bf51b",
    }
  ];

  return (
    <div className="admin-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-page {
          min-height: 100vh;
          padding: 35px 24px 50px;
          background:
            radial-gradient(circle at 0% 0%, #e0e7ff, transparent 35%),
            radial-gradient(circle at 100% 100%, #f3e8ff, transparent 35%),
            #f8fafc;
          font-family: Arial, sans-serif;
          color: #172554;
        }

        .admin-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ADMIN HERO */

        .admin-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 42px;
          border-radius: 24px;
          background: linear-gradient(
            120deg,
            #312e81,
            #4f46e5 55%,
            #7c3aed
          );
          color: white;
          box-shadow: 0 18px 40px rgba(79, 70, 229, 0.2);
        }

        .admin-hero::after {
          content: "";
          position: absolute;
          width: 270px;
          height: 270px;
          right: 40px;
          top: -140px;
          border: 1px solid rgba(255,255,255,0.17);
          border-radius: 50%;
          box-shadow:
            0 0 0 35px rgba(255,255,255,0.04),
            0 0 0 70px rgba(255,255,255,0.03);
          pointer-events: none;
        }

        .admin-hero-content {
          position: relative;
          z-index: 1;
        }

        .admin-eyebrow {
          display: inline-block;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 30px;
          background: rgba(255,255,255,0.12);
          color: #e0e7ff;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.5px;
        }

        .admin-hero h1 {
          margin: 20px 0 12px;
          font-size: clamp(30px, 4vw, 43px);
          letter-spacing: -1.5px;
        }

        .admin-hero p {
          max-width: 570px;
          margin: 0;
          color: #e0e7ff;
          font-size: 14px;
          line-height: 1.9;
        }

        /* ADMIN PROFILE IMAGE */

        .admin-hero-icon {
          position: relative;
          z-index: 1;
          width: 125px;
          height: 125px;
          flex-shrink: 0;
          border: 4px solid white;
          border-radius: 50%;
          overflow: hidden;
          background: white;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .admin-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        /* SECTION HEADING */

        .admin-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 15px;
          margin: 38px 0 20px;
        }

        .admin-section-heading h2 {
          margin: 0 0 7px;
          color: #172554;
          font-size: 23px;
        }

        .admin-section-heading p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        /* DASHBOARD CARDS */

        .admin-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .admin-card {
          min-width: 0;
          padding: 24px 21px;
          border: 1px solid #e8edf5;
          border-radius: 19px;
          background: white;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 5px 18px rgba(15,23,42,0.035);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(15,23,42,0.09);
        }

        .admin-card-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          border-radius: 16px;
          font-size: 27px;
        }

        .admin-card h3 {
          margin: 0 0 10px;
          color: #1e293b;
          font-size: 17px;
        }

        .admin-card p {
          min-height: 61px;
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
        }

        .admin-card-action {
          display: inline-block;
          margin-top: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        /* BOTTOM SECTION */

        .admin-bottom {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          margin-top: 28px;
        }

        .admin-info-card {
          padding: 26px;
          border: 1px solid #e8edf5;
          border-radius: 19px;
          background: white;
        }

        .admin-info-card h3 {
          margin: 0 0 10px;
          font-size: 18px;
          color: #172554;
        }

        .admin-info-card p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.9;
        }

        .admin-tip {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .admin-tip-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eef2ff;
          font-size: 21px;
        }

        .admin-footer {
          margin-top: 32px;
          color: #94a3b8;
          text-align: center;
          font-size: 12px;
        }

        /* TABLET RESPONSIVE */

        @media (max-width: 1000px) {
          .admin-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* MOBILE RESPONSIVE */

        @media (max-width: 650px) {
          .admin-page {
            padding: 22px 14px 35px;
          }

          .admin-hero {
            padding: 28px 23px;
            flex-direction: column-reverse;
            align-items: flex-start;
          }

          .admin-hero-icon {
            width: 90px;
            height: 90px;
          }

          .admin-hero h1 {
            font-size: 31px;
          }

          .admin-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-card-grid,
          .admin-bottom {
            grid-template-columns: 1fr;
          }

          .admin-card {
            padding: 22px;
          }

          .admin-card p {
            min-height: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-card {
            transition: none;
          }
        }
      `}</style>

      <main className="admin-container">

        {/* WELCOME ADMIN */}

        <section className="admin-hero">

          <div className="admin-hero-content">

            <span className="admin-eyebrow">
              CAMPUS CONNECT · ADMINISTRATION
            </span>

            <h1>
              Welcome, {adminName}! 👋
            </h1>

            <p>
              Manage your campus from one place. Organize student
              and faculty information, create events, and keep your
              campus community connected.
            </p>

          </div>

          {/* ADMIN PROFILE PICTURE */}

          <div className="admin-hero-icon">
            <img
              src="/admin.png"
              alt="Admin Profile"
              className="admin-profile-img"
            />
          </div>

        </section>

        {/* DASHBOARD SECTION */}

        <section>

          <div className="admin-section-heading">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Choose a section to manage your campus.</p>
            </div>
          </div>

          <div className="admin-card-grid">

            {cards.map((card) => (
              <Link
                to={card.link}
                className="admin-card"
                key={card.title}
              >

                <div
                  className="admin-card-icon"
                  style={{
                    background: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <span
                  className="admin-card-action"
                  style={{ color: card.color }}
                >
                  Open section →
                </span>

              </Link>
            ))}

          </div>

        </section>

        {/* BOTTOM INFORMATION */}

        <section className="admin-bottom">

          <div className="admin-info-card">

            <h3>🏫 Your Campus, One Platform</h3>

            <p>
              Campus Connect brings student management, faculty
              coordination, and campus events together in one
              convenient place. Use the dashboard shortcuts above
              to access your administrative tools.
            </p>

          </div>

          <div className="admin-info-card">

            <div className="admin-tip">

              <div className="admin-tip-icon">
                💡
              </div>

              <div>

                <h3>Quick Tip</h3>

                <p>
                  Create campus events to keep students and faculty
                  informed about upcoming activities and programs.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="admin-footer">
          © {new Date().getFullYear()} Campus Connect · Admin Portal
        </footer>

      </main>
    </div>
  );
}

export default AdminLanding;

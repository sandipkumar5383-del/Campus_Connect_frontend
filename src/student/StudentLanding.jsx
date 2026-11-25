
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLanding() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Student";
  const [activeSection, setActiveSection] = useState("dashboard");

  const dashboardCards = [
    {
      id: "events",
      icon: "📅",
      title: "All Campus Events",
      description:
        "Explore technical, cultural, sports and other exciting campus events.",
      button: "Explore Events",
      path: "/allEvent",
      color: "purple",
    },
    {
      id: "upcoming",
      icon: "🎉",
      title: "Upcoming Events",
      description:
        "Discover workshops, seminars, hackathons and campus activities.",
      button: "View Upcoming Events",
      path: "/allEvent",
      color: "blue",
    },
    {
      id: "registrations",
      icon: "📝",
      title: "My Registrations",
      description:
        "Check the campus events you have registered for and stay informed.",
      button: "My Registered Events",
      path: "/myRegisteredEvents",
      color: "pink",
    },
    {
      id: "createClub",
      icon: "✨",
      title: "Create Club",
      description:
        "Create a community around your interests and bring students together.",
      button: "Create a Club",
      path: "/createClub",
      color: "cyan",
    },
    {
      id: "allClubs",
      icon: "🏛️",
      title: "All Clubs",
      description:
        "Discover campus clubs, explore their activities and find your community.",
      button: "Explore All Clubs",
      path: "/allClub",
      color: "indigo",
    },
    {
      id: "clubChat",
      icon: "💬",
      title: "club Chat",
      description:
        "Discover campus clubs, explore their activities and find your community.",
      button: "Join Club Chat",
      path: "/clubChat",
      color: "yellow",
    }
  ];

  const openSection = (id, path) => {
    setActiveSection(id);
    navigate(path);
  };

  const styles = `
    * {
      box-sizing: border-box;
    }

    .student-dashboard {
      min-height: 100vh;
      padding: 30px;
      color: #172554;
      font-family: "Segoe UI", Arial, sans-serif;
      background:
        radial-gradient(ellipse at top left, #dbeafe, transparent 40%),
        radial-gradient(ellipse at bottom right, #e9d5ff, transparent 38%),
        #f5f8ff;
    }

    .student-dashboard-container {
      max-width: 1250px;
      margin: auto;
    }

    .student-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .student-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e3a8a;
      font-size: 21px;
      font-weight: 850;
    }

    .student-brand-icon {
      display: grid;
      place-items: center;
      width: 45px;
      height: 45px;
      border-radius: 14px;
      color: white;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      box-shadow: 0 7px 18px #2563eb35;
    }

    .student-active-pill {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 10px 15px;
      border: 1px solid #bfdbfe;
      border-radius: 30px;
      color: #1d4ed8;
      background: #eff6ff;
      font-size: 13px;
      font-weight: 750;
    }

    .student-blue-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #2563eb;
      box-shadow: 0 0 0 4px #bfdbfe;
    }

    .student-dashboard-hero {
      position: relative;
      overflow: hidden;
      padding: 45px;
      border: 1px solid #ffffff35;
      border-radius: 27px;
      color: white;
      background: linear-gradient(115deg, #1d4ed8, #4f46e5 55%, #7c3aed);
      box-shadow: 0 20px 45px #3730a325;
      margin-bottom: 32px;
    }

    .student-dashboard-hero::after {
      content: "";
      position: absolute;
      width: 300px;
      height: 300px;
      right: -70px;
      top: -130px;
      border: 45px solid #ffffff12;
      border-radius: 50%;
      pointer-events: none;
    }

    .student-hero-label {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: #dbeafe;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .student-dashboard-hero h1 {
      position: relative;
      z-index: 1;
      margin: 18px 0 12px;
      font-size: clamp(29px, 4vw, 43px);
      letter-spacing: -1px;
    }

    .student-dashboard-hero p {
      max-width: 650px;
      margin: 0;
      color: #e0e7ff;
      font-size: 16px;
      line-height: 1.9;
    }

    .student-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 23px;
      padding: 11px 16px;
      border: 1px solid #ffffff40;
      border-radius: 12px;
      color: white;
      background: #ffffff16;
      font-size: 13px;
      font-weight: 700;
    }

    .student-dashboard-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin: 0 0 8px;
      color: #172554;
      font-size: 27px;
    }

    .student-dashboard-subtitle {
      margin: 0 0 24px;
      color: #64748b;
      line-height: 1.7;
    }

    .student-dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 23px;
      margin-bottom: 32px;
    }

    .student-dashboard-card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 25px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      border-radius: 21px;
      background: #ffffffed;
      box-shadow: 0 8px 25px #1e3a8a0b;
      transition: transform .25s, box-shadow .25s, border-color .25s;
    }

    .student-dashboard-card:hover {
      transform: translateY(-6px);
      border-color: #93c5fd;
      box-shadow: 0 17px 35px #2563eb17;
    }

    .student-dashboard-card.active {
      border: 2px solid #3b82f6;
      box-shadow: 0 0 0 4px #dbeafe, 0 12px 30px #2563eb18;
    }

    .student-card-active-indicator {
      position: absolute;
      top: 15px;
      right: 15px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 9px;
      border-radius: 30px;
      color: #1d4ed8;
      background: #dbeafe;
      font-size: 10px;
      font-weight: 850;
    }

    .student-card-active-indicator span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #2563eb;
    }

    .student-dashboard-icon {
      display: grid;
      place-items: center;
      width: 61px;
      height: 61px;
      margin-bottom: 20px;
      border-radius: 18px;
      font-size: 29px;
    }

    .student-dashboard-card.purple .student-dashboard-icon {
      background: #ede9fe;
    }

    .student-dashboard-card.blue .student-dashboard-icon {
      background: #dbeafe;
    }

    .student-dashboard-card.pink .student-dashboard-icon {
      background: #fce7f3;
    }

    .student-dashboard-card.cyan .student-dashboard-icon {
      background: #cffafe;
    }

    .student-dashboard-card.indigo .student-dashboard-icon {
      background: #e0e7ff;
    }
      
    .student-dashboard-card.indigo .student-dashboard-icon {
      background: #ffe0f9;
    }
    

    .student-dashboard-card h3 {
      margin: 0 0 12px;
      color: #1e3a8a;
      font-size: 20px;
      font-weight: 800;
    }

    .student-dashboard-card p {
      flex: 1;
      margin: 0 0 24px;
      color: #64748b;
      font-size: 14px;
      line-height: 1.85;
    }

    .student-dashboard-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      padding: 13px 16px;
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: filter .2s, transform .2s;
    }

    .student-dashboard-btn:hover {
      filter: brightness(.94);
      transform: translateY(-2px);
    }

    .student-dashboard-card.purple .student-dashboard-btn {
      background: linear-gradient(100deg, #dbed3a, #6366f1);
    }

    .student-dashboard-card.blue .student-dashboard-btn {
      background: linear-gradient(100deg, #25ebeb, #0891b2);
    }

    .student-dashboard-card.pink .student-dashboard-btn {
      background: linear-gradient(100deg, #db2777, #f97316);
    }

    .student-dashboard-card.cyan .student-dashboard-btn {
      background: linear-gradient(100deg, #11b208, #2563eb);
    }

    .student-dashboard-card.indigo .student-dashboard-btn {
      background: linear-gradient(100deg, #ca3842, #2563eb);
    }
   .student-dashboard-card.yellow .student-dashboard-btn {
      background: linear-gradient(100deg, #facc15, #2563eb);
    }

    .student-dashboard-info {
      display: flex;
      align-items: flex-start;
      gap: 18px;
      padding: 27px;
      border: 1px solid #dbeafe;
      border-left: 5px solid #2563eb;
      border-radius: 19px;
      background: #ffffffed;
      box-shadow: 0 8px 25px #1e3a8a0b;
    }

    .student-info-icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 47px;
      height: 47px;
      border-radius: 14px;
      background: #dbeafe;
      font-size: 23px;
    }

    .student-dashboard-info h3 {
      margin: 0 0 9px;
      color: #1e3a8a;
    }

    .student-dashboard-info p {
      margin: 0;
      color: #64748b;
      line-height: 1.8;
      font-size: 14px;
    }

    @media (max-width: 950px) {
      .student-dashboard-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .student-dashboard {
        padding: 16px;
      }

      .student-dashboard-hero {
        padding: 27px 22px;
      }

      .student-dashboard-grid {
        grid-template-columns: 1fr;
      }

      .student-dashboard-heading {
        font-size: 23px;
      }

      .student-dashboard-card {
        padding: 22px;
      }

      .student-dashboard-info {
        padding: 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .student-dashboard-card,
      .student-dashboard-btn {
        transition: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="student-dashboard">
        <div className="student-dashboard-container">

          <header className="student-topbar">
            <div className="student-brand">
              <div className="student-brand-icon">🎓</div>
              <span>Campus Connect</span>
            </div>

            <div className="student-active-pill">
              <span className="student-blue-dot"></span>
              Student Portal Active
            </div>
          </header>

          <section className="student-dashboard-hero">
            <span className="student-hero-label">
              ✦ CAMPUS CONNECT / STUDENT PORTAL
            </span>

            <h1>Welcome back, {name}! 👋</h1>

            <p>
              Your campus journey starts here. Discover exciting events,
              explore student clubs, build connections, and make every
              college moment count.
            </p>

            <div className="student-hero-badge">
              🔵 Your student dashboard is active
            </div>
          </section>

          <h2 className="student-dashboard-heading">
            Your Campus Dashboard
          </h2>

          <p className="student-dashboard-subtitle">
            Choose an activity below to get started.
          </p>

          <section className="student-dashboard-grid">
            {dashboardCards.map((card) => (
              <article
                className={
                  "student-dashboard-card " +
                  card.color +
                  (activeSection === card.id ? " active" : "")
                }
                key={card.id}
              >
                {activeSection === card.id && (
                  <div className="student-card-active-indicator">
                    <span></span>
                    ACTIVE
                  </div>
                )}

                <div className="student-dashboard-icon">
                  {card.icon}
                </div>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <button
                  className="student-dashboard-btn"
                  onClick={() => openSection(card.id, card.path)}
                >
                  {card.button}
                  <span>→</span>
                </button>
              </article>
            ))}
          </section>

          <section className="student-dashboard-info">
            <div className="student-info-icon">💡</div>

            <div>
              <h3>Make the Most of Campus Connect</h3>

              <p>
                Explore events, manage your registrations, and discover
                clubs that match your interests. Use the All Clubs page
                to explore campus communities, or open Create Club to
                start a new community if your account has permission.
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

export default StudentLanding;

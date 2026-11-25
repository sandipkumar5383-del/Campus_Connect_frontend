
import { useNavigate } from "react-router-dom";

function FacultyLanding() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Faculty";

  const styles = `
    .faculty-dashboard {
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
      animation: facultyBg 15s ease infinite;
    }

    @keyframes facultyBg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .faculty-dashboard-container {
      max-width: 1200px;
      margin: auto;
    }

    .faculty-dashboard-hero {
      background: linear-gradient(120deg, #7c3aed, #ec4899, #f97316);
      padding: 45px;
      border-radius: 24px;
      color: white;
      box-shadow: 0 15px 35px rgba(124,58,237,0.2);
      margin-bottom: 30px;
    }

    .faculty-dashboard-hero span {
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: bold;
      color: #fce7f3;
    }

    .faculty-dashboard-hero h1 {
      font-size: 36px;
      margin: 15px 0;
    }

    .faculty-dashboard-hero p {
      font-size: 16px;
      line-height: 1.7;
      color: #fff7ed;
      max-width: 650px;
    }

    .faculty-dashboard-heading {
      font-size: 26px;
      color: #312e81;
      margin-bottom: 20px;
    }

    .faculty-dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .faculty-dashboard-card {
      background: rgba(255,255,255,0.94);
      padding: 28px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex;
      flex-direction: column;
    }

    .faculty-dashboard-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 18px 35px rgba(0,0,0,0.13);
    }

    .faculty-dashboard-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      margin-bottom: 20px;
    }

    .faculty-dashboard-card:nth-child(1) .faculty-dashboard-icon {
      background: #ede9fe;
    }

    .faculty-dashboard-card:nth-child(2) .faculty-dashboard-icon {
      background: #dbeafe;
    }

    .faculty-dashboard-card:nth-child(3) .faculty-dashboard-icon {
      background: #fce7f3;
    }

    .faculty-dashboard-card h3 {
      color: #312e81;
      font-size: 21px;
      margin: 0 0 12px;
    }

    .faculty-dashboard-card p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.7;
      flex: 1;
      margin-bottom: 25px;
    }

    .faculty-dashboard-btn {
      border: none;
      border-radius: 11px;
      padding: 13px 20px;
      color: white;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
    }

    .faculty-dashboard-card:nth-child(1) .faculty-dashboard-btn {
      background: linear-gradient(90deg, #7c3aed, #6366f1);
    }

    .faculty-dashboard-card:nth-child(2) .faculty-dashboard-btn {
      background: linear-gradient(90deg, #eb253c, #06b6d4);
    }

    .faculty-dashboard-card:nth-child(3) .faculty-dashboard-btn {
      background: linear-gradient(90deg, #48ec79, #f97316);
    }
    .faculty-dashboard-card:nth-child(4) .faculty-dashboard-btn {
      background: linear-gradient(90deg, #f65cc0, #8bb7fa);
    }
    .faculty-dashboard-card:nth-child(5) .faculty-dashboard-btn {
      background: linear-gradient(90deg, #facc15, #f9168f);
    }

    .faculty-dashboard-btn:hover {
      filter: brightness(0.92);
      transform: translateY(-2px);
    }

    .faculty-dashboard-info {
      background: rgba(255,255,255,0.9);
      padding: 28px;
      border-radius: 20px;
      border-left: 6px solid #8b5cf6;
      box-shadow: 0 8px 25px rgba(0,0,0,0.07);
    }

    .faculty-dashboard-info h3 {
      color: #312e81;
      margin: 0 0 12px;
    }

    .faculty-dashboard-info p {
      color: #64748b;
      line-height: 1.8;
      margin: 0;
    }

    @media (max-width: 900px) {
      .faculty-dashboard-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .faculty-dashboard {
        padding: 15px;
      }

      .faculty-dashboard-hero {
        padding: 25px;
      }

      .faculty-dashboard-hero h1 {
        font-size: 27px;
      }

      .faculty-dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .faculty-dashboard {
        animation: none;
      }
    }
  `;

  const dashboardCards = [
    {
      icon: "📅",
      title: "All Campus Events",
      description:
        "Explore upcoming, ongoing and completed events organized across the campus.",
      button: "View Events",
      path: "/allEvent"
    },
    {
      icon: "👨‍🎓",
      title: "All Students",
      description:
        "View registered students and explore student information.",
      button: "View Students",
      path: "/allStudent"
    },
    {
      icon: "🎉",
      title: "Create Event",
      description:
        "Organize workshops, seminars, technical events and other campus activities.",
      button: "Create New Event",
      path: "/createEvent"
    },
    {
      icon: "🏛️",
      title: "All Clubs",
      description:
        "Explore all clubs and student organizations on campus.",
      button: "View Clubs",
      path: "/facultyAllClub"
    },
    {
      icon: "🏛️",
      title: "Create Club",
      description:
        "Establish new student clubs and organizations to foster engagement.",
      button: "Create New Club",
      path: "/facultyCreateClub"
    }
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="faculty-dashboard">
        <div className="faculty-dashboard-container">

          <div className="faculty-dashboard-hero">
            <span>CAMPUS CONNECT | FACULTY PORTAL</span>
            <h1>Welcome, {name}!</h1>
            <p>
              Manage campus activities, explore student information,
              and organize exciting events from your faculty dashboard.
            </p>
          </div>

          <h2 className="faculty-dashboard-heading">
            Faculty Dashboard
          </h2>

          <div className="faculty-dashboard-grid">
            {dashboardCards.map((card, index) => (
              <div className="faculty-dashboard-card" key={index}>
                <div className="faculty-dashboard-icon">
                  {card.icon}
                </div>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                <button
                  className="faculty-dashboard-btn"
                  onClick={() => navigate(card.path)}
                >
                  {card.button}
                </button>
              </div>
            ))}
          </div>

          <div className="faculty-dashboard-info">
            <h3>Welcome to Campus Connect</h3>
            <p>
              Campus Connect helps faculty members stay connected
              with campus activities and students. Use your dashboard
              to explore events, view students and create engaging
              activities for the college community.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default FacultyLanding;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AllClub() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch all clubs
  const fetchClubs = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await axios.get(
      "http://localhost:8000/club/allClub"
    );

    console.log("API Response:", res.data);

    const clubData = Array.isArray(res.data)
      ? res.data
      : res.data.clubs || [];

    setClubs(clubData);

  } catch (err) {
    console.error("Error fetching clubs:", err);
    setError("Unable to load clubs. Please check your backend.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchClubs();
  }, []);

  // Search clubs
  const filteredClubs = clubs.filter((club) => {
    const searchText = search.trim().toLowerCase();

    return (
      (club.clubName || "").toLowerCase().includes(searchText) ||
      (club.category || "").toLowerCase().includes(searchText) ||
      (club.description || "").toLowerCase().includes(searchText)
    );
  });

  // Get club image URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    const imageName = image.split(/[\\/]/).pop();

    return `http://localhost:8000/clubs/${imageName}`;
  };

  return (
    <div className="all-clubs-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        /* Animated Rainbow Background */
        .all-clubs-page {
          min-height: 100vh;
          padding: 40px 5%;
          font-family: "Segoe UI", Arial, sans-serif;
          color: #172033;

          background: linear-gradient(
            135deg,
            #ff9a9e,
            #fad0c4,
            #fbc2eb,
            #a6c1ee,
            #84fab0,
            #f6d365
          );

          background-size: 400% 400%;
          animation: rainbowBackground 12s ease infinite;
        }

        @keyframes rainbowBackground {
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

        .clubs-main {
          max-width: 1250px;
          margin: 0 auto;
        }

        /* Hero Section */
        .clubs-hero {
          position: relative;
          overflow: hidden;
          padding: 65px 30px;
          border-radius: 22px;
          text-align: center;
          color: white;

          background: linear-gradient(
            125deg,
            #101b35,
            #172b50,
            #263e64
          );

          box-shadow: 0 18px 40px #101b3525;
        }

        .clubs-hero::before,
        .clubs-hero::after {
          content: "";
          position: absolute;
          border: 2px solid #d6b45b25;
          border-radius: 50%;
          pointer-events: none;
        }

        .clubs-hero::before {
          width: 300px;
          height: 300px;
          top: -190px;
          left: -60px;
        }

        .clubs-hero::after {
          width: 260px;
          height: 260px;
          right: -80px;
          bottom: -180px;
        }

        .clubs-hero h1 {
          position: relative;
          margin: 0 0 15px;
          color: #f5d98b;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 850;
          letter-spacing: -1px;
        }

        .clubs-hero p {
          position: relative;
          max-width: 650px;
          margin: 0 auto;
          color: #d9e1ef;
          font-size: 16px;
          line-height: 1.8;
        }

        /* Statistics */
        .clubs-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin: 28px 0;
        }

        .club-stat-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 25px;
          border: 1px solid #e5e8ef;
          border-radius: 15px;
          background: white;
          box-shadow: 0 7px 22px #1720330b;
          transition: transform .25s;
        }

        .club-stat-card:hover {
          transform: translateY(-4px);
        }

        .club-stat-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 58px;
          height: 58px;
          border-radius: 15px;
          background: #fff5d9;
          font-size: 27px;
        }

        .club-stat-card h3 {
          margin: 0 0 6px;
          color: #788196;
          font-size: 14px;
          font-weight: 600;
        }

        .club-stat-number {
          color: #172b50;
          font-size: 31px;
          font-weight: 850;
        }

        /* Search Section */
        .clubs-search-section {
          margin: 35px 0;
        }

        .clubs-search-label {
          display: block;
          margin-bottom: 13px;
          color: #172b50;
          font-size: 19px;
          font-weight: 750;
        }

        .clubs-search-box {
          display: flex;
          align-items: center;
          gap: 13px;
          max-width: 760px;
          padding: 8px 12px 8px 18px;
          border: 1px solid #dce1eb;
          border-radius: 12px;
          background: white;
          box-shadow: 0 5px 18px #17203308;
          transition: border-color .2s, box-shadow .2s;
        }

        .clubs-search-box:focus-within {
          border-color: #c39b38;
          box-shadow: 0 0 0 4px #c39b3818;
        }

        .clubs-search-icon {
          font-size: 22px;
        }

        .clubs-search-box input {
          flex: 1;
          min-width: 0;
          padding: 13px 0;
          border: none;
          outline: none;
          color: #172033;
          background: transparent;
          font-size: 15px;
        }

        .clubs-search-box input::placeholder {
          color: #a0a7b5;
        }

        .clubs-clear-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          color: #172b50;
          background: #fff2cf;
          font-weight: 700;
          cursor: pointer;
        }

        .clubs-clear-btn:hover {
          color: white;
          background: #172b50;
        }

        /* Results Heading */
        .clubs-results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 38px 0 22px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5ec;
          flex-wrap: wrap;
        }

        .clubs-results-header h2 {
          margin: 0;
          color: #172b50;
          font-size: 27px;
          font-weight: 800;
        }

        .clubs-results-count {
          padding: 9px 16px;
          border: 1px solid #f0d58c;
          border-radius: 30px;
          color: #8b6816;
          background: #fff7df;
          font-size: 13px;
          font-weight: 750;
        }

        /* Club Grid */
        .clubs-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(260px, 1fr)
          );
          gap: 25px;
        }

        .club-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e5e8ef;
          border-radius: 16px;
          background: white;
          box-shadow: 0 7px 24px #1720330b;
          transition: transform .3s, box-shadow .3s;
        }

        .club-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 17px 35px #17203320;
        }

        .club-image-wrapper {
          position: relative;
          height: 215px;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #e7d7a8,
            #f5eacb
          );
        }

        .club-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }

        .club-card:hover .club-image {
          transform: scale(1.07);
        }

        .club-placeholder {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          font-size: 65px;
          background: linear-gradient(
            135deg,
            #f8e9bd,
            #e8d69e
          );
        }

        /* Card Body */
        .club-card-body {
          padding: 23px;
        }

        .club-category {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 13px;
          padding: 7px 13px;
          border: 1px solid #f0d58c;
          border-radius: 5px;
          color: #8b6816;
          background: #fff7df;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .club-card-body h3 {
          margin: 0 0 12px;
          color: #172b50;
          font-size: 22px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .club-description {
          min-height: 72px;
          margin: 0 0 21px;
          color: #7b8495;
          font-size: 14px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        /* View Club Button */
        .view-club-btn {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 8px;
          color: white;

          background: linear-gradient(
            110deg,
            #ff512f,
            #dd2476,
            #8e44ad,
            #4776e6
          );

          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }

        .view-club-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 17px #8e44ad35;
        }

        /* Loading, Error and Empty Messages */
        .clubs-message {
          padding: 45px 20px;
          border: 1px dashed #c5ccd9;
          border-radius: 15px;
          text-align: center;
          color: #68748a;
          background: white;
          font-size: 17px;
          line-height: 1.8;
        }

        .clubs-retry-btn {
          margin-top: 12px;
          padding: 11px 20px;
          border: none;
          border-radius: 8px;
          color: white;
          background: #172b50;
          cursor: pointer;
        }

        .clubs-retry-btn:hover {
          background: #263e64;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
          .all-clubs-page {
            padding: 20px 14px;
          }

          .clubs-hero {
            padding: 40px 20px;
            border-radius: 16px;
          }

          .clubs-stats {
            gap: 10px;
          }

          .club-stat-card {
            gap: 10px;
            padding: 14px 10px;
          }

          .club-stat-icon {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            font-size: 20px;
          }

          .club-stat-number {
            font-size: 24px;
          }

          .clubs-grid {
            grid-template-columns: 1fr;
          }

          .clubs-results-header h2 {
            font-size: 22px;
          }
        }
      `}</style>

      <main className="clubs-main">

        {/* Hero Section */}
        <header className="clubs-hero">
          <h1>🎓 Explore Our Clubs</h1>

          <p>
            Discover your interests, connect with like-minded students,
            and become part of something amazing at Campus Connect.
          </p>
        </header>

        {/* Club Statistics */}
        <section className="clubs-stats">

          <div className="club-stat-card">
            <div className="club-stat-icon">🏛️</div>

            <div>
              <h3>Total Clubs</h3>

              <div className="club-stat-number">
                {loading ? "—" : clubs.length}
              </div>
            </div>
          </div>

          <div className="club-stat-card">
            <div className="club-stat-icon">🔎</div>

            <div>
              <h3>Matching Clubs</h3>

              <div className="club-stat-number">
                {loading ? "—" : filteredClubs.length}
              </div>
            </div>
          </div>

        </section>

        {/* Search Bar */}
        <section className="clubs-search-section">

          <label
            className="clubs-search-label"
            htmlFor="clubSearch"
          >
            Find Your Club
          </label>

          <div className="clubs-search-box">

            <span className="clubs-search-icon">🔍</span>

            <input
              id="clubSearch"
              type="text"
              placeholder="Search by club name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clubs-clear-btn"
                onClick={() => setSearch("")}
                type="button"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}

          </div>
        </section>

        {/* Results Heading */}
        <div className="clubs-results-header">

          <h2>✨ All Clubs</h2>

          {!loading && !error && (
            <span className="clubs-results-count">
              {filteredClubs.length} of {clubs.length} clubs
            </span>
          )}

        </div>

        {/* Loading Message */}
        {loading && (
          <div className="clubs-message">
            ⏳ Loading clubs...
          </div>
        )}

        {/* Error Message */}
        {!loading && error && (
          <div className="clubs-message">
            ⚠️ {error}

            <br />

            <button
              className="clubs-retry-btn"
              onClick={fetchClubs}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Clubs Available */}
        {!loading && !error && clubs.length === 0 && (
          <div className="clubs-message">
            🏛️ No clubs have been created yet.
          </div>
        )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          clubs.length > 0 &&
          filteredClubs.length === 0 && (
            <div className="clubs-message">
              🔎 No clubs match "{search}".

              <br />

              Try another club name or category.
            </div>
          )}

        {/* Club Cards */}
        {!loading && !error && filteredClubs.length > 0 && (
          <div className="clubs-grid">

            {filteredClubs.map((club) => {
              const imageUrl = getImageUrl(club.image);

              return (
                <article
                  className="club-card"
                  key={club._id}
                >

                  {/* Club Image */}
                  <div className="club-image-wrapper">

                    {imageUrl ? (
                      <img
                        className="club-image"
                        src={imageUrl}
                        alt={club.clubName || "Club"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const placeholder =
                            e.currentTarget.nextElementSibling;

                          if (placeholder) {
                            placeholder.style.display = "grid";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="club-placeholder"
                      style={{
                        display: imageUrl ? "none" : "grid"
                      }}
                    >
                      🎯
                    </div>

                  </div>

                  {/* Club Details */}
                  <div className="club-card-body">

                    <span className="club-category">
                      {club.category || "General"}
                    </span>

                    <h3>
                      {club.clubName || "Unnamed Club"}
                    </h3>

                    <p className="club-description">
                      {club.description || "No description available."}
                    </p>

                    <button
                      className="view-club-btn"
                      onClick={() =>
                        navigate(`/viewClub/${club._id}`)
                      }
                    >
                      View Club →
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}

export default AllClub;


import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Header({ IsLoggedIn, role, handleLogin, handleRole }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const name = localStorage.getItem("name") || "User";
    const profilePath =
        role?.toLowerCase() === "admin"
            ? "/adminProfile"
            : role?.toLowerCase() === "faculty"
                ? "/facultyProfile"
                : "/studentProfile";

    // LOGOUT FUNCTION
    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        handleLogin(false);
        handleRole("");

        setMenuOpen(false);
        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    // NAVIGATION LINK FUNCTION
    const navLink = (to, label) => (
        <NavLink
            key={to}
            to={to}
            end={
                to === "/" ||
                to === "/admin" ||
                to === "/faculty" ||
                to === "/student"
            }
            className={({ isActive }) =>
                `cc-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
        >
            {label}
        </NavLink>
    );

    // HOME PATH BASED ON ROLE
    const homePath = !IsLoggedIn
        ? "/"
        : role === "admin"
            ? "/admin"
            : role === "faculty"
                ? "/faculty"
                : "/student";

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                /* MAIN HEADER */
                .cc-header {
                    position: relative;
                    top: 0;
                    z-index: 9999;
                    width: 100%;
                    background: rgba(255,255,255,0.96);
                    backdrop-filter: blur(14px);
                    box-shadow: 0 4px 20px rgba(30,41,59,0.08);
                    border-bottom: 1px solid #e2e8f0;
                    font-family: Arial, sans-serif;
                }

                .cc-navbar {
                    max-width: 1400px;
                    min-height: 76px;
                    margin: 0 auto;
                    padding: 12px 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                /* LOGO */
                .cc-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    color: #312e81;
                    flex-shrink: 0;
                }

                .cc-logo-icon {
                    width: 55px;
                    height: 55px;
                    object-fit: contain;
                    border-radius: 12px;
                }

                .cc-logo-text {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .cc-logo-text strong {
                    font-size: 21px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    background: linear-gradient(
                        110deg,
                        #2563eb,
                        #7c3aed
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .cc-logo-text small {
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                }

                /* NAVIGATION LINKS */
                .cc-nav-links {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                    gap: 5px;
                }

                .cc-nav-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 11px 13px;
                    border-radius: 9px;
                    text-decoration: none;
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .cc-nav-link:hover,
                .cc-nav-link.active {
                    color: #4338ca;
                    background: #eef2ff;
                }

                /* REGISTER BUTTON */
                .cc-register-link {
                    background: linear-gradient(
                        110deg,
                        #2563eb,
                        #7c3aed
                    );
                    color: white;
                }

                .cc-register-link:hover {
                    background: linear-gradient(
                        110deg,
                        #1d4ed8,
                        #6d28d9
                    );
                    color: white;
                }

                /* USER PROFILE */
                .cc-user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-left: 10px;
                    padding: 5px 12px;
                    border-left: 1px solid #e2e8f0;
                    white-space: nowrap;
                }

                .cc-user-avatar {
                    width: 44px;
                    height: 44px;
                    min-width: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: linear-gradient(
                        135deg,
                        #2563eb,
                        #7c3aed
                    );
                    color: white;
                    font-size: 18px;
                    font-weight: 800;
                    box-shadow: 0 3px 10px rgba(79,70,229,0.2);
                }

                /* ADMIN IMAGE */
                .cc-profile-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    display: block;
                }

                .cc-user-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .cc-user-details strong {
                    color: #1e293b;
                    font-size: 13px;
                    font-weight: 800;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .cc-user-details small {
                    color: #64748b;
                    font-size: 10px;
                    font-weight: 600;
                }

                /* LOGOUT BUTTON */
                .cc-logout {
                    padding: 11px 19px;
                    margin-left: 7px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(
                        110deg,
                        #ef4444,
                        #dc2626
                    );
                    color: white;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .cc-logout:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 14px rgba(220,38,38,0.22);
                }

                /* MOBILE MENU BUTTON */
                .cc-mobile-toggle {
                    display: none;
                    width: 43px;
                    height: 43px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: white;
                    color: #312e81;
                    font-size: 23px;
                    cursor: pointer;
                }

                /* TABLET */
                @media (max-width: 1050px) {
                    .cc-navbar {
                        padding: 12px 18px;
                    }

                    .cc-nav-link {
                        padding: 10px 9px;
                        font-size: 12px;
                    }

                    .cc-logo-text strong {
                        font-size: 17px;
                    }

                    .cc-logo-icon {
                        width: 48px;
                        height: 48px;
                    }

                    .cc-user-profile {
                        gap: 7px;
                        padding: 5px 8px;
                    }
                }

                /* MOBILE */
                @media (max-width: 820px) {
                    .cc-mobile-toggle {
                        display: grid;
                        place-items: center;
                        flex-shrink: 0;
                    }

                    .cc-navbar {
                        position: relative;
                        min-height: 70px;
                        flex-wrap: wrap;
                    }

                    .cc-nav-links {
                        display: ${menuOpen ? "flex" : "none"};
                        width: 100%;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 5px;
                        padding: 14px 0 7px;
                        border-top: 1px solid #e2e8f0;
                    }

                    .cc-nav-link {
                        justify-content: flex-start;
                        padding: 13px 15px;
                        font-size: 14px;
                        width: 100%;
                    }

                    .cc-user-profile {
                        margin: 10px 0 5px;
                        padding: 10px 5px;
                        border-left: none;
                        border-bottom: 1px solid #e2e8f0;
                    }

                    .cc-logout {
                        width: 100%;
                        margin: 7px 0 0;
                        padding: 13px;
                    }

                    .cc-logo-text strong {
                        font-size: 17px;
                    }

                    .cc-logo-text small {
                        font-size: 9px;
                    }

                    .cc-logo-icon {
                        width: 45px;
                        height: 45px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .cc-nav-link,
                    .cc-logout {
                        transition: none;
                    }
                }
            `}</style>

            <header className="cc-header">
                <nav className="cc-navbar">

                    {/* CAMPUS CONNECT LOGO */}
                    <Link
                        to={homePath}
                        className="cc-logo"
                        onClick={closeMenu}
                    >
                        <img
                            src="/campus-connect-logo.png"
                            alt="Campus Connect Logo"
                            className="cc-logo-icon"
                        />

                        <span className="cc-logo-text">
                            <strong>Campus Connect</strong>
                            <small>Learn · Connect · Grow</small>
                        </span>
                    </Link>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        type="button"
                        className="cc-mobile-toggle"
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                    {/* NAVIGATION LINKS */}
                    <div className="cc-nav-links">

                        {!IsLoggedIn ? (
                            <>
                                {navLink("/", "Home")}

                                <Link
                                    to="/register"
                                    className="cc-nav-link cc-register-link"
                                    onClick={closeMenu}
                                >
                                    ✨ Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* ADMIN NAVIGATION */}
                                {role?.toLowerCase() === "admin" && (
                                    <>
                                        {navLink("/admin", "🏠 Admin")}

                                        {navLink(
                                            "/allStudent",
                                            "👨‍🎓 All Students"
                                        )}

                                        {navLink(
                                            "/allFaculty",
                                            "👩‍🏫 All Faculty"
                                        )}

                                        {navLink(
                                            "/createEvent",
                                            "➕ Create Event"
                                        )}

                                        {navLink(
                                            "/adminAllEvent",
                                            "📅 All Events"
                                        )}

                                        {navLink(
                                            "/adminAllClub",
                                            "🏛️ All Club"
                                        )}
                                    </>
                                )}

                                {/* FACULTY NAVIGATION */}
                                {role?.toLowerCase() === "faculty" && (
                                    <>
                                        {navLink("/faculty", "🏠 Faculty")}

                                        {navLink(
                                            "/allStudent",
                                            "👨‍🎓 All Students"
                                        )}

                                        {navLink(
                                            "/facultyAllEvent",
                                            "📅 All Events"
                                        )}

                                        {navLink(
                                            "/facultyCreateClub",
                                            "🏛️ Create Club"
                                        )}

                                        {navLink(
                                            "/facultyAllClub",
                                            "🏛️ All Club"
                                        )}
                                    </>
                                )}

                                {/* STUDENT NAVIGATION */}
                                {role?.toLowerCase() === "student" && (
                                    <>
                                        {navLink("/student", "🏠 Student")}

                                        {navLink(
                                            "/allEvent",
                                            "📅 All Events"
                                        )}

                                        {navLink(
                                            "/createClub",
                                            "👥 Create Club"
                                        )}

                                        {navLink(
                                            "/allClub",
                                            "🏛️ All Club"
                                        )}

                                        {navLink(
                                            "/clubChat",
                                            "💬 Club Chat"
                                        )}
                                        {navLink(
                                            "/allPosts",
                                            "📸 Posts"
                                        )}
                                    </>
                                )}

                                {/* CLICKABLE USER PROFILE */}
                                <Link
                                    to={profilePath}
                                    className="cc-user-profile"
                                    onClick={closeMenu}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        cursor: "pointer"
                                    }}
                                >
                                    <div className="cc-user-avatar">
                                        {role?.toLowerCase() === "admin" ? (
                                            <img
                                                src="/admin.png"
                                                alt="Admin"
                                                className="cc-profile-image"
                                            />
                                        ) : (
                                            name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div className="cc-user-details">
                                        <strong>{name}</strong>
                                        <small>
                                            {role?.toLowerCase() === "admin"
                                                ? "Administrator"
                                                : role?.toLowerCase() === "faculty"
                                                    ? "Faculty Portal"
                                                    : "Student Portal"}
                                        </small>
                                    </div>
                                </Link>


                                {/* LOGOUT BUTTON */}
                                <button
                                    type="button"
                                    className="cc-logout"
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;


import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {

    const features = [
        {
            icon: "📰",
            number: "01",
            title: "Campus Posts",
            desc: "Share photos, updates and memorable moments with your campus community.",
            link: "/allPosts",
            color: "blue",
            tag: "SOCIAL COMMUNITY"
        },
        {
            icon: "📅",
            number: "02",
            title: "College Events",
            desc: "Discover workshops, seminars, competitions and upcoming events.",
            link: "/allEvent",
            color: "purple",
            tag: "CAMPUS ACTIVITIES"
        },
        {
            icon: "🤝",
            number: "03",
            title: "Student Clubs",
            desc: "Find your interests, join communities and make new friends.",
            link: "/allClub",
            color: "orange",
            tag: "JOIN COMMUNITY"
        },
        {
            icon: "💬",
            number: "04",
            title: "Club Messaging",
            desc: "Communicate with club members and stay connected.",
            link: "/clubChat",
            color: "green",
            tag: "STAY CONNECTED"
        },
        {
            icon: "🎓",
            number: "05",
            title: "Student Network",
            desc: "Connect with students, faculty and your college community.",
            link: "/login",
            color: "pink",
            tag: "BUILD CONNECTIONS"
        },
        {
            icon: "🚀",
            number: "06",
            title: "Opportunities",
            desc: "Explore activities and make the most of your college journey.",
            link: "/allEvent",
            color: "cyan",
            tag: "EXPLORE MORE"
        }
    ];

    return (
        <div className="cc-home">

            {/* HERO SECTION */}

            <section className="cc-home-hero">

                <div className="cc-hero-decoration cc-decoration-one"></div>
                <div className="cc-hero-decoration cc-decoration-two"></div>

                <div className="cc-hero-content">

                    <div className="cc-home-badge">
                        <span className="cc-badge-dot"></span>
                        🎓 WELCOME TO CAMPUS CONNECT
                    </div>

                    <h1>
                        Your Campus.
                        <br />
                        <span>Your World. Your Community.</span>
                    </h1>

                    <p>
                        All your campus activities, communities and connections
                        in one convenient place. Discover, connect and grow
                        together with your college community.
                    </p>

                    <div className="cc-home-buttons">

                        <Link to="/login" className="cc-home-login">
                            Login <span>→</span>
                        </Link>

                        <Link to="/register" className="cc-home-register">
                            Get Started ✨
                        </Link>

                    </div>

                    <div className="cc-home-highlights">
                        <span>✓ Student Community</span>
                        <span>✓ Events & Clubs</span>
                        <span>✓ Easy Communication</span>
                    </div>

                </div>

                <div className="cc-hero-visual">

                    <div className="cc-hero-main-card">

                        <div className="cc-hero-card-header">
                            <div className="cc-mini-logo">🎓</div>
                            <div>
                                <strong>Campus Connect</strong>
                                <small>Your Digital Campus</small>
                            </div>
                            <span className="cc-online-status">● ONLINE</span>
                        </div>

                        <div className="cc-hero-welcome">
                            <span>WELCOME TO YOUR CAMPUS</span>
                            <h2>Make Every Moment Count!</h2>
                            <p>
                                Learn new things, meet new people and
                                discover exciting opportunities.
                            </p>
                        </div>

                        <div className="cc-hero-stat-grid">

                            <div className="cc-hero-stat">
                                <span>📰</span>
                                <strong>Posts</strong>
                                <small>Share Moments</small>
                            </div>

                            <div className="cc-hero-stat">
                                <span>📅</span>
                                <strong>Events</strong>
                                <small>Explore Events</small>
                            </div>

                            <div className="cc-hero-stat">
                                <span>🤝</span>
                                <strong>Clubs</strong>
                                <small>Find Your People</small>
                            </div>

                        </div>

                    </div>

                    <div className="cc-floating-note cc-floating-top">
                        🎉 Explore Campus Life
                    </div>

                    <div className="cc-floating-note cc-floating-bottom">
                        💜 Connect. Share. Grow.
                    </div>

                </div>

            </section>


            {/* FEATURE SECTION */}

            <section className="cc-home-features">

                <div className="cc-home-section-heading">

                    <span className="cc-section-label">
                        ✦ DISCOVER CAMPUS CONNECT
                    </span>

                    <h2>
                        Everything Your Campus
                        <span> Needs in One Place.</span>
                    </h2>

                    <p>
                        Explore powerful features designed to bring
                        students, faculty and campus activities together.
                    </p>

                </div>


                <div className="cc-home-grid">

                    {features.map((feature) => (

                        <Link
                            to={feature.link}
                            className={`cc-home-card ${feature.color}`}
                            key={feature.number}
                        >

                            <div className="cc-card-top">

                                <div className="cc-card-icon">
                                    {feature.icon}
                                </div>

                                <span className="cc-card-number">
                                    {feature.number}
                                </span>

                            </div>

                            <span className="cc-card-tag">
                                {feature.tag}
                            </span>

                            <h3>{feature.title}</h3>

                            <p>{feature.desc}</p>

                            <div className="cc-card-bottom">
                                <span>Explore Feature</span>
                                <span className="cc-card-arrow">↗</span>
                            </div>

                        </Link>

                    ))}

                </div>

            </section>


            {/* COMMUNITY BANNER */}

            <section className="cc-community-banner">

                <div className="cc-community-content">

                    <span>🌐 ONE PLATFORM. MANY POSSIBILITIES.</span>

                    <h2>
                        Your College Life,
                        <br />
                        More Connected Than Ever.
                    </h2>

                    <p>
                        Be part of a growing digital campus community.
                        Discover events, connect with friends and
                        create unforgettable college memories.
                    </p>

                    <Link to="/register" className="cc-community-btn">
                        Join Our Community →
                    </Link>

                </div>

                <div className="cc-community-art">
                    <div className="cc-art-circle">
                        🎓
                    </div>
                    <div className="cc-art-small cc-art-one">💬</div>
                    <div className="cc-art-small cc-art-two">📅</div>
                    <div className="cc-art-small cc-art-three">🤝</div>
                    <div className="cc-art-small cc-art-four">🚀</div>
                </div>

            </section>


            {/* FOOTER */}

            <footer className="cc-home-footer">

                <div className="cc-footer-main">

                    <div className="cc-footer-brand">
                        <div className="cc-footer-logo">
                            🎓
                        </div>

                        <h3>Campus <span>Connect</span></h3>

                        <p>
                            Connecting students, faculty and campus communities
                            through one digital platform.
                        </p>
                    </div>

                    <div className="cc-footer-column">
                        <h4>Explore</h4>
                        <Link to="/login">Campus Posts</Link>
                        <Link to="/login">College Events</Link>
                        <Link to="/login">Student Clubs</Link>
                    </div>

                    <div className="cc-footer-column">
                        <h4>Get Started</h4>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>

                </div>

                <div className="cc-footer-bottom">
                    <span>
                        © {new Date().getFullYear()} Campus Connect.
                        All Rights Reserved.
                    </span>

                    <span>Learn • Connect • Grow 💜</span>
                </div>

            </footer>

        </div>
    );
}

export default Home;

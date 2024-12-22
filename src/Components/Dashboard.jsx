import React from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { dashboard_img1 } from "../assets/Images";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <>
    <div className="hero-section">
      <nav className="navbar">
        <ul className="navbar-links">
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Our Services</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
        <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
      </nav>

      <div className="hero-content">
        <div className="hero-text">
          <h1>
            <span>Conference Management</span> System
          </h1>
          <p>
            From managing program committees to publishing proceedings, our
            ConfHub system has got you covered. Professionalism has perfected
            managing a well-organized conference from scratch.
          </p>
          <button className="learn-more-button">Learn More →</button>
        </div>

        <div className="hero-image">
          <img src={dashboard_img1} alt="Conference illustration" />
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}> <h3 style={{ fontSize: '3em', color:'#1D4ED8' }}>ConfHub</h3> </div>
    <div className="main-page">
        {/* About Us Section */}
        <section className="about-us">
          <div className="about-content">
            <h2>About Us</h2>
            <p>
              Our platform streamlines the management of university-level
              conferences, providing tools for organizers to efficiently manage
              tracks, sessions, and submissions. We focus on collaboration,
              simplicity, and success in academic events.
            </p>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="our-services">
          <h2>Our Services</h2>
          <div className="service">
            <div className="service-content">
              <h3>Conference Management</h3>
              <p>
                Tools for submission, review workflows, and real-time dashboards
                that keep conferences well-organized and efficient.
              </p>
            </div>
            <div className="service-image">
              <img src="/path-to-conference-image.png" alt="Conference" />
            </div>
          </div>
          <div className="service reverse">
            <div className="service-content">
              <h3>Review Management</h3>
              <p>
                Manage review teams and peer-review processes with automated
                notifications and built-in collaboration tools.
              </p>
            </div>
            <div className="service-image">
              <img src="/path-to-review-image.png" alt="Review Management" />
            </div>
          </div>
          <div className="service">
            <div className="service-content">
              <h3>Publishing</h3>
              <p>
                Create detailed conference proceedings or publish to indexing
                databases, ensuring visibility for your academic contributions.
              </p>
            </div>
            <div className="service-image">
              <img src="/path-to-publishing-image.png" alt="Publishing" />
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="contact-us">
          <h2>Contact Us</h2>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message"></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 ConfHub. All rights reserved.</p>
        </footer>
      </div></>
    
  );
};

export default Dashboard;

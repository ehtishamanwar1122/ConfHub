import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dashboard_img1 } from "../assets/Images";
import { Conference_Management_System } from "../assets/Images";
import { ConfHub } from "../assets/Images";
import { dashboard_bg } from "../assets/Images";
const Dashboard = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conferences in progress and approved by admin
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/conferences', {
          params: {
            filters: {
              requestStatus: {
                $eq: 'approved',
              },
            },
            populate: '*',  // This will populate all related fields
          },
        });
        const allConferences = response.data.data
        console.log('conf',response);
        console.log('aprconf',allConferences);
        setConferences(allConferences);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conferences:", error);
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  // Navigate to conference details
  const handleConferenceClick = (conferenceId) => {
    navigate(`/conference/${conferenceId}`);
  };

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
        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
        <h3 class ='heading1' style={{ fontSize: '3em', color:'#1D4ED8' }}>ConfHub</h3>
      </div> */}
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' ,marginTop:'10px' }}>
        <h3 class ='heading1'> <img src={ConfHub} alt="Confhun" /></h3>
      </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1>
              {/* <span>Conference Management</span> System */}
              <img src={Conference_Management_System} alt="Conference illustration" />
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

      
      <div className="main-page">
        {/* Conferences In Progress Section */}
<section className="conference-list px-8 py-6">
  <div className="flex justify-between items-center mb-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search conferences by title"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 text-sm"
      />
      <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <span className="text-sm text-gray-600">4 of 4 conferences</span>
  </div>

  {loading ? (
    <p>Loading conferences...</p>
  ) : conferences.length > 0 ? (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Conference Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submission Deadline</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {conferences.map((conference, index) => (
            <tr
              key={conference.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleConferenceClick(conference.id)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{conference.Conference_title}</div>
                    <div className="flex items-center mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  {conference.Description}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {conference.Start_date}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {conference.Submission_deadline}
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle submit paper action
                  }}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Submit Paper
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No conferences in progress at the moment.</p>
  )}
</section>


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
              <img src={dashboard_img1} alt="Conference" />
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
              <img src={dashboard_img1} alt="Review Management" />
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
              <img src={dashboard_img1} alt="Publishing" />
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
          <p>&copy; 2025 ConfHub. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;

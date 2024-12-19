import React from "react";
import '../styles/dashboard.css'
import { useNavigate } from "react-router-dom";

const fields = [
    {
        title: "Conference Management System",
        description:
          "Send instant notifications and updates to attendees about schedule changes or announcements.",
        image: "/src/assets/images/updates.png",
    },
    {
      title: "About Us",
      description:
        "Manage your conferences effortlessly with tools for scheduling, peer reviews, and attendee management.",
      image: "/src/assets/images/conference.png",
    },
    {
      title: "Conference Management",
      description:
        "Allow participants to submit papers and abstracts seamlessly through an easy-to-use platform.",
      image: "/src/assets/images/submission.png",
    },
    {
      title: "Review Management",
      description:
        "Handle attendee registration with built-in tools for tracking participants and issuing tickets.",
      image: "/src/assets/images/registration.png",
    },
    {
      title: "Publishing",
      description:
        "Create, update, and publish conference schedules to keep sessions organized and on track.",
      image: "/src/assets/images/schedule.png",
    },
    
  ];
const Dashboard = () => {
        const navigate = useNavigate();

        const handleLoginClick = () => {
        navigate("/login");
  };
  return (
    <div className="dashboard">
      <header>
        <h1 >ConfHub</h1>
        <nav>
          <a href="/">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <button className="loginBtn" onClick={handleLoginClick}>
          Login
        </button>
        </nav>
      </header>
      <main>
      <div className="dashboard-container">
      <h1 className="dashboard-title">Conference Dashboard</h1>
      {fields.map((field, index) => (
        <div
          key={index}
          className={`field-row ${index % 2 === 0 ? "row-reverse" : ""}`}
        >
          <div className="text-section">
            <h2>{field.title}</h2>
            <p>{field.description}</p>
          </div>
          <div className="image-section">
            <img src={field.image} alt={field.title} />
          </div>
        </div>
      ))}
    </div>
      </main>
    </div>
  );
};

export default Dashboard;

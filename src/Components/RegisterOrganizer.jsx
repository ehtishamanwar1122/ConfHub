import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registerOrganizer.css";
import { LoginPageImage } from "../assets/Images";
const RegisterOrganizer = () => {
    const navigate = useNavigate();
    const handleRegisterClick = () => {
    navigate("/login");
  };
  return (
    <div className="container">
      <div className="image-section">
        <img src={LoginPageImage} alt="Register" />
      </div>
      <div className="form-section">
        <div className="switch-buttons">
          <button onClick={handleRegisterClick}>Login</button>
          <button className="active">Register</button>
        </div>
        <h2>Organizer Registration</h2>
        <p>
          Welcome to Organizer’s registration form, submit the form and wait for
          the admin’s approval for further activities.
        </p>
        <form>
          <div className="form-row">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className="form-row">
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Alternative Contact" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Affiliation" />
            <input type="text" placeholder="Department" />
          </div>
          <div className="form-row">
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
          </div>
          <button className="btn-register">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizer;

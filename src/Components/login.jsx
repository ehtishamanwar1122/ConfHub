import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import "../styles/login.css";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleDropdownSelect = (role) => {
    setSelectedRole(role);
    setIsDropdownOpen(false); 
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="container">
      <div className="image-section">
        <img src={LoginPageImage} alt="Login" />
      </div>
      <div className="form-section">
        <div className="switch-buttons">
          <button className="active">Login</button>
          <button className="registerBtn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>
        <h2>Login</h2>
        <form>
          <label>Username</label>
          <input type="text" placeholder="Enter your User name" />

          <label>Password</label>
          <input type="password" placeholder="Enter your Password" />

          <div className="form-options">
            <label style={{ display: "flex", flexDirection: "row", width: "20%" }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button className="btn-login" onClick={handleLoginClick}>
            Login
          </button>
        </form>

        <div className="dropdown-section" ref={dropdownRef}>
          <h3>Select Your Role</h3>
          <button
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            Select Role
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleDropdownSelect("Organizer")}>Organizer</li>
              <li onClick={() => handleDropdownSelect("Admin")}>Admin</li>
              <li onClick={() => handleDropdownSelect("Author")}>Author</li>
              <li onClick={() => handleDropdownSelect("Reviewer")}>Reviewer</li>
            </ul>
          )}
          {selectedRole && (
            <p>
              You selected: <strong>{selectedRole}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

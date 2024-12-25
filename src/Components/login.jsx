import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoggedIn(true); // Simulate a successful login
  };

  const handleDropdownSelect = (role) => {
    switch (role) {
      case "Organizer":
        navigate("/OrganizerDashboard");
        break;
      case "Admin":
        navigate("/AdminDashboard");
        break;
      case "Author":
        navigate("/AuthorDashboard");
        break;
      case "Reviewer":
        navigate("/ReviewerDashboard");
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div className="dropdown-section">
          <h2>Welcome Back!</h2>
          <div className="dropdown">
            <button className="dropdown-btn">Select Role</button>
            <ul className="dropdown-menu">
              <li onClick={() => handleDropdownSelect("Organizer")}>Organizer</li>
              <li onClick={() => handleDropdownSelect("Admin")}>Admin</li>
              <li onClick={() => handleDropdownSelect("Author")}>Author</li>
              <li onClick={() => handleDropdownSelect("Reviewer")}>Reviewer</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
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
          </div>
        </>
      )}
    </div>
  );
};

export default Login;

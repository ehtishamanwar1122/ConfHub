import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import { loginOrganizer } from "../Services/api.js";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
console.log('login--',formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const result = await loginOrganizer(formData); // Use the service to send the request
  
      console.log("Login successful", result);
      navigate("/OrganizerDashboard"); // Navigate to the Organizer Dashboard
    } catch (error) {
      console.error("Login failed", error.response?.data?.message || error.message);
      alert("Login failed: " + (error.response?.data?.message || "An error occurred during login"));
    }
  };

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
          <input
            type="text"
            name="username"
            placeholder="Enter your User name"
            value={formData.username}
            onChange={handleInputChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleInputChange}
          />

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
    </div>
  );
};

export default Login;

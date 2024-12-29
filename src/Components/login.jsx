import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import { loginOrganizer, loginAdmin } from "../Services/api.js"; // Import both services
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  const handleLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission
  
    if (formData.role === "admin") {
      // Admin login
      try {
        const result = await loginAdmin(formData); // Call adminLogin function
        console.log("Admin Login successful", result);
        navigate("/AdminDashboard"); // Navigate to the Admin Dashboard
      } catch (error) {
        console.error("Admin Login failed", error.response?.data?.message || error.message);
        alert("Admin Login failed: " + (error.response?.data?.message || "An error occurred during login"));
      }
    } else if (formData.role === "organizer") {
      // Organizer login
      try {
        const result = await loginOrganizer(formData); // Call loginOrganizer function
        const loggedInUserData = result.user; // Assuming the response contains organizer details

    // Save organizer details in local storage
    localStorage.setItem("userDetails", JSON.stringify(loggedInUserData));
        console.log("Organizer Login successful", result.user);
        navigate("/OrganizerDashboard"); // Navigate to the Organizer Dashboard
      } catch (error) {
        console.log("Organizer Login failed",  error.response?.data?.error?.message);
        alert("Organizer Login failed: " + (error.response?.data?.message || "An error occurred during login"));
      }
    } else {
      // Handle unexpected roles
      alert("Invalid role selected. Please select a valid role and try again.");
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
          {/* Dropdown for selecting role */}
          <label>Login As</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="reviewer">Reviewer</option>
            <option value="author">Author</option>
          </select>

          {/* Username input */}
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your User name"
            value={formData.username}
            onChange={handleInputChange}
          />

          {/* Password input */}
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

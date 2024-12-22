import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import "../styles/login.css";

const Login = () => {
    const navigate = useNavigate();
    const handleRegisterClick = () => {
    navigate("/register");
  };
  const handleLoginClick = () => {
    navigate('/OrganizerDashboard'); // Navigate to the Organizer Dashboard page
  };
  return (
    <div className="container">
      <div className="image-section">
        <img src={LoginPageImage} alt="Login" />
      </div>
      <div className="form-section">
        <div className="switch-buttons">
          <button className="active">Login</button>
          <button
            className="registerBtn"
            onClick={handleRegisterClick}
          >
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
            <label style={{display:'flex',flexDirection:'row',width:'20%'}}>
              <input type="checkbox" /> Rememberme
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

import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
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
  );
};

export default Header;

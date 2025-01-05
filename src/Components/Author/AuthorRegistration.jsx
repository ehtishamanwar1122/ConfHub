import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/registerOrganizer.css"
import { LoginPageImage } from "../../assets/Images";
// import { registerOrganizer } from "../Services/api.js";

const RegisterAuthor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    alternativeContact: "",
    areaOfExpertise: "",
    customExpertise: "",
    affiliation: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing fields
    for (let field in formData) {
      if (!formData[field] && field !== 'customExpertise') {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return;
      }
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    // try {
    //   const response = await registerOrganizer(formData);
    //   console.log("Response:", response);
    //   navigate("/login");
    // } catch (err) {
    //   console.error("Error during registration:", err);
    //   setError("Registration failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
          
          <button className="active">Register</button>
        </div>
        <h2>Author Registration</h2>
        <p>
          Welcome to Organizer’s registration form, submit the form and wait for
          the admin’s approval for further activities.
        </p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Alternative Contact"
              name="alternativeContact"
              value={formData.alternativeContact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <select
              name="areaOfExpertise"
              value={formData.areaOfExpertise}
              onChange={handleInputChange}
            >
              <option value="">Select Area of Expertise</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            {formData.areaOfExpertise === "Other" && (
              <input
                type="text"
                placeholder="Custom Expertise"
                name="customExpertise"
                value={formData.customExpertise}
                onChange={handleInputChange}
              />
            )}
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <button className="btn-register" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAuthor;

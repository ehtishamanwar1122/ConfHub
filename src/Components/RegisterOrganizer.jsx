import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registerOrganizer.css";
import { LoginPageImage } from "../assets/Images";
import { registerOrganizer } from "../Services/api.js";

const RegisterOrganizer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    alternativeContact: "",
    affiliation: "",
    department: "",
    password: "",
    confirmPassword: "",
    // Author-specific fields
    fullName: "", 
    phoneNumber: "", 
    orcidId: "", 
    positionTitle: "", 
    country: "", 
    biography: "", 
    researchInterests: "", 
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('organizer'); // 'author' or 'organizer'

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerOrganizer(formData);
      console.log("Response:", response);
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <button onClick={handleRegisterClick}>Login</button>
          <button className="active">Register</button>
        </div>

        {/* Dropdown to switch between Organizer and Author registration */}
        <div className="user-type-dropdown">
          <label>Register as:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="author">Author</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <h2>{userType === 'author' ? 'Author Registration' : 'Organizer Registration'}</h2>
        <p>
          {userType === 'author'
            ? "Welcome to Author’s registration form, submit your paper here."
            : "Welcome to Organizer’s registration form, submit the form and wait for the admin’s approval for further activities."
          }
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Common fields for both Author and Organizer */}
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
              placeholder="Email"
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

          {/* Organizer-specific fields */}
          {userType === 'organizer' && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Affiliation"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {/* Author-specific fields */}
          {userType === 'author' && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="ORCID ID"
                  name="orcidId"
                  value={formData.orcidId}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Position Title"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                <textarea
                  placeholder="Biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                />
                <div className="form-row">
                  <select
                    name="researchInterests"
                    value={formData.researchInterests}
                    onChange={handleInputChange}
                    placeholder="Research Interests"
                  >
                    <option value="">Select Research Interest</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="ML">Machine Learning</option>
                    <option value="DataScience">Data Science</option>
                    <option value="Other">Other</option> {/* Added option for custom input */}
                  </select>

                  {/* Input field for custom research interest */}
                  {formData.researchInterests === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      name="researchInterests"
                      value={formData.researchInterests}
                      onChange={handleInputChange}
                    />
                  )}
                </div>


              </div>
            </>
          )}

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

export default RegisterOrganizer;

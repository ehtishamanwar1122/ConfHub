import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/registerOrganizer.css';
import { LoginPageImage } from '../assets/Images';
import {  registerOrganizer } from '../Services/api.js';
import { registerAuthor } from '../Services/author.js';
import { registerReviewer } from '../Services/reviewerService.js';
const RegisterOrganizer = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("organizer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    alternativeContact: "",
    password: "",
    confirmPassword: "",
    country: "",
    biography: "",
    researchInterests: "",
    affiliation: "",
    department: "",
    fullName: "",
    phoneNumber: "",
    orcidId: "",
    positionTitle: "",
    domain: "",
    subDomain: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        userType === "author"
          ? await registerAuthor({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              alternativeContact: formData.alternativeContact,
              country: formData.country,
              biography: formData.biography,
              researchInterests: formData.researchInterests,
              password: formData.password,
            })
            : userType === "organizer"
          ? await registerOrganizer({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              alternativeContact: formData.alternativeContact,
              affiliation: formData.affiliation,
              department: formData.department,
              password: formData.password,
            })
            : await registerReviewer({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              alternativeContact: formData.alternativeContact,
              domain:formData.domain,
              subDomain:formData.subDomain,
              password: formData.password,
            });

      console.log(`${userType} registration successful`, response);
      navigate("/login");
    } catch (err) {
      console.error(`Error during ${userType} registration:`, err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="image-section">
        <img src={LoginPageImage} alt="Register" />
      </div>
      <div className="form-section">
        <div className="switch-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="active">Register</button>
        </div>

        {/* User Type Selection */}
        <div className="user-type-dropdown">
          <label>Register as:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="author">Author</option>
            <option value="organizer">Organizer</option>
            <option value="reviewer">Reviewer</option>
          </select>
        </div>

        <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Registration</h2>
        <p>
          {userType === "author"
            ? "Welcome to Author’s registration form, submit your paper here."
            : userType === "organizer"
            ? "Welcome to Organizer’s registration form, submit the form and wait for the admin’s approval."
            : "Welcome to Reviewer’s registration form, evaluate submitted papers and contribute to the review process."}
        </p>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
          </div>

          <div className="form-row">
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} />
            <input type="text" placeholder="Alternative Contact" name="alternativeContact" value={formData.alternativeContact} onChange={handleInputChange} />
          </div>

          {userType === "organizer" && (
            <div className="form-row">
              <input type="text" placeholder="Affiliation" name="affiliation" value={formData.affiliation} onChange={handleInputChange} />
              <input type="text" placeholder="Department" name="department" value={formData.department} onChange={handleInputChange} />
            </div>
          )}

          {(userType === "author" || userType === "reviewer") && (
            <>
              {/* <div className="form-row">
                <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                <input type="text" placeholder="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
              </div> */}
              {/* <div className="form-row">
                <input type="text" placeholder="ORCID ID" name="orcidId" value={formData.orcidId} onChange={handleInputChange} />
                <input type="text" placeholder="Position Title" name="positionTitle" value={formData.positionTitle} onChange={handleInputChange} />
              </div> */}
            </>
          )}
           {userType === 'reviewer' && (
            <div className="form-row">
    
              <select name="domain" value={formData.domain} onChange={handleInputChange}>
                <option value="">Select Domain</option>
                <option value="">Select Domain</option>
  <option value="Artificial Intelligence">Artificial Intelligence</option>
  <option value="Machine Learning">Machine Learning</option>
  <option value="Cybersecurity">Cybersecurity</option>
  <option value="Data Science">Data Science</option>
  <option value="Cloud Computing">Cloud Computing</option>
  <option value="Internet of Things">Internet of Things</option>
  <option value="Software Engineering">Software Engineering</option>
  <option value="Computer Networks">Computer Networks</option>
  <option value="Blockchain">Blockchain</option>
  <option value="Human-Computer Interaction">Human-Computer Interaction</option>
  <option value="Natural Language Processing">Natural Language Processing</option>
  <option value="Computer Vision">Computer Vision</option>
  <option value="Big Data">Big Data</option>
  <option value="DevOps">DevOps</option>
  <option value="Robotics">Robotics</option>
  <option value="Edge Computing">Edge Computing</option>
  <option value="Quantum Computing">Quantum Computing</option>
              </select>
              {/* <input type="text" placeholder="Sub Domain" name="subDomain" value={formData.subDomain} onChange={handleInputChange} /> */}
            </div>
          )}

          {userType === "author" && (
            <>{
             <div className="form-row">
             <input type="text" placeholder="Country" name="country" value={formData.country} onChange={handleInputChange} />
             <input type="text" placeholder="Biography" name="biography" value={formData.biography} onChange={handleInputChange} />
           </div>}

           { <div className="form-row">
              <select name="researchInterests" value={formData.researchInterests} onChange={handleInputChange}>
                <option value="">Select Research Interest</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="ML">Machine Learning</option>
                <option value="DataScience">Data Science</option>
                <option value="Other">Other</option>
              </select>
              {formData.researchInterests === "Other" && (
                <input type="text" placeholder="Specify Research Interest" name="customResearchInterest" onChange={handleInputChange} />
              )}
            </div>}
            </>
          )}

          <div className="form-row">
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizer;
import React , { useState }from "react";
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
    });

    const [error, setError] = useState(null); // For handling any errors
    const [loading, setLoading] = useState(false); // To manage loading state
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation (optional)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    setLoading(true);
    setError(null); // Clear previous errors
  
    console.log("Form data before submitting:", formData); // Debugging: Check if the form data is correct
  
    try {
      // Send form data to the backend using the service
      const response = await registerOrganizer(formData);
      console.log("Response:", response); // Handle the response as needed (e.g., success message)
      navigate("/login"); // Redirect after successful registration
    } catch (err) {
      console.error("Error during registration:", err); // More detailed error logging
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Update the specific field in the state
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
      <h2>Organizer Registration</h2>
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
      value={formData.firstName} // Controlled value
      onChange={handleInputChange} // Update state on change
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

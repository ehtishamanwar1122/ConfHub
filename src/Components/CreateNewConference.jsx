import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layouts/Layout';
import '../styles/CreateConference.css'; // Import the CSS file
import { createConference } from '../Services/conference-service';
const CreateConference = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    conferenceTitle: '',
    conferenceDescription: '',
    startDate: '',
    endDate: '',
    conferenceLocation: '',
    trackTitle: '',
    trackDescription: '',
    sessionTitle: '',
    speakerNames: '',
    submissionDeadline: '',
    reviewDeadline: '',
    organizerId:'',
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails && userDetails.organizerId && userDetails.organizerId.id) {
      setFormData((prev) => ({
        ...prev,
        organizerId: userDetails.organizerId.id, // Extract the id from the organizerId object
      }));
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.conferenceTitle.trim()) {
      newErrors.conferenceTitle = 'Conference Title is required.';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start Date is required.';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End Date is required.';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End Date cannot be earlier than Start Date.';
    }
    if (!formData.conferenceLocation.trim()) {
      newErrors.conferenceLocation = 'Conference Location is required.';
    }
    if (!formData.trackTitle.trim()) {
      newErrors.trackTitle = 'Track Title is required.';
    }
    if (!formData.sessionTitle.trim()) {
      newErrors.sessionTitle = 'Session Title is required.';
    }
    if (!formData.speakerNames.trim()) {
      newErrors.speakerNames = 'Speaker Names are required.';
    }
    if (!formData.submissionDeadline) {
      newErrors.submissionDeadline = 'Submission Deadline is required.';
    }
    if (!formData.reviewDeadline) {
      newErrors.reviewDeadline = 'Review Deadline is required.';
    } else if (formData.submissionDeadline && formData.reviewDeadline < formData.submissionDeadline) {
      newErrors.reviewDeadline = 'Review Deadline cannot be earlier than Submission Deadline.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form
    if (!validateForm()) {
      return;
    }
  
    try {
      console.log("Form data before submitting:", formData); // Debugging
  
      // Call the service function with formData
      const response = await createConference(formData);
      console.log("Response:", response); // Handle the response (e.g., success message)
      alert("Conference created successfully! Now wait till your conference is approved by the admin");
      navigate("/OrganizerDashboard");
    } catch (err) {
      console.error("Error during conference creation:", err);
      alert("Failed to create the conference. Please try again.");
    }
  };

  return (
    <Layout>
      <h1>
        <span>Create new</span> <span>Conference</span>
      </h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="conferenceTitle">Conference Title</label>
            <input
              type="text"
              id="conferenceTitle"
              placeholder="Enter conference title"
              value={formData.conferenceTitle}
              onChange={handleChange}
            />
            {errors.conferenceTitle && <p className="error">{errors.conferenceTitle}</p>}
          </div>

          <div>
            <label htmlFor="conferenceDescription">Conference Description</label>
            <textarea
              id="conferenceDescription"
              rows="3"
              placeholder="Enter conference description"
              value={formData.conferenceDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              {errors.startDate && <p className="error">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <p className="error">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="conferenceLocation">Conference Location</label>
            <input
              type="text"
              id="conferenceLocation"
              placeholder="Enter conference location"
              value={formData.conferenceLocation}
              onChange={handleChange}
            />
            {errors.conferenceLocation && <p className="error">{errors.conferenceLocation}</p>}
          </div>

          <h5>Track Details</h5>
          <div>
            <label htmlFor="trackTitle">Track Title</label>
            <input
              type="text"
              id="trackTitle"
              placeholder="Enter track title"
              value={formData.trackTitle}
              onChange={handleChange}
            />
            {errors.trackTitle && <p className="error">{errors.trackTitle}</p>}
          </div>
          <div>
            <label htmlFor="trackDescription">Track Description</label>
            <textarea
              id="trackDescription"
              rows="3"
              placeholder="Enter track description"
              value={formData.trackDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="button">Add Track</button>

          <h5>Session Details</h5>
          <div>
            <label htmlFor="sessionTitle">Session Title</label>
            <input
              type="text"
              id="sessionTitle"
              placeholder="Enter session title"
              value={formData.sessionTitle}
              onChange={handleChange}
            />
            {errors.sessionTitle && <p className="error">{errors.sessionTitle}</p>}
          </div>
          <div>
            <label htmlFor="speakerNames">Speaker Names</label>
            <input
              type="text"
              id="speakerNames"
              placeholder="Enter speakers' names"
              value={formData.speakerNames}
              onChange={handleChange}
            />
            {errors.speakerNames && <p className="error">{errors.speakerNames}</p>}
          </div>

          <h5>Deadlines</h5>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <label htmlFor="submissionDeadline">Submission Deadline</label>
              <input
                type="date"
                id="submissionDeadline"
                value={formData.submissionDeadline}
                onChange={handleChange}
              />
              {errors.submissionDeadline && <p className="error">{errors.submissionDeadline}</p>}
            </div>
            <div>
              <label htmlFor="reviewDeadline">Review Deadline</label>
              <input
                type="date"
                id="reviewDeadline"
                value={formData.reviewDeadline}
                onChange={handleChange}
              />
              {errors.reviewDeadline && <p className="error">{errors.reviewDeadline}</p>}
            </div>
          </div>

          <div className="text-left">
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateConference;

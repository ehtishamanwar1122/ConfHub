import React, { useEffect, useState } from 'react';
import Layout from './Layouts/Layout';
import axios from 'axios';
import '../../styles/SubmitPaper.css'; // Import the CSS file
import { useParams } from "react-router-dom";
import { submitPaper } from '../../Services/author.js';
import { useNavigate } from "react-router-dom";

const PaperSubmissionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // To store the file name
  const [loading, setLoading] = useState(true);
  const [recentConferences, setRecentConferences] = useState([]);
  const [formData, setFormData] = useState({
    paperTitle: "",
    abstract: "",
    submittedBy: "",
    file: null,
    submittedTo: "",
    domain:"",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { files } = e.target;
    const selectedFile = files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: selectedFile,
    }));
    setFileName(selectedFile.name); // Set the selected file name
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Fetch recent conferences and submitted papers from the backend API
        const conferenceResponse = await axios.get(`http://localhost:1337/api/conferences?filters[id][$eq]=${id}`);
        console.log('v--', conferenceResponse.data.data);
        setRecentConferences(conferenceResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paperTitle || !formData.abstract || !formData.domain|| !formData.file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const authorId = userDetails?.authorId.id; // Use correct field for user ID

      if (!authorId) {
        console.error('Author ID not found in local storage');
        return;
      }

      const formDataToSend = {
        paperTitle: formData.paperTitle,
        abstract: formData.abstract,
        domain:formData.domain,
        file: formData.file,
        submittedBy: authorId, // Set user ID from local storage
        submittedTo: id, // Set conference ID from URL
      };

      console.log("Form data before submitting:", formDataToSend); // Debugging

      // Call the service function with formData
      const response = await submitPaper(formDataToSend);
      console.log("Response:", response); // Handle the response (e.g., success message)
      alert("Paper submitted successfully!");
      navigate("/AuthorDashboard");
    } catch (err) {
      console.error("Error during paper submission:", err);
      alert("Failed to submit the paper. Please try again.");
    }
  };

  return recentConferences.map((conference) => (
    <Layout>
      <div className="paper-submission-container">
        <h1 className="page-title">Conference Title: {conference.Conference_title}</h1>
        <h2 className="subheading">Paper Submission deadline: {conference.Submission_deadline}</h2>
        <h2 className="page-title">Submit Your Paper Here:</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Paper Title</label>
            <input
              type="text"
              name="paperTitle"
              placeholder="Enter your Paper Title"
              value={formData.paperTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
                <select name="domain" value={formData.domain} onChange={handleInputChange} >
                <option value="">Select Domain</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="ML">Machine Learning</option>
                <option value="DataScience">Data Science</option>
                <option value="Other">Other</option>
              </select>
              </div>
          <div className="form-group">
            <label>Abstract</label>
            <input
              className='abstract'
              name="abstract"
              placeholder="Enter your Paper Abstract"
              value={formData.abstract}
              onChange={handleInputChange}
            />
          </div>

          <div className="file-upload-container">
            <label>
              Upload files
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={{ display: 'none' }}
                  id="fileUpload"
                />
                <label htmlFor="fileUpload">
                  Choose a file 
                </label>
              </div>
              <p>PDF formats</p>
            </label>
            {fileName && <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Selected File: {fileName}</p>}
{/* Display the selected file name */}
          </div>

          <button type="submit" className="submit-button">
            Submit Paper
          </button>
        </form>
      </div>
    </Layout>
  ));
};

export default PaperSubmissionForm;

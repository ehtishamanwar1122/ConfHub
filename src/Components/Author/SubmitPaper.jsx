import React, { useEffect, useState } from 'react';
import Layout from './Layouts/Layout';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { submitPaper } from '../../Services/author.js';

const PaperSubmissionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentConferences, setRecentConferences] = useState([]);
  const [authors, setAuthors] = useState([
    { name: '', email: '', affiliation: '' }
  ]);
  const [formData, setFormData] = useState({
    paperTitle: "",
    abstract: "",
    submittedBy: "",
    file: null,
    submittedTo: "",
    //domain: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    const selectedFile = files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: selectedFile,
    }));
    setFileName(selectedFile.name);
  };
  const handleAuthorChange = (index, field, value) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  const addAuthor = () => {
    setAuthors([...authors, { name: '', email: '', affiliation: '' }]);
  };

  const removeAuthor = (index) => {
    const updated = [...authors];
    updated.splice(index, 1);
    setAuthors(updated);
  };
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const conferenceResponse = await axios.get(`http://localhost:1337/api/conferences?filters[id][$eq]=${id}`);
        setRecentConferences(conferenceResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.paperTitle || !formData.abstract  || !formData.file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }
  
    try {
      const userDetails = localStorage.getItem("userDetails");
      
      if (!userDetails) {
        console.error('No user details found in localStorage');
        alert('You must be logged in to submit a paper.');
        return;
      }
  
      const parsedUserDetails = JSON.parse(userDetails);
      const authorId = parsedUserDetails?.authorId?.id;
  
      if (!authorId) {
        console.error('Author ID not found in userDetails');
        alert('Author ID is missing. Please log in again.');
        return;
      }
      const submissionData = new FormData();
      submissionData.append('paperTitle', formData.paperTitle);
      submissionData.append('abstract', formData.abstract);
     // submissionData.append('domain', formData.domain);
      submissionData.append('file', formData.file);
      submissionData.append('submittedBy', authorId);
      submissionData.append('submittedTo', id);
      submissionData.append('authors', JSON.stringify(authors));

      await submitPaper(submissionData);
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
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6D24C5] to-[#9F13AB] bg-clip-text text-transparent">
          Conference Title: {conference.Conference_title}
        </h1>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Paper Submission deadline: {conference.Submission_deadline}
        </h2>
        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6D24C5] to-[#9F13AB] bg-clip-text text-transparent">
          Submit Your Paper Here:
        </h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Title</label>
            <input
              type="text"
              name="paperTitle"
              placeholder="Enter your Paper Title"
              value={formData.paperTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select 
              name="domain" 
              value={formData.domain} 
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Domain</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="ML">Machine Learning</option>
              <option value="DataScience">Data Science</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
            <textarea
              name="abstract"
              placeholder="Enter your Paper Abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Paper (PDF only)</label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                Choose File
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                  id="fileUpload"
                  required
                />
              </label>
              {fileName && (
                <span className="ml-3 text-sm text-gray-700">{fileName}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">PDF format required</p>
          </div>
          <div className="form-group mt-4">
  <h3 className="text-md font-semibold mb-2">Multiple Authors (Optional)</h3>
  {authors.map((author, index) => (
    <div key={index} className="mb-4 border p-4 rounded-md bg-gray-50">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
        <input
          type="text"
          value={author.name}
          onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Author Email</label>
        <input
          type="email"
          value={author.email}
          onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
        <input
          type="text"
          value={author.affiliation}
          onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {index > 0 && (
        <button
          type="button"
          onClick={() => removeAuthor(index)}
          className="mt-2 text-red-600 text-sm underline"
        >
          Remove Author
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={addAuthor}
    className="mt-2 text-blue-600 font-medium underline"
  >
    + Add Another Author
  </button>
</div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Submit Paper
          </button>
        </form>
      </div>
    </Layout>
  ));
};

export default PaperSubmissionForm;
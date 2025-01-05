import React, { useState } from 'react';
import Layout from './Layouts/Layout';
import '../../styles/SubmitPaper.css'; // Import the CSS file

const PaperSubmissionForm = () => {
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Paper Title:', paperTitle);
    console.log('Abstract:', abstract);
    console.log('File:', file);
  };

  return (
    <Layout>
      <div className="paper-submission-container">
        <button className="back-button" onClick={() => window.history.back()}>
          &lt; Back
        </button>
        <h1 className="page-title">Conference Title: The AI Summit Cust</h1>
        <h2 className="subheading">Submit Your Paper Here:</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>
              Paper Title:
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Abstract:
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
              />
            </label>
          </div>
          <div className="file-upload-container">
            <label>
              Upload files
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={{ display: 'none' }}
                  id="fileUpload"
                />
                <label htmlFor="fileUpload">
                  Choose a file or drag & drop it here
                </label>
              </div>
              <p>PDF formats</p>
            </label>
          </div>
          <button type="submit" className="submit-button">
            Submit Paper
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PaperSubmissionForm;

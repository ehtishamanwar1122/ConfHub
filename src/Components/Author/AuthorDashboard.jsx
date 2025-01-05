import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import '../../styles/AuthorDashboard.css'; // Import your CSS file
import Layout from './Layouts/Layout';
import styled from 'styled-components'; // Styled-components for tab styling

const AuthorDashboard = () => {
  const [recentConferences, setRecentConferences] = useState([]); // Recent conferences
  const [submittedPapers, setSubmittedPapers] = useState([]); // Submitted papers
  const [activeTab, setActiveTab] = useState('conferences'); // Tracks the active tab
  const [loading, setLoading] = useState(true);

  // Fetch recent conferences and submitted papers
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Fetch recent conferences and submitted papers from the backend API
        const conferenceResponse = await axios.get('http://localhost:1337/api/conferences/recent');
        const papersResponse = await axios.get('http://localhost:1337/api/papers/submitted');
        
        setRecentConferences(conferenceResponse.data);
        setSubmittedPapers(papersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  const renderConferences = () => {
    if (loading) {
      return <p>Loading conferences...</p>;
    }

    if (recentConferences.length === 0) {
      return <p>No recent conferences found.</p>;
    }

    return recentConferences.map((conference) => (
      <div className="conference-card" key={conference.id}>
        <h3>{conference.title}</h3>
        <p>{conference.description}</p>
        <p><strong>Start Date:</strong> {conference.startDate}</p>
        <p><strong>Location:</strong> {conference.location}</p>
      </div>
    ));
  };

  const renderPapers = () => {
    if (loading) {
      return <p>Loading papers...</p>;
    }

    if (submittedPapers.length === 0) {
      return <p>No papers submitted yet.</p>;
    }

    return submittedPapers.map((paper) => (
      <div className="paper-card" key={paper.id}>
        <h3>{paper.title}</h3>
        <p><strong>Conference:</strong> {paper.conference}</p>
        <p><strong>Status:</strong> {paper.status}</p>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="main-content">
        <h1>Welcome to Author Dashboard</h1>

        <TabContainer>
          <Tab active={activeTab === 'conferences'} onClick={() => setActiveTab('conferences')}>
            Recent Conferences
          </Tab>
          <Tab active={activeTab === 'papers'} onClick={() => setActiveTab('papers')}>
            Submitted Papers
          </Tab>
        </TabContainer>

        <div className="content-container">
          {activeTab === 'conferences' ? renderConferences() : renderPapers()}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorDashboard;

// Styled Components
const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 25px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  border-radius: 25px;
  margin-right: 10px;
`;


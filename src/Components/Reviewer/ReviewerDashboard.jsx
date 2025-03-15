import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import Layout from './Layouts/Layout';
import styled from 'styled-components'; // For styling

const ReviewerDashboard = () => {
  const [assignedPapers, setAssignedPapers] = useState([]); // Papers assigned to the reviewer
  const [reviewDeadlines, setReviewDeadlines] = useState([]); // Upcoming review deadlines
  const [ongoingPapers, setOngoingPapers] = useState([]); // Ongoing papers in the reviewer's domain
  const [activeTab, setActiveTab] = useState('papers'); // Tracks the active tab
  const [loading, setLoading] = useState(true); // Loading state

  // Reviewer's domain and sub-domain (replace with dynamic values from the reviewer's profile)
  const reviewerDomain = 'Computer Science'; // Example domain
  const reviewerSubDomain = 'Artificial Intelligence'; // Example sub-domain

  // Fetch data for the reviewer dashboard
  useEffect(() => {
    const fetchReviewerData = async () => {
      try {
        // Fetch assigned papers
        const papersResponse = await axios.get('http://localhost:1337/api/papers/assigned');
        setAssignedPapers(papersResponse.data);

        // Fetch review deadlines
        const deadlinesResponse = await axios.get('http://localhost:1337/api/reviews/deadlines');
        setReviewDeadlines(deadlinesResponse.data);

        // Fetch ongoing papers based on the reviewer's domain and sub-domain
        const ongoingResponse = await axios.get('http://localhost:1337/api/papers/ongoing', {
          params: {
            domain: reviewerDomain, // Pass reviewer's domain
            subDomain: reviewerSubDomain, // Pass reviewer's sub-domain
          },
        });
        setOngoingPapers(ongoingResponse.data);

        setLoading(false); // Data fetching complete
      } catch (error) {
        console.error('Error fetching reviewer data:', error);
        setLoading(false);
      }
    };

    fetchReviewerData();
  }, [reviewerDomain, reviewerSubDomain]); // Re-fetch data if domain/sub-domain changes

  // Render assigned papers
  const renderAssignedPapers = () => {
    if (loading) return <p>Loading assigned papers...</p>;
    if (assignedPapers.length === 0) return <p>No papers assigned for review.</p>;

    return assignedPapers.map((paper) => (
      <PaperCard key={paper.id}>
        <h3>{paper.title}</h3>
        <p><strong>Conference:</strong> {paper.conference}</p>
        <p><strong>Deadline:</strong> {paper.deadline}</p>
        <p><strong>Status:</strong> {paper.status}</p>
      </PaperCard>
    ));
  };

  // Render review deadlines
  const renderReviewDeadlines = () => {
    if (loading) return <p>Loading review deadlines...</p>;
    if (reviewDeadlines.length === 0) return <p>No upcoming review deadlines.</p>;

    return reviewDeadlines.map((deadline) => (
      <DeadlineCard key={deadline.id}>
        <h3>{deadline.conference}</h3>
        <p><strong>Paper Title:</strong> {deadline.paperTitle}</p>
        <p><strong>Deadline:</strong> {deadline.deadline}</p>
      </DeadlineCard>
    ));
  };

  // Render ongoing papers
  const renderOngoingPapers = () => {
    if (loading) return <p>Loading ongoing papers...</p>;
    if (ongoingPapers.length === 0) return <p>No ongoing papers in your domain.</p>;

    return ongoingPapers.map((paper) => (
      <PaperCard key={paper.id}>
        <h3>{paper.title}</h3>
        <p><strong>Domain:</strong> {paper.domain}</p>
        <p><strong>Sub-Domain:</strong> {paper.subDomain}</p>
        <p><strong>Conference:</strong> {paper.conference}</p>
        <p><strong>Status:</strong> {paper.status}</p>
      </PaperCard>
    ));
  };

  return (
    <Layout>
      <MainContent>
        <h1>Welcome to Reviewer Dashboard</h1>

        {/* Tabs for navigation */}
        <TabContainer>
          <Tab active={activeTab === 'papers'} onClick={() => setActiveTab('papers')}>
            Assigned Papers
          </Tab>
          <Tab active={activeTab === 'deadlines'} onClick={() => setActiveTab('deadlines')}>
            Review Deadlines
          </Tab>
          <Tab active={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')}>
            Ongoing Papers
          </Tab>
        </TabContainer>

        {/* Content based on active tab */}
        <ContentContainer>
          {activeTab === 'papers' && renderAssignedPapers()}
          {activeTab === 'deadlines' && renderReviewDeadlines()}
          {activeTab === 'ongoing' && renderOngoingPapers()}
        </ContentContainer>
      </MainContent>
    </Layout>
  );
};

export default ReviewerDashboard;

// Styled Components
const MainContent = styled.div`
  padding: 20px;
`;

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
  background-color: ${(props) => (props.active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  cursor: pointer;
  border-radius: 25px;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#007bff' : '#e9ecef')};
  }
`;

const ContentContainer = styled.div`
  margin-top: 20px;
`;

const PaperCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;

  h3 {
    margin-top: 0;
  }

  p {
    margin: 5px 0;
  }
`;

const DeadlineCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;

  h3 {
    margin-top: 0;
  }

  p {
    margin: 5px 0;
  }
`;
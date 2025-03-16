import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import Layout from './Layouts/Layout';
import styled from 'styled-components'; // For styling

const ReviewerDashboard = () => {
  const [assignedPapers, setAssignedPapers] = useState([]); // Papers assigned to the reviewer
  const [reviewDeadlines, setReviewDeadlines] = useState([]); // Upcoming review deadlines
  const [ongoingPapers, setOngoingPapers] = useState([]); // Ongoing papers matching reviewer's domain
  const [activeTab, setActiveTab] = useState("papers"); // Tracks the active tab
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch reviewer ID from local storage
  const storedUser = JSON.parse(localStorage.getItem("userDetails"));
const userId = storedUser?.id; // Extract id properly

  useEffect(() => {
    const fetchReviewerData = async () => {
      try {
        // Step 1: Get user ID from local storage
       
  
        if (!userId) {
          console.error("User ID not found in local storage.");
          setLoading(false);
          return;
        }
  
        // Step 2: Fetch user details
        const userResponse = await axios.get(`http://localhost:1337/api/users/${userId}?populate=reviewerId`);
        const userData = userResponse.data;
  
        console.log("User Data:", userData);
       
        
        const domain = userData?.reviewerId?.domain;

        console.log("Reviewer domain:", domain);

        // Fetch papers
        const papersResponse = await axios.get("http://localhost:1337/api/papers?populate[SubmittedBy][populate]=*&populate[SubmittedTo][populate]=*&populate[conference][populate]=*");
        const papers = papersResponse.data;
       console.log('paperss',papers);
       
       const papersArray = papers.data || []; // Extract the array
       const filteredPapers = papersArray.filter(
         (paper) => paper.Domain === domain
       );
       console.log('filtered',filteredPapers);
       
        setOngoingPapers(filteredPapers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviewer data:", error);
        setLoading(false);
      }
    };

    fetchReviewerData();
  }, []);

  // Render ongoing papers
  const renderOngoingPapers = () => {
    if (loading) return <p>Loading ongoing papers...</p>;
    if (ongoingPapers.length === 0) return <p>No ongoing papers in your domain.</p>;

    return ongoingPapers.map((paper) => (
      <PaperCard key={paper.id}>
        
        <p>
          <strong>Paper Title:</strong><h3>{paper.Paper_Title}</h3>
        </p>
        <p>
          {/* <strong>Submitted By:</strong> {paper.Domain} */}
        </p>
        <p>
          <strong>Conference Name:</strong> {paper.SubmittedTo.Conference_title}
        </p>
        <p>
          <strong>Domain:</strong> {paper.Domain}
        </p>
        <p>
          <strong>Review Deadline:</strong> {paper.conference.Review_deadline}
        </p>
        <button>Review This Paper</button>
      </PaperCard>
    ));
  };

  return (
    <Layout>
      <MainContent>
        <h1>Welcome to Reviewer Dashboard</h1>

        {/* Tabs for navigation */}
        <TabContainer>
          <Tab active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")}>
            Ongoing Papers
          </Tab>
          <Tab active={activeTab === "papers"} onClick={() => setActiveTab("papers")}>
            Assigned Papers
          </Tab>
        </TabContainer>

        {/* Content based on active tab */}
        <ContentContainer>
          {activeTab === "ongoing" && renderOngoingPapers()}
          {activeTab === "papers" && <p>No assigned papers implemented yet.</p>}
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
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import Layout from './Layouts/Layout';
import styled from 'styled-components'; // For styling
import { reviewRequest } from '../../Services/reviewerService';
const ReviewerDashboard = () => {
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [reviewDeadlines, setReviewDeadlines] = useState([]);
  const [ongoingPapers, setOngoingPapers] = useState([]); // Ongoing papers matching reviewer's domain
  const [activeTab, setActiveTab] = useState("papers"); // Tracks the active tab
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch reviewer ID from local storage
  const storedUser = JSON.parse(localStorage.getItem("userDetails"));
const userId = storedUser?.id; // Extract id properly
const reviewerId=storedUser.reviewerId.id;
  useEffect(() => {
    const fetchReviewerData = async () => {
      try {
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
        const papersResponse = await axios.get("http://localhost:1337/api/papers?populate=*");
        const papers = papersResponse.data;
       console.log('paperss',papers);
       
       const papersArray = papers.data || []; // Extract the array
       const filteredPapers = papersArray.filter(
         (paper) => paper.Domain === domain
       );
       console.log('filtered',filteredPapers);
       
        setOngoingPapers(filteredPapers);
        
        
        // Fetch assigned papers
        const papersResponse2 = await axios.get(
          `http://localhost:1337/api/papers?filters[reviewRequestsConfirmed][id][$eq]=${reviewerId}&populate=*`
        );
        const assignedPapersData = papersResponse2.data?.data || [];
        console.log("Assigned Papers Data:", papersResponse2);
        console.log('papers',assignedPapersData);
        
        setAssignedPapers(assignedPapersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviewer data:", error);
        setLoading(false);
      }
    };

    fetchReviewerData();
  }, []);

  const handleReviewRequest = async (paper) => {
    alert("Request received! Your review request has been submitted.");
console.log('pp',paper);
const payload = {
  paperId: paper.id,
  reviewerId: reviewerId,
  status: "pending",
};
try {
  const response = await reviewRequest(payload);
  console.log("Review request sent successfully:", response);
} catch (error) {
  console.error("Failed to send review request:", error);
}
  };
  
  const renderOngoingPapers = () => {
    if (loading) return <p>Loading ongoing papers...</p>;
    if (ongoingPapers.length === 0) return <p>No ongoing papers in your domain.</p>;

    return ongoingPapers.map((paper) => (
      <PaperCard key={paper.id}>
        
        <p>
          <strong>Paper Title:</strong><h3>{paper.Paper_Title}</h3>
        </p>
        <p>
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
        <button onClick={() => handleReviewRequest(paper)}>
          Review This Paper
        </button>
      </PaperCard>
    ));
  };

  return (
    <Layout>
      <MainContent>
        <h1>Welcome to Reviewer Dashboard</h1>

        <TabContainer>
          <Tab active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")}>
            Ongoing Papers
          </Tab>
          <Tab active={activeTab === "papers"} onClick={() => setActiveTab("papers")}>
            Assigned Papers
          </Tab>
          <Tab active={activeTab === "completed"} onClick={() => setActiveTab("submitted")}>
            Completed Reviews
          </Tab>
        </TabContainer>

        <ContentContainer>
          {activeTab === "ongoing" && renderOngoingPapers()}
          {activeTab === "papers" && assignedPapers.map((paper) => (
            <PaperCard key={paper.id}>
             
              <p><strong>Paper Title:</strong> {paper.Paper_Title}</p>
              <p><strong>Author:</strong> {paper.Author}</p>
              <p><strong>Conference Title:</strong> {paper.SubmittedTo?.Conference_title}</p>
              <p><strong>Review Deadline:</strong> {paper.conference?.Review_deadline}</p>
              {paper.file?.url && (
  <a 
    href={paper.file.url} 
    download={paper.file.name} 
    className="download-button"
    target="_blank" 
    rel="noopener noreferrer"
  >
    <i className="fa fa-download"></i> Download Paper
  </a>
)} <button 
className="submit-review-button" 
onClick={() => window.location.href=`/SubmitReview/${paper.id}`}
>
<i className="fa fa-edit"></i> Submit Review
</button>
            </PaperCard>
          ))}
        </ContentContainer>
      </MainContent>
    </Layout>
  );
};

export default ReviewerDashboard;

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
    font-size:20px;
  }
 .download-container {
  display: flex;
  justify-content: center;  /* Centers horizontally */
  align-items: center;      /* Centers vertically (if needed) */
  height: 100%;             /* Adjust as necessary */
}

.download-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

.download-button i {
  margin-right: 8px;
}

/* Hover Effect */
.download-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Slight zoom effect */
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 15px; /* Space between buttons */
  margin-top: 15px;
}

.download-button, .submit-review-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s;
}

.download-button {
  background-color: #007bff;
  color: white;
  border: none;
}

.submit-review-button {
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.download-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.submit-review-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.download-button i, .submit-review-button i {
  margin-right: 8px;
}


`;
import '@fortawesome/fontawesome-free/css/all.min.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import Layout from './Layouts/Layout';
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
  const reviewerId = storedUser?.reviewerId?.id; // Safely access reviewerId

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
       console.log('papers', papers);
       
       const papersArray = papers.data || []; // Extract the array
       const filteredPapers = papersArray.filter(
         (paper) => paper.Domain === domain
       );
       console.log('filtered', filteredPapers);
       
        setOngoingPapers(filteredPapers);
        
        // Fetch assigned papers
        const papersResponse2 = await axios.get(
          `http://localhost:1337/api/papers?filters[reviewRequestsConfirmed][id][$eq]=${reviewerId}&populate=*`
        );
        const assignedPapersData = papersResponse2.data?.data || [];
        console.log("Assigned Papers Data:", papersResponse2);
        console.log('assigned papers', assignedPapersData);
        
        setAssignedPapers(assignedPapersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviewer data:", error);
        setLoading(false);
      }
    };

    fetchReviewerData();
  }, [userId, reviewerId]); // Added userId and reviewerId as dependencies to refetch when they change

  const handleReviewRequest = async (paper) => {
    alert("Request received! Your review request has been submitted.");
    console.log('pp', paper);
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
      <div key={paper.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
        <p><strong>Paper Title:</strong><h3>{paper.Paper_Title}</h3></p>
        <p><strong>Conference Name:</strong> {paper.SubmittedTo.Conference_title}</p>
        <p><strong>Domain:</strong> {paper.Domain}</p>
        <p><strong>Review Deadline:</strong> {paper.conference.Review_deadline}</p>
        <button 
          onClick={() => handleReviewRequest(paper)} 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Review This Paper
        </button>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Reviewer Dashboard</h1>

        <div className="flex mb-6 bg-gray-100 p-2 rounded-full">
          <button 
            onClick={() => setActiveTab("ongoing")} 
            className={`py-2 px-6 rounded-full ${activeTab === "ongoing" ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700'}`}
          >
            Ongoing Papers
          </button>
          <button 
            onClick={() => setActiveTab("papers")} 
            className={`py-2 px-6 rounded-full ${activeTab === "papers" ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700'}`}
          >
            Assigned Papers
          </button>
          <button 
            onClick={() => setActiveTab("completed")} 
            className={`py-2 px-6 rounded-full ${activeTab === "completed" ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700'}`}
          >
            Completed Reviews
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "ongoing" && renderOngoingPapers()}
          {activeTab === "papers" && assignedPapers.map((paper) => (
            <div key={paper.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Paper Title:</strong> {paper.Paper_Title}</p>
              <p><strong>Author:</strong> {paper.Author}</p>
              <p><strong>Conference Title:</strong> {paper.SubmittedTo?.Conference_title}</p>
              <p><strong>Review Deadline:</strong> {paper.conference?.Review_deadline}</p>
              {paper.file?.url && (
                <a 
                  href={paper.file.url} 
                  download={paper.file.name} 
                  className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-download mr-2"></i> Download Paper
                </a>
              )}
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => window.location.href=`/SubmitReview/${paper.id}`}
              >
                <i className="fa fa-edit mr-2"></i> Submit Review
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewerDashboard;

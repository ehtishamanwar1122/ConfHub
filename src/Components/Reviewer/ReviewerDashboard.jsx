import React, { useState, useEffect } from 'react';
import Layout from './Layouts/Layout';
// import axios from 'axios'; // Commented out for demo
// import { reviewRequest } from '../../Services/reviewerService';

const ReviewerDashboard = () => {
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [ongoingPapers, setOngoingPapers] = useState([]);
  const [activeTab, setActiveTab] = useState("papers");
  const [loading, setLoading] = useState(true);

  // const storedUser = JSON.parse(localStorage.getItem("userDetails"));
  // const userId = storedUser?.id;
  // const reviewerId = storedUser?.reviewerId?.id;

  useEffect(() => {
    // Commented API calls
    // const fetchReviewerData = async () => {
    //   try {
    //     if (!userId) return;

    //     const userResponse = await axios.get(`http://localhost:1337/api/users/${userId}?populate=reviewerId`);
    //     const domain = userResponse.data?.reviewerId?.domain;

    //     const papersResponse = await axios.get("http://localhost:1337/api/papers?populate=*");
    //     const papersArray = papersResponse.data?.data || [];
    //     const filteredPapers = papersArray.filter(paper => paper.Domain === domain);
    //     setOngoingPapers(filteredPapers);

    //     const papersResponse2 = await axios.get(
    //       `http://localhost:1337/api/papers?filters[reviewRequestsConfirmed][id][$eq]=${reviewerId}&populate=*`
    //     );
    //     setAssignedPapers(papersResponse2.data?.data || []);
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   setLoading(false);
    // };

    // fetchReviewerData();

    // Dummy data
    const dummyOngoing = [
      {
        id: 1,
        Paper_Title: "AI for Healthcare",
        Domain: "Artificial Intelligence",
        SubmittedTo: { Conference_title: "ICAI 2025" },
        conference: { Review_deadline: "2025-05-15" },
      },
      {
        id: 2,
        Paper_Title: "Quantum Machine Learning",
        Domain: "Artificial Intelligence",
        SubmittedTo: { Conference_title: "QMLConf 2025" },
        conference: { Review_deadline: "2025-06-01" },
      }
    ];

    const dummyAssigned = [
      {
        id: 3,
        Paper_Title: "Ethics in AI",
        Author: "John Doe",
        SubmittedTo: { Conference_title: "ICAI 2025" },
        conference: { Review_deadline: "2025-05-20" },
        file: {
          url: "https://example.com/paper.pdf",
          name: "Ethics_in_AI.pdf"
        }
      }
    ];

    setOngoingPapers(dummyOngoing);
    setAssignedPapers(dummyAssigned);
    setLoading(false);
  }, []);

  const handleReviewRequest = async (paper) => {
    alert("Request received! Your review request has been submitted.");
    console.log("Review request for:", paper);
    // const payload = {
    //   paperId: paper.id,
    //   reviewerId,
    //   status: "pending",
    // };
    // try {
    //   const response = await reviewRequest(payload);
    //   console.log("Review request sent:", response);
    // } catch (error) {
    //   console.error("Failed:", error);
    // }
  };

  const renderOngoingPapers = () => {
    if (loading) return <p>Loading ongoing papers...</p>;
    if (ongoingPapers.length === 0) return <p>No ongoing papers in your domain.</p>;

    return ongoingPapers.map((paper) => (
      <div key={paper.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
        <p><strong>Paper Title:</strong> <h3>{paper.Paper_Title}</h3></p>
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
  
  {activeTab === "papers" && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignedPapers.map((paper) => (
        <div key={paper.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">{paper.Paper_Title}</h3>
          <p className="text-sm mb-1"><strong>Author:</strong> {paper.Author}</p>
          <p className="text-sm mb-1"><strong>Conference:</strong> {paper.SubmittedTo?.Conference_title}</p>
          <p className="text-sm mb-4"><strong>Deadline:</strong> {paper.conference?.Review_deadline}</p>

          <div className="flex flex-col gap-3">
            {paper.file?.url && (
              <a
                href={paper.file.url}
                download={paper.file.name}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-download mr-2"></i> Download Paper
              </a>
            )}
            <button
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
              onClick={() => window.location.href = `/SubmitReview/${paper.id}`}
            >
              <i className="fa fa-edit mr-2"></i> Submit Review
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </Layout>
  );
};

export default ReviewerDashboard;

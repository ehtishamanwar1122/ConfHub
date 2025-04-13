import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import axios for making API requests (commented for dummy data)
import Layout from './Layouts/Layout';
import { useNavigate } from "react-router-dom";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [recentConferences, setRecentConferences] = useState([]); // Recent conferences
  const [submittedPapers, setSubmittedPapers] = useState([]); // Submitted papers
  const [activeTab, setActiveTab] = useState('conferences'); // Tracks the active tab
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch recent conferences and submitted papers (dummy data instead of real API)
  useEffect(() => {
    // Dummy data for recent conferences
    const dummyConferences = [
      {
        id: 1,
        Conference_title: "International AI Conference",
        Description: "Explore the future of artificial intelligence.",
        Start_date: "2025-05-10",
        Conference_location: "Berlin, Germany",
        Papers: [{}, {}, {}],
        Submission_deadline: "2025-04-30",
      },
      {
        id: 2,
        Conference_title: "Web Development Expo",
        Description: "Dive into the latest trends in web technologies.",
        Start_date: "2025-06-15",
        Conference_location: "New York, USA",
        Papers: [{}],
        Submission_deadline: "2025-05-20",
      },
    ];

    // Dummy data for submitted papers
    const dummyPapers = [
      {
        id: 1,
        title: "AI in Healthcare",
        conference: "International AI Conference",
        status: "Under Review",
      },
      {
        id: 2,
        title: "Optimizing React Apps",
        conference: "Web Development Expo",
        status: "Accepted",
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setRecentConferences(dummyConferences);
      setSubmittedPapers(dummyPapers);
      setLoading(false);
    }, 1000);

    // Uncomment below if switching back to API
    /*
    const fetchAuthorData = async () => {
      try {
        const conferenceResponse = await axios.get(
          'http://localhost:1337/api/conferences?filters[requestStatus][$eq]=approved&populate=*'
        );
        const papersResponse = await axios.get('http://localhost:1337/api/papers/submitted');
        setRecentConferences(conferenceResponse.data.data);
        setSubmittedPapers(papersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching author data:', error);
        setLoading(false);
      }
    };

    fetchAuthorData();
    */
  }, []);

  // Navigate to Submit Paper page
  const handleSubmitPaper = (conferenceId) => {
    navigate(`/SubmitPaper/${conferenceId}`);
  };

  // Handle review viewing (dummy handler)
  const handleShowReview = (paperId) => {
    alert(`Showing review for paper ID: ${paperId}`);
    navigate(`/paper-review/${paperId}`);
  };

  // Render recent conferences
  const renderConferences = () => {
    if (loading) return <p>Loading conferences...</p>;
    if (recentConferences.length === 0) return <p>No recent conferences found.</p>;

    return (
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
        {recentConferences.map((conference) => (
          <div className="bg-white shadow-2xl border-black rounded-lg  p-6" key={conference.id}>
            <h3 className="text-xl text-center font-bold mb-2">{conference.Conference_title}</h3>
            <p className="mb-2">{conference.Description}</p>
            <p><strong>Start Date:</strong> {conference.Start_date}</p>
            <p><strong>Location:</strong> {conference.Conference_location}</p>
            <p><strong>Papers Submitted:</strong> {conference.Papers.length}</p>
            <p><strong>Submission Deadline:</strong> {conference.Submission_deadline}</p>
            <button
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleSubmitPaper(conference.id)}
            >
              Submit Your Paper
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render submitted papers
  const renderPapers = () => {
    if (loading) return <p>Loading papers...</p>;
    if (submittedPapers.length === 0) return <p>No papers submitted yet.</p>;

    return submittedPapers.map((paper) => (
      <div className="bg-white rounded-lg  shadow p-6 mb-4" key={paper.id}>
        <h3 className="text-xl text-center font-semibold mb-2">{paper.title}</h3>
        <p><strong>Conference:</strong> {paper.conference}</p>
        <p><strong>Status:</strong> {paper.status}</p>
        <button
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => handleShowReview(paper.id)}
        >
          Show Review
        </button>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Author Dashboard</h1>

        {/* Tab Buttons */}
        <div className="flex mb-6 bg-gray-200 rounded-full overflow-hidden">
          <button
            className={`px-6 py-2 w-1/2 text-center transition-all duration-200 ${activeTab === 'conferences' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('conferences')}
          >
            Ongoing Conferences
          </button>
          <button
            className={`px-6 py-2 w-1/2 text-center transition-all duration-200 ${activeTab === 'papers' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('papers')}
          >
            Submitted Papers
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'conferences' ? renderConferences() : renderPapers()}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorDashboard;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './ConferenceDetails.css'
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { dashboard_bg } from "../../assets/Images";
const OrgConfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [submittedPapers, setSubmittedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [newDeadline, setNewDeadline] = useState('');

const [showReviewModal, setShowReviewModal] = useState(false);
const [reviewDeadline, setReviewDeadline] = useState(false);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
          
        const response = await axios.get(`http://localhost:1337/api/conferences?filters[id][$eq]=${id}&populate[Papers][populate]=*`);
 const confData = response.data.data;
        setConference(confData);
        setLoading(false);
 console.log('ddd',confData);
 
 if (confData.length > 0) {
  const papers = confData[0].Papers || []; // No `.data` here
  setSubmittedPapers(papers);
}

      } catch (error) {
        console.error("Error fetching conference details:", error);
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [id]);
  const handleShowReviews = (paperId) => {
    const paper = submittedPapers.find((p) => p.id === paperId);
    console.log('rr',paper.review);
    
    if (paper) {
      setSelectedReviews(paper.review); // Set the reviews for the selected paper
      setIsModalOpen(true); // Open the modal
      setSelectedPaper(paper)
    }
  };
  
  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Hide the modal
    setSelectedReviews(null); 
    setSelectedPaper(null);
  };
  const handleJoinConference = () => {
  
    navigate("/register");
  };
  const handleDecision = async (decision) => {
    try {
      const payload = {
        paperId:selectedPaper.id, 
        decision, 
      };
  console.log('payy',payload);
  
      
      const response = await axios.post('http://localhost:1337/api/organizers/final-decision', payload);
  
      if (response.status === 200) {
        console.log('Decision sent successfully:', response.data);
        window.location.reload();
        handleCloseModal(); // Close the modal after submitting the decision
      } else {
        console.error('Failed to send decision:', response.data);
      }
    } catch (error) {
      console.error('Error sending decision:', error);
    }
  };
  const handleReviewDeadlineSubmit = async () => {
    const payload = {
     
        id: conference[0].id,
        Review_deadline: reviewDeadline,
      
    };
  
    try {
      const response = await axios.post('http://localhost:1337/api/conferences/updateReviewDeadline', payload);
  
      if (response.status === 200) {
        const updatedConference = [...conference];
        updatedConference[0].Review_deadline = reviewDeadline;
        setConference(updatedConference);
        setShowReviewModal(false);
      }
    } catch (error) {
      console.error("Error updating review deadline:", error);
    }
  };
  

  const openEditModal = () => {
    setNewDeadline(conference[0]?.Submission_deadline || '');
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  if (loading) return <p>Loading...</p>;

  return (
    <>
  <Header />
  <div >
    
  <section className="conference-details">
  {loading ? (
    <p>Loading conferences...</p>
  ) : conference.length > 0 ? (
    <>
      <div className="conference-info">
        {conference.map((conference) => (
          <div key={conference.id}>
            <h2>{conference.Conference_title}</h2>
            <p><strong>Organizer's Name:</strong> {conference.Organizer?.Organizer_FirstName} {conference.Organizer?.Organizer_LastName}</p>
            <p><strong>Conference Description:</strong> {conference.Description}</p>
            <p><strong>Status:</strong> {conference.Status}</p>
            <p><strong>Start Date:</strong> {conference.Start_date}</p>
            {/* <p><strong>Time:</strong> {conference.Conference_time}</p> */}
            <div style={{ display: 'flex', justifyContent: 'center', gap:'20px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <p style={{ margin: 0 }}>
      <strong>Paper Submission Deadline:</strong> {conference.Submission_deadline}
    </p>
    <button onClick={openEditModal}>Edit</button>
  </div>
  {/* Review Deadline (if exists) */}
  {conference.Review_deadline && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ margin: 0 }}>
          <strong>Review Deadline:</strong> {conference.Review_deadline}
        </p>
        <button onClick={() => setShowReviewModal(true)}>Edit</button>
      </div>
    )}
</div>
  {/* If no Review Deadline, show Add button */}
  {!conference.Review_deadline && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <button onClick={() => setShowReviewModal(true)}>
        Add Review Deadline
      </button>
    </div>
    
    )}



          </div>

        ))}
      </div>

      <div className="papers-section">
        <h3 class='paperheading'>Submitted Papers</h3>
        {submittedPapers.length > 0 ? (
  <div className="papers-container">
    {[...submittedPapers]
      .sort((a, b) => b.review.length - a.review.length) // Sort papers by review count (descending)
      .map(paper => (
        <div key={paper.id} className="paper-card">
          <div className="paper-info">
          <p><strong>Paper Id:</strong> {paper.id || "N/A"}</p>
            <h4>Paper Title: {paper.Paper_Title}</h4>
            <p><strong>Author:</strong> {paper.Author || "N/A"}</p>
            <p><strong>Submission Date:</strong> {new Date(paper.submissionDate).toLocaleDateString()}</p>
            <p><strong>Abstract:</strong> {paper.Abstract.slice(0, 100)}...</p>
            <p><strong>Reviews Submitted:</strong> {paper.review.length}</p>
          </div>
          <div className="paper-actions">
            {paper.finalDecisionByOrganizer ? (
              <span className="final-decision">Final Decision Submitted</span>
            ) : (
              <button
                onClick={() => handleShowReviews(paper.id)}
                disabled={paper.review.length === 0}
                className={paper.review.length === 0 ? 'disabled-button' : ''}
              >
                Show Submitted Reviews
              </button>
            )}
          </div>
        </div>
      ))}
  </div>
) : (
  <p>No papers submitted yet.</p>
)}

      </div>
    </>
  ) : (
    <p>No conferences in progress at the moment.</p>
  )}
</section>

{isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={handleCloseModal} className="close-modal-btn">Close</button>

      {selectedReviews && selectedReviews.length > 0 ? (
        selectedReviews.map((reviews, index) => (
          <div
            key={index}
            className={`mt-10 p-6 bg-white rounded-lg shadow-xl m-10 ${index !== 0 ? 'border-t-2 border-gray-500' : ''}`}
          >
            <h3 className="text-lg font-semibold mb-4">Review {index + 1}</h3>

            {/* First Row: Significance, Originality, Presentation, and Recommendation */}
            <div className="flex space-x-6 mb-6">
              <div className="bg-gray-100 p-4 rounded-lg flex-1">
                <span className="font-medium">Significance:</span> 
                {reviews.significance || 'N/A'}/10
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex-1">
                <span className="font-medium">Originality:</span> 
                {reviews.originality || 'N/A'}/10
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex-1">
                <span className="font-medium">Presentation:</span> 
                {reviews.presentation || 'N/A'}/10
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex-1">
                <span className="font-medium">Recommendation:</span> 
                {reviews.Recommendations || 'N/A'}
              </div>
            </div>

            {/* Second Row: Overall Score */}
            <div className="mt-6">
              <p className="text-blue-600 font-bold">
                Overall Score: {reviews.overall || 'N/A'}/10
              </p>
            </div>

            {/* Third Row: Reviewer Comments */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Reviewer Comments:</p>
              <p className="bg-gray-100 p-6 rounded-lg">
                {reviews.Comments || 'No comments available'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available for this paper.</p>
      )}
      
      {/* Organizer Decision Buttons - Centered */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => handleDecision('Accept')}
        >
          Accept Paper
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          onClick={() => handleDecision('Minor Revision')}
        >
          Minor Revision
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => handleDecision('Reject')}
        >
          Reject Paper
        </button>
      </div>
                  
    </div>
    
  </div>
)}
{isEditModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Edit Submission Deadline</h3>
      <input
        type="date"
        value={newDeadline}
        onChange={(e) => setNewDeadline(e.target.value)}
      />
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={async () => {
            try {
              const payload = {
                
                  id: conference[0].id,  // Conference ID
                  Submission_deadline: newDeadline,  // The new submission deadline to be updated
                
              };
              const response = await axios.post('http://localhost:1337/api/conferences/updateSubmissiondate', payload);

            
              if (response.status === 200) {
                const updatedConference = [...conference];
                updatedConference[0].Submission_deadline = newDeadline;
                setConference(updatedConference);
                closeEditModal();
              }
            } catch (error) {
              console.error("Error updating submission deadline:", error.response?.data || error.message);
            }
          }}
        >
          Save
        </button>
        <button onClick={closeEditModal} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{showReviewModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Set Review Deadline</h3>
      <input
        type="date"
        value={reviewDeadline}
        onChange={(e) => setReviewDeadline(e.target.value)}
      />
      <div className="modal-actions">
        <button onClick={handleReviewDeadlineSubmit}>Save</button>
        <button onClick={() => setShowReviewModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}



        </div>
  <Footer />
</>

  );
};

export default OrgConfDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import './ConferenceDetails.css'
import Header from "../Layouts/Header"
import Footer from "./Footer";
import axios from "axios";
import { dashboard_bg } from "../../assets/Images";

const OrgConfDetails = () => {
   const [state, setState] = useState([]);
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

  // New states for review form fields
  const [showReviewFormModal, setShowReviewFormModal] = useState(false);
  const [reviewFormFields, setReviewFormFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState('');
  
  // Default review criteria options
  const defaultReviewCriteria = [
    { id: 'significance', label: 'Significance', enabled: true },
    { id: 'originality', label: 'Originality', enabled: true },
    { id: 'presentation', label: 'Presentation Quality', enabled: true },
    { id: 'technical_quality', label: 'Technical Quality', enabled: false },
    { id: 'clarity', label: 'Clarity', enabled: false },
    { id: 'novelty', label: 'Novelty', enabled: false },
    { id: 'reproducibility', label: 'Reproducibility', enabled: false },
    { id: 'related_work', label: 'Related Work Coverage', enabled: false },
    { id: 'experimental_validation', label: 'Experimental Validation', enabled: false },
    { id: 'writing_quality', label: 'Writing Quality', enabled: false }
  ];
  const [newReviewerInput, setNewReviewerInput] = useState('');
const [newReviewerEmails, setNewReviewerEmails] = useState([]);

const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
const [assignPaper, setAssignPaper] = useState(null);
 const [sortOption, setSortOption] = useState('reviews');
const [selectedExistingReviewer, setSelectedExistingReviewer] = useState('');
const [newReviewerEmail, setNewReviewerEmail] = useState('');
const [existingReviewers, setExistingReviewers] = useState([
  // Replace with dynamic data if needed
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]);
const [selectedExistingReviewers, setSelectedExistingReviewers] = useState([]);

const [reviewers, setReviewers] = useState([]);

useEffect(() => {
  const fetchReviewers = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/reviewers`);
      const reviewerData = response.data.data.map((r) => ({
        id: r.id,
        name: r.firstName + r.lastName,
        email: r.email,
      }));
      setReviewers(reviewerData);
    } catch (error) {
      console.error('Error fetching reviewers:', error);
    }
  };

  fetchReviewers();
}, []);
// Extract IDs of already assigned reviewers


const reviewerOptions = reviewers.map((reviewer) => ({
  value: reviewer.id,
  label: `${reviewer.name} (${reviewer.email})`,
}));
const assignedReviewerIds = assignPaper?.reviewRequestsConfirmed?.map(r => r.id) || [];

// Filter out already assigned reviewers from options
const filteredReviewerOptions = reviewerOptions.filter(
  (option) => !assignedReviewerIds.includes(option.value)
);
const handleReviewerChange = (selectedOptions) => {
  setSelectedExistingReviewers(selectedOptions || []);
};
 let confData 
  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/conferences?filters[id][$eq]=${id}&populate[Papers][populate]=*&populate[Organizer][populate]=*`);
         confData = response.data.data;
        setConference(confData);
        setLoading(false);
        console.log('ddd',confData);
        
        if (confData.length > 0) {
          const papers = confData[0].Papers || []; // No `.data` here
          setSubmittedPapers(papers);
          
          // Initialize review form fields from conference data or use defaults
          const existingFields = [
  ...(confData[0].reviewFormFields || []),
  ...defaultReviewCriteria
];

          setReviewFormFields(existingFields);
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

  // New functions for review form fields management
 const handleReviewFormFieldToggle = (id) => {
  const updatedFields = reviewFormFields.map(field =>
    field.id === id ? { ...field, enabled: !field.enabled } : field
  );
  setReviewFormFields(updatedFields);
};


  const handleAddCustomField = () => {
    if (newCustomField.trim()) {
      const customFieldId = `custom_${Date.now()}`;
      const newField = {
        id: customFieldId,
        label: newCustomField.trim(),
        enabled: true,
        isCustom: true
      };
      setReviewFormFields(prev => [...prev, newField]);
      setNewCustomField('');
    }
  };

  const handleRemoveCustomField = (fieldId) => {
    setReviewFormFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const handleSaveReviewFormFields = async () => {
    try {
        const checkedFields = reviewFormFields.filter(field => field.enabled); // use 'enabled'

    const payload = {
      id: conference[0].id,
      reviewFormFields: checkedFields
    };
      
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:1337/api/organizers/updateReviewFormFields', payload);
      
      if (response.status === 200) {
        const updatedConference = [...conference];
        updatedConference[0].reviewFormFields = reviewFormFields;
        setConference(updatedConference);
        setShowReviewFormModal(false);
      }
    } catch (error) {
      console.error("Error updating review form fields:", error);
    }
  };

  const openEditModal = () => {
    setNewDeadline(conference[0]?.Submission_deadline || '');
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };


  const handleAssignReviewers = (paperId) => {
  const paper = submittedPapers.find((p) => p.id === paperId);
  if (paper) {
    setAssignPaper(paper);
    setIsAssignModalOpen(true); // Open the new modal
  }
};
const handleConfirmAssign = () => {
  const selectedReviewerIds = selectedExistingReviewers.map((r) => r.value);

  if (selectedReviewerIds.length === 0 && newReviewerEmails.length === 0) {
    alert('Please select at least one reviewer or enter at least one email.');
    return;
  }

  const payload = {
    paperId: assignPaper.id,
    reviewers: selectedReviewerIds,
    newReviewerEmails: newReviewerEmails,
  };

  console.log('Payload to send:', payload);

  axios.post('http://localhost:1337/api/organizers/assign-reviewers', payload)
    .then((res) => {
      console.log('Reviewers assigned successfully', res.data);
      setSelectedExistingReviewers([]);
      setNewReviewerEmails([]);
      setNewReviewerInput('');
      setAssignPaper(null);
      setIsAssignModalOpen(false);
    })
    .catch((err) => {
      console.error('Error assigning reviewers:', err);
    });
};

const getSortedPapers = () => {
    return [...submittedPapers].sort((a, b) => {
      if (sortOption === 'reviews') {
        return b.review.length - a.review.length;
      } else {
        return new Date(a.submissionDate) - new Date(b.submissionDate);
      }
    });
  };


  if (loading) return <p>Loading...</p>;

 return (
   <>
     <Header />
     <div className="min-h-screen bg-gray-50">
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : conference.length > 0 ? (
    <>
      {/* Conference Info */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8">
          {conference.map((conf) => (
            <div key={conf.id} className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {conf.Conference_title}
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">{conf.Description}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {conf.Status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {conf.Organizer?.Organizer_FirstName} {conf.Organizer?.Organizer_LastName}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="text-lg font-medium text-gray-900">{conf.Start_date}</p>
                </div>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                      Paper Submission Deadline
                    </h3>
                    <button onClick={openEditModal} className="text-sm font-medium">
                      Edit
                    </button>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{conf.Submission_deadline}</p>
                </div>

                {conf.Review_deadline ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500">Review Deadline</h3>
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{conf.Review_deadline}</p>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add Review Deadline
                    </button>
                  </div>
                )}
               
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Review Form Configuration
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize the review criteria for submitted papers
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {reviewFormFields.filter((f) => f.enabled).length} criteria enabled
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewFormModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Configure Review Form
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Papers Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header and Sort Dropdown */}
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <h3 className="text-lg font-semibold text-gray-900">{submittedPapers.length}  Papers Submitted</h3>
  
  {/* Sleek Sort Control */}
  <div className="relative">
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-100 transition-colors duration-200">
      <span className="text-sm font-medium text-gray-600">Sort by</span>
      <div className="relative">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
        >
          <option value="reviews">Most Reviews</option>
          <option value="submission">Submission Date</option>
        </select>
        <svg className="w-4 h-4 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</div>

        <div className="p-6">
          {submittedPapers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {[...submittedPapers]
                .sort((a, b) => {
                  if (sortOption === 'reviews') {
                    return b.review.length - a.review.length;
                  } else {
                    return new Date(a.submissionDate) - new Date(b.submissionDate);
                  }
                })
                .map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    {/* Title and ID Centered */}
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        <strong>Paper title:</strong> {paper.Paper_Title}
                      </h4>
                      <p className="text-sm text-gray-500">ID: {paper.id || 'N/A'}</p>
                    </div>

                    {/* Reviewer Badges Centered */}
                    <div className="flex justify-center gap-4 mb-4">
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {paper.reviewRequestsConfirmed.length} Assigned reviewers
                      </span>
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {paper.review.length} Reviews submitted
                      </span>
                    </div>

                    {/* Author and Submission Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Author:</strong> {paper.Author || 'N/A'}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{' '}
                        {new Date(paper.submissionDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Abstract */}
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                      <strong>Abstract:</strong> {paper.Abstract}
                    </p>

                    {/* Buttons Row */}
                    <div className="mt-5 flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => handleAssignReviewers(paper.id)}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Assign Reviewer to this paper
                      </button>

                      {paper.finalDecisionByOrganizer ? (
                        <span
                          onClick={() => handleShowReviews(paper.id)}
                          className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium bg-purple-100 text-purple-800 cursor-pointer"
                        >
                          Decision Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleShowReviews(paper.id)}
                          disabled={paper.review.length === 0}
                          className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            paper.review.length === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          View Reviews
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No papers submitted</h3>
              <p className="mt-1 text-sm text-gray-500">
                Papers submitted to this conference will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No conference found</h3>
      <p className="mt-1 text-sm text-gray-500">
        There are no conferences available at the moment.
      </p>
    </div>
  )}
</section>


       {/* Existing modals remain unchanged */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
             {/* Header */}
             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
               <div className="flex justify-between items-center">
                 <div>
                   <h2 className="text-2xl font-bold">Paper Reviews</h2>
                   <p className="text-indigo-100 mt-1">
                     Review details for: {selectedPaper?.Paper_Title}
                   </p>
                 </div>
                 <button
                   onClick={handleCloseModal}
                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                 >
                   <svg
                     className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="p-6 overflow-y-auto max-h-[calc(95vh-250px)]">
               {selectedReviews && selectedReviews.length > 0 ? (
                 <div className="space-y-8">
                   {selectedReviews.map((reviews, index) => (
                     <div
                       key={index}
                       className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm"
                     >
                       <div className="flex items-center justify-between mb-6">
                         <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                           <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                             {index + 1}
                           </div>
                           Review {index + 1}
                         </h3>
                         {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Overall: {reviews.overall || 'N/A'}/10
                          </div> */}
                       </div>

                       {/* Metrics Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                         {conference[0].reviewFormFields &&
                         conference[0].reviewFormFields.length > 0 ? (
                           conference[0].reviewFormFields.map(
                             (field, index) => {
                               // Assign colors based on index or field ID (optional logic to customize)
                               const colorMap = [
                                 "blue",
                                 "green",
                                 "orange",
                                 "purple",
                                 "red",
                                 "teal",
                               ];
                               const color = colorMap[index % colorMap.length];
                               return (
                                 <div
                                   key={field.id}
                                   className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                 >
                                   <div className="flex items-center gap-2 mb-2">
                                     <div
                                       className={`w-3 h-3 bg-${color}-500 rounded-full`}
                                     ></div>
                                     <span className="font-semibold text-gray-700">
                                       {field.label}
                                     </span>
                                   </div>
                                   <div
                                     className={`text-2xl font-bold text-${color}-600`}
                                   >
                                     {reviews[field.id] || "N/A"}
                                     {field.id !== "Recommendations" && (
                                       <span className="text-sm text-gray-500">
                                         /10
                                       </span>
                                     )}
                                   </div>
                                 </div>
                               );
                             }
                           )
                         ) : (
                           <>
                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                 <span className="font-semibold text-gray-700">
                                   Significance
                                 </span>
                               </div>
                               <div className="text-2xl font-bold text-blue-600">
                                 {reviews.significance || "N/A"}
                                 <span className="text-sm text-gray-500">
                                   /10
                                 </span>
                               </div>
                             </div>

                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                 <span className="font-semibold text-gray-700">
                                   Originality
                                 </span>
                               </div>
                               <div className="text-2xl font-bold text-green-600">
                                 {reviews.originality || "N/A"}
                                 <span className="text-sm text-gray-500">
                                   /10
                                 </span>
                               </div>
                             </div>

                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                 <span className="font-semibold text-gray-700">
                                   Presentation
                                 </span>
                               </div>
                               <div className="text-2xl font-bold text-orange-600">
                                 {reviews.presentation || "N/A"}
                                 <span className="text-sm text-gray-500">
                                   /10
                                 </span>
                               </div>
                             </div>

                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                               <div className="flex items-center gap-2 mb-2">
                                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                 <span className="font-semibold text-gray-700">
                                   Recommendation
                                 </span>
                               </div>
                               <div className="text-lg font-bold text-purple-600">
                                 {reviews.Recommendations || "N/A"}
                               </div>
                             </div>
                           </>
                         )}
                       </div>

                       {/* Comments Section */}
                       <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                         <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                           <svg
                             className="w-5 h-5 text-gray-600"
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24"
                           >
                             <path
                               strokeLinecap="round"
                               strokeLinejoin="round"
                               strokeWidth={2}
                               d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-2.9-.471L8 21l1.529-1.529A8.956 8.956 0 0121 12z"
                             />
                           </svg>
                           Reviewer Comments
                         </h4>
                         <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                           <p className="text-gray-700 leading-relaxed">
                             {reviews.Comments || "No comments available"}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-12">
                   <svg
                     className="w-16 h-16 text-gray-400 mx-auto mb-4"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                     />
                   </svg>
                   <p className="text-gray-500 text-lg">
                     No reviews available for this paper.
                   </p>
                 </div>
               )}
             </div>

             {/* Decision Buttons Footer */}
             <div className="bg-gray-50 p-6 border-t">
               <div className="flex justify-center space-x-4">
                 <button
                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                   onClick={() => handleDecision("Accept")}
                 >
                   <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M5 13l4 4L19 7"
                     />
                   </svg>
                   Accept Paper
                 </button>
                 {/* <button
                   className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                   onClick={() => handleDecision("Minor Revision")}
                 >
                   <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                     />
                   </svg>
                   Minor Revision
                 </button> */}
                 <button
                   className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                   onClick={() => handleDecision("Reject")}
                 >
                   <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                   </svg>
                   Reject Paper
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {isEditModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
             {/* Header */}
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
               <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-xl font-bold">
                     Edit Submission Deadline
                   </h3>
                   <p className="text-blue-100 text-sm mt-1">
                     Update the paper submission deadline
                   </p>
                 </div>
                 <button
                   onClick={closeEditModal}
                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="p-6">
               <div className="mb-6">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   New Submission Deadline
                 </label>
                 <input
                   type="date"
                   value={newDeadline}
                   onChange={(e) => setNewDeadline(e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                 />
               </div>

               <div className="flex gap-3">
                 <button
                   onClick={async () => {
                     try {
                       const payload = {
                         id: conference[0].id,
                         Submission_deadline: newDeadline,
                       };
                       const response = await axios.post(
                         "http://localhost:1337/api/conferences/updateSubmissiondate",
                         payload
                       );

                       if (response.status === 200) {
                         const updatedConference = [...conference];
                         updatedConference[0].Submission_deadline = newDeadline;
                         setConference(updatedConference);
                         closeEditModal();
                       }
                     } catch (error) {
                       console.error(
                         "Error updating submission deadline:",
                         error.response?.data || error.message
                       );
                     }
                   }}
                   className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                 >
                   Save Changes
                 </button>
                 <button
                   onClick={closeEditModal}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {showReviewModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
             {/* Header */}
             <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
               <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-xl font-bold">Set Review Deadline</h3>
                   <p className="text-purple-100 text-sm mt-1">
                     Configure the deadline for paper reviews
                   </p>
                 </div>
                 <button
                   onClick={() => setShowReviewModal(false)}
                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="p-6">
               <div className="mb-6">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Review Deadline Date
                 </label>
                 <input
                   type="date"
                   value={reviewDeadline}
                   onChange={(e) => setReviewDeadline(e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                 />
               </div>

               <div className="flex gap-3">
                 <button
                   onClick={handleReviewDeadlineSubmit}
                   className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                 >
                   Save Deadline
                 </button>
                 <button
                   onClick={() => setShowReviewModal(false)}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* New Review Form Fields Modal */}
       {showReviewFormModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
             {/* Header */}
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
               <div className="flex justify-between items-center">
                 <div>
                   <h2 className="text-white text-2xl font-bold">
                     Configure Review Form
                   </h2>
                   <p className="text-blue-100 mt-1">
                     Customize the criteria reviewers will use to evaluate
                     papers
                   </p>
                 </div>
                 <button
                   onClick={() => setShowReviewFormModal(false)}
                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                 >
                   <svg
                     className="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
               {/* Standard Criteria Section */}
               <div className="mb-8">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                   <svg
                     className="w-5 h-5 text-blue-600"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                     />
                   </svg>
                   Standard Review Criteria
                 </h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {reviewFormFields
                     .filter((field) => !field.isCustom)
                     .map((field) => (
                       <label
                         key={field.id}
                         className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                       >
                         <input
                           type="checkbox"
                           checked={field.enabled}
                           onChange={() =>
                             handleReviewFormFieldToggle(field.id)
                           }
                           className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                         />
                         <span className="text-gray-700 font-medium">
                           {field.label}
                         </span>
                       </label>
                     ))}
                 </div>
               </div>

               {/* Custom Criteria Section */}
               <div className="mb-6">
                 {/* <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Custom Review Criteria
                  </h3> */}

                 {/* Add Custom Field Input */}
                 {/* <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newCustomField}
                      onChange={(e) => setNewCustomField(e.target.value)}
                      placeholder="Enter custom criteria name..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomField()}
                    />
                    <button
                      onClick={handleAddCustomField}
                      disabled={!newCustomField.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl transition-colors font-medium disabled:cursor-not-allowed"
                    >
                      Add Criteria
                    </button>
                  </div> */}

                 {/* Custom Fields List */}
                 {/* {reviewFormFields.filter(field => field.isCustom).length > 0 && (
                    <div className="space-y-3">
                      {reviewFormFields.filter(field => field.isCustom).map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.enabled}
                              onChange={() => handleReviewFormFieldToggle(field.id)}
                              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-gray-700 font-medium">{field.label}</span>
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Custom</span>
                          </label>
                          <button
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )} */}
               </div>

               {/* Summary Section */}
               <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                 <h4 className="font-semibold text-blue-800 mb-2">
                   Configuration Summary
                 </h4>
                 <p className="text-blue-700 text-sm">
                   <span className="font-medium">
                     {reviewFormFields.filter((f) => f.enabled).length}
                   </span>{" "}
                   criteria will be included in the review form. Reviewers will
                   evaluate papers based on these selected criteria.
                 </p>
               </div>
             </div>

             {/* Footer */}
             <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t">
               <button
                 onClick={() => setShowReviewFormModal(false)}
                 className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSaveReviewFormFields}
                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
               >
                 Save Configuration
               </button>
             </div>
           </div>
         </div>
       )}
{/* assign reviewer to paper modal */}
       {isAssignModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Assign Reviewer</h2>
            <p className="text-indigo-100 mt-1">Paper: {assignPaper?.Paper_Title}</p>
          </div>
          <button
            onClick={() => setIsAssignModalOpen(false)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p><strong>Paper ID:</strong> {assignPaper?.id}</p>
        <p><strong>Author:</strong> {assignPaper?.Author}</p> {/* Adjust according to your field name */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Already Assigned Reviewers
    </label>
    {assignPaper?.reviewRequestsConfirmed?.length > 0 ? (
      <ul className="space-y-1 text-sm text-gray-800 list-disc list-inside">
        {assignPaper.reviewRequestsConfirmed.map((rev, index) => (
          <li key={index}>
            {rev.firstName} {rev.lastName} — <span className="text-gray-500">{rev.email}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 italic">No reviewers assigned yet.</p>
    )}
  </div>
     <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Reviewers
  </label>
  <Select
    isMulti
    options={filteredReviewerOptions}
    value={selectedExistingReviewers}
    onChange={handleReviewerChange}
    className="text-sm"
    classNamePrefix="react-select"
    placeholder="Choose reviewers..."
  />
</div>


        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add New Reviewer (Email)
          </label>
          <input
  type="email"
  value={newReviewerInput}
  onChange={(e) => setNewReviewerInput(e.target.value)}
  onKeyDown={(e) => {
    if ((e.key === 'Enter' || e.key === ',') && newReviewerInput.trim()) {
      e.preventDefault();
      setNewReviewerEmails((prev) => [...prev, newReviewerInput.trim()]);
      setNewReviewerInput('');
    }
  }}
  placeholder="Type email and press Enter or comma"
  className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm"
/>

        </div>
        <div className="flex flex-wrap gap-2 mt-2">
  {newReviewerEmails.map((email, index) => (
    <span
      key={index}
      className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
    >
      {email}
      <button
        type="button"
        onClick={() =>
          setNewReviewerEmails((prev) =>
            prev.filter((_, i) => i !== index)
          )
        }
        className="text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>
    </span>
  ))}
</div>


        <div className="mt-6 text-right">
          <button
            onClick={handleConfirmAssign}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Confirm Assign
          </button>
        </div>
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
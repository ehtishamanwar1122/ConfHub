import React, { useEffect, useState } from 'react';
import Layout from './Layouts/Layout';
import { useNavigate } from "react-router-dom";
import AssignSubOrganizer from './AssignSubOrganizer';
import axios from 'axios';

const Tab = ({ active, onClick, children }) => (
    <button
        className={`py-2 px-4 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
        onClick={onClick}
    >
        {children}
    </button>
);

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inProgress');
    const [conferences, setConferences] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedConferenceId, setSelectedConferenceId] = useState(null);
    const [paperReviews, setPaperReviews] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const userDetails = JSON.parse(localStorage.getItem("userDetails"));
                const organizerId = userDetails?.organizerId?.id;
                const subOrganizerRoles = userDetails?.SubOrganizerRole || [];
                const userId = userDetails?.id;
                
                if (subOrganizerRoles.length > 0) {
                    const response = await axios.get(`http://localhost:1337/api/conferences?filters[requestStatus][$eq]=approved&filters[AssignedSubOrganizer][id][$eq]=${userId}&populate=*`);
                    setConferences(response.data.data);
                    return;
                }
                
                if (!organizerId) {
                    console.error('Organizer ID not found in local storage');
                    return;
                }

                const response = await axios.get(`http://localhost:1337/api/conferences?filters[requestStatus][$eq]=approved&filters[Organizer][$eq]=${organizerId}`);
                setConferences(response.data.data);
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();
    }, []);

    const filteredConferences = conferences.filter(conference =>
        activeTab === 'inProgress' ? conference.Status === 'inProgress' : conference.Status === 'completed'
    );

    const handleCardClick = (conferenceId) => {
        navigate(`/orgConferenceDetails/${conferenceId}`);
    };

    const handleAssignSubOrganizer = (conferenceId) => {
        setSelectedConferenceId(conferenceId);
        setShowAssignModal(true);
    };
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:1337/api/paper-reviews'); // Update with actual endpoint
                setPaperReviews(response.data || []);
            } catch (error) {
                console.error('Error fetching paper reviews:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab]);
    
    return (
        <Layout>
            <div className="p-6">
                <div className="mb-6 flex gap-4">
                    <Tab active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')}>
                        In Progress Conferences
                    </Tab>
                    <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        Completed Conferences
                    </Tab>
                    <Tab active={activeTab === 'assignSubOrganizer'} onClick={() => setActiveTab('assignSubOrganizer')}>
                        Assign Sub-Organizers
                    </Tab>
                    <Tab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
                        Reviews
                    </Tab>

                </div>

                {activeTab === 'assignSubOrganizer' ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6 text-blue-600">Assign Sub-Organizers</h2>
                        {conferences.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Conference Title</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conferences.map((conference, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Conference_title}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Description}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Status}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <button
                                                        onClick={() => handleAssignSubOrganizer(conference.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                                    >
                                                        Assign Sub-Organizer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No conferences found for assigning sub-organizers.</p>
                        )}
                    </div>
                ) : (
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                          <h2 className="text-xl font-bold  text-blue-600">Conference Details</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Conference Title</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Submission Deadline</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Review Deadline</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredConferences.length > 0 ? (
                                        filteredConferences.map((conference, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Conference_title}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Description}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Submission_deadline}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Review_deadline}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Status}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Start_date}</td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{conference.Conference_location}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <button
                                                        onClick={() => handleCardClick(conference.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-4 text-center text-gray-600">
                                                No conferences found for this tab.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {showAssignModal && selectedConferenceId && (
                    <AssignSubOrganizer
                        conferenceId={selectedConferenceId}
                        onClose={() => setShowAssignModal(false)}
                    />
                )} 
                {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Paper Reviews</h2>

          {loading ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : (
            <>
              {paperReviews.length === 0 ? (
                <p className="text-gray-600">No reviews available.</p>
              ) : (
                paperReviews.map((paper, idx) => (
                  <div key={idx} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{paper.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border-collapse mb-2">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Reviewer</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Review Summary</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Recommendation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paper.reviews.map((review, rIdx) => (
                            <tr key={rIdx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-700">{review.reviewer}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">{review.summary}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">{review.recommendation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Organizer Decision Buttons */}
                    <div className="mt-2">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600">
                        Accept Paper
                      </button>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600">
                        Minor Revision
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Reject Paper
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}

            </div>
        </Layout>
    );
};

export default OrganizerDashboard;
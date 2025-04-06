import React, { useEffect, useState } from 'react';
import Layout from '../Layouts/Layout';
import { useNavigate, useParams } from 'react-router-dom';

const SubOrganizerDashboard = () => {
    const { conferenceId } = useParams();
    const navigate = useNavigate();

    const [conferenceDetails, setConferenceDetails] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [submittedPapers, setSubmittedPapers] = useState([]);
    const [selectedPaperId, setSelectedPaperId] = useState(null);
    const [showPaperModal, setShowPaperModal] = useState(false);
    const [reviewRequests, setReviewRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('conferenceDetails');
    const [selectedReviewer, setSelectedReviewer] = useState(null);

    const dummyConferenceData = {
        id: 1,
        Conference_title: 'Tech Innovations 2025',
        Description: 'A conference focusing on the latest innovations in technology.',
        Submission_deadline: '2025-05-01',
        Review_deadline: '2025-06-01',
        Status: 'inProgress',
        Start_date: '2025-07-10',
        Conference_location: 'New York, USA'
    };

    const dummyTasks = [
        { id: 1, taskName: 'Review Paper Submissions', deadline: '2025-05-10', status: 'Pending' },
        { id: 2, taskName: 'Assign Reviewers', deadline: '2025-06-05', status: 'In Progress' },
        { id: 3, taskName: 'Prepare Session Schedules', deadline: '2025-07-01', status: 'Completed' }
    ];

    const dummyPapers = [
        {
            id: 101,
            title: 'AI in Healthcare',
            author: 'John Doe',
            abstract: 'This paper explores the role of AI in modern healthcare...',
            reviewers: [],
            reviews: []
        },
        {
            id: 102,
            title: 'Blockchain for Education',
            author: 'Alice Smith',
            abstract: 'This paper investigates how blockchain technology...',
            reviewers: ['Reviewer 1'],
            reviews: [{ reviewer: 'Reviewer 1', comment: 'Well written!', score: 8 }]
        }
    ];

    const dummyReviewers = ['Reviewer 1', 'Reviewer 2', 'Reviewer 3'];

    const dummyReviewRequests = [
        { id: 1, paperTitle: 'AI in Healthcare', requestedBy: 'Reviewer 2', status: 'Pending' },
        { id: 2, paperTitle: 'Blockchain for Education', requestedBy: 'Reviewer 3', status: 'Approved' }
    ];

    useEffect(() => {
        setConferenceDetails(dummyConferenceData);
        setTasks(dummyTasks);
        setSubmittedPapers(dummyPapers);
        setReviewRequests(dummyReviewRequests);
    }, [conferenceId]);

    const handlePaperClick = (paperId) => {
        setSelectedPaperId(paperId);
        setShowPaperModal(true);
    };

    const assignReviewer = (paperId, reviewer) => {
        setSubmittedPapers(prev =>
            prev.map(paper =>
                paper.id === paperId
                    ? {
                          ...paper,
                          reviewers: paper.reviewers.includes(reviewer)
                              ? paper.reviewers
                              : [...paper.reviewers, reviewer]
                      }
                    : paper
            )
        );
        alert(`Reviewer "${reviewer}" assigned to paper ${paperId}`);
    };

    const handleRequestApproval = (requestId) => {
        setReviewRequests(prev =>
            prev.map(req =>
                req.id === requestId ? { ...req, status: 'Approved' } : req
            )
        );
    };

    const handleRequestReviewer = (paperId) => {
        if (selectedReviewer) {
            setReviewRequests(prev => [
                ...prev,
                { id: prev.length + 1, paperTitle: `Paper ${paperId}`, requestedBy: selectedReviewer, status: 'Pending' }
            ]);
            alert(`Reviewer "${selectedReviewer}" has been requested to review Paper ${paperId}`);
        } else {
            alert('Please select a reviewer');
        }
    };

    return (
        <Layout>
            <div className="p-5">
                {/* Tab Navigation */}
                <div className="mb-5">
                    <ul className="flex border-b-2">
                        <li
                            className={`cursor-pointer px-4 py-2 ${activeTab === 'conferenceDetails' ? 'border-b-4 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('conferenceDetails')}
                        >
                            Conference Details
                        </li>
                        <li
                            className={`cursor-pointer px-4 py-2 ${activeTab === 'submittedPapers' ? 'border-b-4 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('submittedPapers')}
                        >
                            Submitted Papers
                        </li>
                        <li
                            className={`cursor-pointer px-4 py-2 ${activeTab === 'reviewRequests' ? 'border-b-4 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('reviewRequests')}
                        >
                            Manage Review Requests
                        </li>
                        <li
                            className={`cursor-pointer px-4 py-2 ${activeTab === 'requestReviewer' ? 'border-b-4 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('requestReviewer')}
                        >
                            Request Reviewer
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                {activeTab === 'conferenceDetails' && (
                    <div className="mb-8">
                        {conferenceDetails && (
                            <>
                                <h2 className="text-2xl font-bold">{conferenceDetails.Conference_title}</h2>
                                <p>{conferenceDetails.Description}</p>
                                <p><strong>Status:</strong> {conferenceDetails.Status}</p>
                                <p><strong>Start Date:</strong> {conferenceDetails.Start_date}</p>
                                <p><strong>Location:</strong> {conferenceDetails.Conference_location}</p>
                                <p><strong>Submission Deadline:</strong> {conferenceDetails.Submission_deadline}</p>
                                <p><strong>Review Deadline:</strong> {conferenceDetails.Review_deadline}</p>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'submittedPapers' && (
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-center mb-4">Submitted Papers</h3>
                        {submittedPapers.length > 0 ? (
                            submittedPapers.map(paper => (
                                <div
                                    key={paper.id}
                                    className="bg-gray-50 border rounded-lg p-4 mb-4 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handlePaperClick(paper.id)}
                                >
                                    <h4 className="text-lg text-center font-semibold">{paper.title}</h4>
                                    <p><strong>Author:</strong> {paper.author}</p>
                                    <p><strong>Assigned Reviewers:</strong> {paper.reviewers.join(', ') || 'None'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No papers submitted yet.</p>
                        )}
                    </div>
                )}

                {activeTab === 'reviewRequests' && (
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-center mb-4">Manage Review Requests</h3>
                        {reviewRequests.length > 0 ? (
                            reviewRequests.map(request => (
                                <div key={request.id} className="border text-center rounded-md p-4 mb-3 bg-white shadow">
                                    <p><strong>Paper:</strong> {request.paperTitle}</p>
                                    <p><strong>Requested By:</strong> {request.requestedBy}</p>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    {request.status === 'Pending' && (
                                        <button
                                            className="mt-2  px-4 py-1 bg-blue-500 text-white rounded"
                                            onClick={() => handleRequestApproval(request.id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No review requests available.</p>
                        )}
                    </div>
                )}

                {activeTab === 'requestReviewer' && (
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-center mb-4">Request a Reviewer</h3>
                        <p>Select a reviewer to request for a paper review:</p>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            onChange={(e) => setSelectedReviewer(e.target.value)}
                        >
                            <option value="">Select a Reviewer</option>
                            {dummyReviewers.map((reviewer, index) => (
                                <option key={index} value={reviewer}>
                                    {reviewer}
                                </option>
                            ))}
                        </select>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() => handleRequestReviewer(selectedPaperId)}
                        >
                            Send Request
                        </button>
                    </div>
                )}

                {/* Paper Modal */}
                {showPaperModal && selectedPaperId && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl">
                            <h4 className="text-xl font-bold mb-2">Paper Details</h4>
                            {(() => {
                                const paper = submittedPapers.find(p => p.id === selectedPaperId);
                                return paper && (
                                    <>
                                        <p><strong>Title:</strong> {paper.title}</p>
                                        <p><strong>Author:</strong> {paper.author}</p>
                                        <p className="mb-2"><strong>Abstract:</strong> {paper.abstract}</p>

                                        <div className="mb-4">
                                            <strong>Assign Reviewer:</strong>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {dummyReviewers.map(reviewer => {
                                                    const alreadyAssigned = paper.reviewers.includes(reviewer);
                                                    return (
                                                        <button
                                                            key={reviewer}
                                                            className={`px-3 py-1 rounded transition ${
                                                                alreadyAssigned
                                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                                            }`}
                                                            disabled={alreadyAssigned}
                                                            onClick={() => assignReviewer(paper.id, reviewer)}
                                                        >
                                                            {reviewer}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <strong>Reviews:</strong>
                                            {paper.reviews.length > 0 ? (
                                                paper.reviews.map((rev, i) => (
                                                    <div key={i} className="border p-2 my-1 rounded">
                                                        <p><strong>Reviewer:</strong> {rev.reviewer}</p>
                                                        <p><strong>Comment:</strong> {rev.comment}</p>
                                                        <p><strong>Score:</strong> {rev.score}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No reviews submitted yet.</p>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                            <button
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={() => setShowPaperModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SubOrganizerDashboard;

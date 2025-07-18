import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layouts/Layout';
import { useNavigate } from "react-router-dom";

const Tab = ({ active, onClick, children }) => (
    <button
        className={`py-2 px-4 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
        onClick={onClick}
    >
        {children}
    </button>
);

const AuthorDashboard = () => {
    const navigate = useNavigate();
    const [recentConferences, setRecentConferences] = useState([]);
    const [submittedPapers, setSubmittedPapers] = useState([]);
    const [activeTab, setActiveTab] = useState('conferences');
    const [loading, setLoading] = useState(true);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const authorname = userDetails?.username;
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const authorId = userDetails?.authorId?.id;

        const fetchAuthorData = async () => {
            try {
                const conferenceResponse = await axios.get(
                    'http://localhost:1337/api/conferences?filters[requestStatus][$eq]=approved&populate[Papers][populate]=submitted_by'
                );
                console.log('recentt',conferenceResponse.data.data);
                
                 const allConferences = conferenceResponse.data.data;

         const filteredConferences = allConferences.filter(conference => {
            const papers = conference.Papers || [];

            // Check if any paper's submitted_by array includes authorId
            const hasSubmittedByCurrentAuthor = papers.some(paper => {
                const submittedAuthors = Array.isArray(paper.submitted_by) ? paper.submitted_by : [];
                return submittedAuthors.some(author => author?.id === authorId);
            });

            // Include conference ONLY if no papers are submitted by this author
            return !hasSubmittedByCurrentAuthor;
        });

        setRecentConferences(filteredConferences);
        console.log('Filtered Recent Conferences', filteredConferences);

                const papersResponse = await axios.get(
                    `http://localhost:1337/api/papers?filters[submitted_by][id][$eq]=${authorId}&populate=*`
                );
                setSubmittedPapers(papersResponse.data?.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching author data:', error);
                setLoading(false);
            }
        };

        fetchAuthorData();
    }, []);

    const handleSubmitPaper = (conferenceId) => {
        navigate(`/SubmitPaper/${conferenceId}`);
    };

    const handleShowReview = (paperId) => {
        navigate(`/paper-review/${paperId}`);
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome <strong>{authorname}</strong> in Author Dashboard</h1>

                {/* Tab Buttons */}
                <div className="mb-6 flex gap-4">
                    <Tab active={activeTab === 'conferences'} onClick={() => setActiveTab('conferences')}>
                        Ongoing Conferences
                    </Tab>
                    <Tab active={activeTab === 'papers'} onClick={() => setActiveTab('papers')}>
                        Submitted Papers
                    </Tab>
                    {/* <Tab active={activeTab === 'decisions'} onClick={() => setActiveTab('decisions')}>
                        Paper Reviews
                    </Tab> */}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'conferences' && (
                        <div>
                            {loading ? (
                                <p className="text-gray-600">Loading conferences...</p>
                            ) : recentConferences.length === 0 ? (
                                <p className="text-gray-600">No conferences available.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Conference Title</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                                                {/* <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Location</th> */}
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Submission Deadline</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentConferences.map((conference) => (
                                                <tr key={conference.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-700">{conference.Conference_title}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{conference.Description}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{conference.Start_date}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{conference.Conference_location}</td>
                                                    {/* <td className="py-3 px-4 text-sm text-gray-700">{conference.Submission_deadline}</td> */}
                                                    <td className="py-3 px-4 text-sm">
                                                        <button
                                                            onClick={() => handleSubmitPaper(conference.id)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                                        >
                                                            Submit Paper
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'papers' && (
                        <div>
                            {loading ? (
                                <p className="text-gray-600">Loading papers...</p>
                            ) : submittedPapers.length === 0 ? (
                                <p className="text-gray-600">No papers submitted yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Paper Title</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Conference</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Review Deadline</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedPapers.map((paper) => (
                                                <tr key={paper.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.Paper_Title}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.conference?.Conference_title || 'N/A'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.conference?.Review_deadline || 'N/A'}</td>
                                                    <td className="py-3 px-4 text-sm">
                                                    {paper.finalDecisionByOrganizer ? (
  <button
    onClick={() => handleShowReview(paper.id)}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
  >
    View Review
  </button>
) : (
  <button
    disabled
    className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
  >
    Organizer Decision pending
  </button>
)}

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'decisions' && (
                        <div>
                            {loading ? (
                                <p className="text-gray-600">Loading decisions...</p>
                            ) : submittedPapers.length === 0 ? (
                                <p className="text-gray-600">No decisions available yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Paper Title</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Conference</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Organizer Decision</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedPapers.map((paper) => (
                                                <tr key={paper.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.Paper_Title}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.conference?.Conference_title || 'N/A'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.organizerDecision || 'Pending'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{paper.organizerComment || 'No comments'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AuthorDashboard;

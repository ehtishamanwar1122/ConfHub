import React, { useEffect, useState } from 'react';
import Layout from './Layouts/Layout';
import { useNavigate } from "react-router-dom";
import AssignSubOrganizer from './AssignSubOrganizer';
import axios from 'axios';
import { FaClipboardList, FaCheckCircle, FaUserPlus, FaEye } from 'react-icons/fa';
import { MdPendingActions, MdDoneAll, MdAssignment } from 'react-icons/md';

const Tab = ({ active, onClick, icon: Icon, children }) => (
    <button
        className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-200 ${
            active ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={onClick}
    >
        {Icon && <Icon size={18} />}
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

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const organizerName = userDetails.username;

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
                const response = await axios.get('http://localhost:1337/api/paper-reviews');
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
            <h4 className="text-3xl font-semibold text-blue-700 text-center my-6 font-sans">
                Welcome <strong>{organizerName}</strong> to your dashboard
            </h4>
            <div className="p-6">
                <div className="mb-6 flex gap-3 flex-wrap">
                    <Tab active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')} icon={MdPendingActions}>
                        In Progress
                    </Tab>
                    <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} icon={MdDoneAll}>
                        Completed
                    </Tab>
                    <Tab active={activeTab === 'assignSubOrganizer'} onClick={() => setActiveTab('assignSubOrganizer')} icon={FaUserPlus}>
                        Assign Sub-Organizers
                    </Tab>
                    {/* <Tab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={FaClipboardList}>
                        Reviews
                    </Tab> */}
                </div>

                {activeTab === 'assignSubOrganizer' ? (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center gap-2">
                            <FaUserPlus /> Assign Sub-Organizers
                        </h2>
                        {conferences.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Conference Title</th>
                                            <th className="py-3 px-4 text-left">Description</th>
                                            <th className="py-3 px-4 text-left">Status</th>
                                            <th className="py-3 px-4 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conferences.map((conference, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{conference.Conference_title}</td>
                                                <td className="py-3 px-4">{conference.Description}</td>
                                                <td className="py-3 px-4">{conference.Status}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleAssignSubOrganizer(conference.id)}
                                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                    >
                                                        <MdAssignment size={18} /> Assign
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
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                            <FaClipboardList /> Conference Details
                        </h2>
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Title</th>
                                        <th className="py-3 px-4 text-left">Description</th>
                                        <th className="py-3 px-4 text-left">Submission Deadline</th>
                                        <th className="py-3 px-4 text-left">Review Deadline</th>
                                        <th className="py-3 px-4 text-left">Status</th>
                                        <th className="py-3 px-4 text-left">Start Date</th>
                                        <th className="py-3 px-4 text-left">Location</th>
                                        <th className="py-3 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredConferences.length > 0 ? (
                                        filteredConferences.map((conference, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{conference.Conference_title}</td>
                                                <td className="py-3 px-4">{conference.Description}</td>
                                                <td className="py-3 px-4">{conference.Submission_deadline}</td>
                                                <td className="py-3 px-4">{conference.Review_deadline}</td>
                                                <td className="py-3 px-4">{conference.Status}</td>
                                                <td className="py-3 px-4">{conference.Start_date}</td>
                                                <td className="py-3 px-4">{conference.Conference_location}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleCardClick(conference.id)}
                                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                    >
                                                        <FaEye /> View
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
            </div>
        </Layout>
    );
};

export default OrganizerDashboard;

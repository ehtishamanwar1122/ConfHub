import React, { useEffect, useState } from 'react';
import Layout from './Layouts/Layout';
import { useNavigate } from "react-router-dom";
import AssignSubOrganizer from './AssignSubOrganizer'; // Import the AssignSubOrganizer component

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inProgress');
    const [conferences, setConferences] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false); // State for showing the modal
    const [selectedConferenceId, setSelectedConferenceId] = useState(null); // Store selected conference ID for assigning sub-organizer

    // Dummy Data for Conferences
    const dummyConferences = [
        {
            id: 1,
            Conference_title: 'Tech Innovations 2025',
            Description: 'A conference focusing on the latest innovations in technology.',
            Submission_deadline: '2025-05-01',
            Review_deadline: '2025-06-01',
            Status: 'inProgress',
            Start_date: '2025-07-10',
            Conference_location: 'New York, USA'
        },
        {
            id: 2,
            Conference_title: 'Health Tech Summit',
            Description: 'Discussing the future of healthcare technologies and digital health.',
            Submission_deadline: '2025-06-15',
            Review_deadline: '2025-07-10',
            Status: 'completed',
            Start_date: '2025-08-20',
            Conference_location: 'Berlin, Germany'
        },
        {
            id: 3,
            Conference_title: 'AI & Machine Learning Conference',
            Description: 'A deep dive into AI and its applications across industries.',
            Submission_deadline: '2025-07-01',
            Review_deadline: '2025-08-01',
            Status: 'inProgress',
            Start_date: '2025-09-15',
            Conference_location: 'San Francisco, USA'
        },
    ];

    // Set dummy data into state
    useEffect(() => {
        setConferences(dummyConferences);
    }, []);

    // Filter conferences based on active tab
    const filteredConferences = conferences.filter(conference =>
        activeTab === 'inProgress' ? conference.Status === 'inProgress' : conference.Status === 'completed'
    );

    const handleCardClick = (conferenceId) => {
        navigate(`/orgConferenceDetails/${conferenceId}`);
    };

    const handleAssignSubOrganizer = (conferenceId) => {
        setSelectedConferenceId(conferenceId); // Set the selected conference ID
        setShowAssignModal(true); // Show the modal
    };

    return (
        <Layout>
            <div className="p-5">
                <div className="flex mb-20 py-6 text-lg bg-gray-50 p-4 rounded-lg">
                        <button
                            className={`flex-grow py-2 rounded-lg ${activeTab === 'inProgress' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800'}`}
                            onClick={() => setActiveTab('inProgress')}
                        >
                            In Progress Conferences
                        </button>
                        <button
                            className={`flex-grow py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800'}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed Conferences
                        </button>
                        <button
                            className={`flex-grow py-2 rounded-md ${activeTab === 'assignSubOrganizer' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-800'}`}
                            onClick={() => setActiveTab('assignSubOrganizer')}
                        >
                            Assign Sub-Organizers
                        </button>
                    </div>


                {activeTab === 'assignSubOrganizer' ? (
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-4">Assign Sub-Organizers</h2>
                        {conferences.length > 0 ? (
                            conferences.map((conference, index) => {
                                const {
                                    id,
                                    Conference_title,
                                    Description,
                                    Status,
                                } = conference;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-xl p-6 mb-6 cursor-pointer transition-all transform hover:translate-y-[-10px] hover:shadow-2xl"
                                    >
                                        <h3 className="text-green-600 text-xl font-bold">{Conference_title}</h3>
                                        <p>{Description}</p>
                                        <p><strong>Status:</strong> {Status}</p>
                                        <button
                                            onClick={() => handleAssignSubOrganizer(id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 mx-auto block"
                                        >
                                            Assign Sub-Organizer
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No conferences found for assigning sub-organizers.</p>
                        )}
                    </div>
                ) : (
                    <div>
                        {/* Existing code for showing conferences in 'inProgress' and 'completed' tabs */}
                        {filteredConferences.length > 0 ? (
                            filteredConferences.map((conference, index) => {
                                const {
                                    id,
                                    Conference_title,
                                    Description,
                                    Submission_deadline,
                                    Review_deadline,
                                    Status,
                                    Start_date,
                                    Conference_location,
                                } = conference;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleCardClick(id)}
                                        className="bg-white rounded-xl shadow-xl p-6 mb-6 cursor-pointer transition-all transform hover:translate-y-[-10px] hover:shadow-2xl"
                                    >
                                        <div className="flex">
                                            {/* Image placeholder for card image */}
                                            <div className="w-36 mr-5 rounded-lg overflow-hidden">
                                                <img src="https://via.placeholder.com/150" alt="Conference" className="w-full h-auto" />
                                            </div>
                                            <div className="flex-grow text-left">
                                                <h3 className="text-green-600 text-center  text-xl font-bold">{Conference_title}</h3>
                                                <p><strong>Description:</strong> {Description}</p>
                                                <p><strong>Submission Deadline:</strong> {Submission_deadline}</p>
                                                <p><strong>Review Deadline:</strong> {Review_deadline}</p>
                                                <p><strong>Status:</strong> {Status}</p>
                                                <p><strong>Start Date:</strong> {Start_date}</p>
                                                <p><strong>Location:</strong> {Conference_location}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No conferences found for this tab.</p>
                        )}
                    </div>
                )}

                {/* Modal for Assign Sub-Organizer */}
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

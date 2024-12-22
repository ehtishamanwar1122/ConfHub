import React, { useState } from 'react';
import '../styles/OrganizerDashboard.css'
import Layout from './Layouts/Layout';

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState('inProgress');
    const conferences = [
        {
            title: 'Conference Title',
            status: 'inprogress',
            authorsInvited: 'YES',
            totalSubmissions: 'Display the total number of papers submitted.',
            pendingReviews: '10 reviews pending.',
            deadline: 'A date and time highlighted in a different color for visibility',
            image: 'https://via.placeholder.com/100',
        },
        {
            title: 'Conference Title',
            status: 'inprogress',
            authorsInvited: 'NO',
            totalSubmissions: 'Display the total number of papers submitted.',
            pendingReviews: '10 reviews pending.',
            deadline: 'A date and time highlighted in a different color for visibility',
            image: 'https://via.placeholder.com/100',
        },
    ];

    return (
        <Layout>
            <div className="dashboard-container">
                <div className="tab-container">
                    <button
                        className={`tab ${activeTab === 'inProgress' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inProgress')}
                    >
                        In Progress Conferences
                    </button>
                    <button
                        className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed Conferences
                    </button>
                </div>
                {conferences.map((conference, index) => (
                    <div className="card" key={index}>
                        <div className="card-image">
                            <img src={conference.image} alt="Conference" />
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{conference.title}</h3>
                            <p className="status">Status: {conference.status}</p>
                            <p
                                className={`authors-invited ${
                                    conference.authorsInvited === 'NO' ? 'no' : ''
                                }`}
                            >
                                Authors Invited: {conference.authorsInvited}
                            </p>
                            <p className="info-item">Total Submissions: {conference.totalSubmissions}</p>
                            <p className="info-item">Pending Reviews: {conference.pendingReviews}</p>
                            <p className="info-item">Deadline: {conference.deadline}</p>
                        </div>
                        <div className="card-arrow">&gt;</div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default OrganizerDashboard;

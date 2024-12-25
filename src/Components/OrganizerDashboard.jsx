import React from 'react';
import styled from 'styled-components';
import Layout from './Layouts/Layout';

const DashboardContainer = styled.div`
    padding: 20px;
`;

const TabContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
`;

const Tab = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: ${props => props.active ? '#007bff' : 'transparent'};
    color: ${props => props.active ? 'white' : '#333'};
    cursor: pointer;
    border-radius: 5px;
    margin-right: 10px;
`;

const Card = styled.div`
    background-color: white;
    border-radius: 15px; /* More rounded corners */
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* More pronounced shadow */
    display: flex;
    align-items: flex-start;
    overflow: hidden; /* Hide image overflow */
    border: 1px solid #eee; /* Subtle border */
`;

const CardImage = styled.div`
    width: 150px; /* Increased width */
    margin-right: 20px;
    border-radius: 10px; /* Match card rounding */
    overflow: hidden; /* Ensure image stays within rounded bounds */
    img {
        width: 100%;
        height: auto;
        display: block; /* Prevents small gap at bottom of image */
    }
`;

const CardContent = styled.div`
    flex-grow: 1;
    flex-start:left;
    `;

const CardTitle = styled.h3`
    margin-top: 0;
    color: #198754;
`;

const Status = styled.p`
    color: #6c757d; 
    margin-bottom: 5px;
`;

const AuthorsInvited = styled.p`
    color: ${props => props.invited === 'NO' ? 'red' : '#6c757d'}; /* Red if NO */
    margin-bottom: 5px;
`;

const InfoItem = styled.p`
    color: #495057; /* Darker gray for other info */
    margin-bottom: 3px;
    font-size: 0.95rem; /* Slightly smaller font */
`;

const CardArrow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f8f9fa; /
    color: #ced4da; /* Light gray arrow */
    cursor: pointer;
    margin-left: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05); /* Very Subtle shadow */
`;

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = React.useState('inProgress');
    const conferences = [
        { title: 'Conference Title', status: 'inprogress', authorsInvited: 'YES', totalSubmissions: 'Display the total number of papers submitted.', pendingReviews: '10 reviews pending.', deadline: 'A date and time highlighted in a different color for visibility', image: 'https://via.placeholder.com/100' }, // Add image URL
        { title: 'Conference Title', status: 'inprogress', authorsInvited: 'NO', totalSubmissions: 'Display the total number of papers submitted.', pendingReviews: '10 reviews pending.', deadline: 'A date and time highlighted in a different color for visibility', image: 'https://via.placeholder.com/100' }, // Add image URL
    ];

    return (
        <Layout>
            <DashboardContainer>
                <TabContainer>
                    <Tab active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')}>In Progress conferences</Tab>
                    <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>Completed Conferences</Tab>
                </TabContainer>
                {conferences.map((conference, index) => (
                    <Card key={index}>
                        <CardImage>
                            <img src={conference.image} alt="Conference" />
                        </CardImage>
                        <CardContent>
                            <h3>{conference.title}</h3>
                            <p>Status: {conference.status}</p>
                            <p>Authors invited: {conference.authorsInvited}</p>
                            <p>Total Submissions: {conference.totalSubmissions}</p>
                            <p>Pending Reviews: {conference.pendingReviews}</p>
                            <p>Deadline: {conference.deadline}</p>
                        </CardContent>
                        <CardArrow>&gt;</CardArrow>
                    </Card>
                ))}
            </DashboardContainer>
        </Layout>
    );
};

export default OrganizerDashboard;
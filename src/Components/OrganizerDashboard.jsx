import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from './Layouts/Layout';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
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
 background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); /* Add shadow */
    padding: 20px;
    width: 1500px;
    
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin-bottom:30px;
    cursor: pointer;
    &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 1);
  }
`;
const CardImage = styled.div`
    width: 150px;
    margin-right: 20px;
    border-radius: 10px;
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
        display: block;
    }
`;

const CardContent = styled.div`
    flex-grow: 1;
    text-align: left;
`;

const CardTitle = styled.h3`
    margin-top: 0;
    color: #198754;
`;

const CardArrow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f8f9fa;
    color: #ced4da;
    cursor: pointer;
    margin-left: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
`;
const OrganizerDashboard = () => {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState('inProgress');
    const [conferences, setConferences] = useState([]);

    // Fetch conferences
    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const userDetails = JSON.parse(localStorage.getItem("userDetails"));
                const organizerId = userDetails?.organizerId?.id;
               console.log('idd',userDetails);
               
                if (!organizerId) {
                    console.error('Organizer ID not found in local storage');
                    return;
                }
        
                const response = await axios.get(`http://localhost:1337/api/conferences?filters[requestStatus][$eq]=approved&filters[Organizer][$eq]=${organizerId}`);
                const allRequests = response.data.data;
                console.log('Conferences:', allRequests);

                setConferences(allRequests); // Assuming `data` is an array of conferences
            } catch (error) {
                console.error('Error fetching conferences:', error);
            }
        };

        fetchConferences();
    }, []);

    // Filter conferences based on active tab
    const filteredConferences = conferences.filter(conference =>
        activeTab === 'inProgress' ? conference.Status === 'inProgress' : conference.Status === 'completed'
    );
    const handleCardClick = (conferenceId) => {
        navigate(`/orgConferenceDetails/${conferenceId}`);
    };
    return (
        <Layout>
            <DashboardContainer>
                <TabContainer>
                    <Tab active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')}>
                        In Progress Conferences
                    </Tab>
                    <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        Completed Conferences
                    </Tab>
                </TabContainer>
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
                            <Card key={index} onClick={() => handleCardClick(id)} style={{ cursor: "pointer" }}>
                                <CardContent>
                                    <CardTitle>{Conference_title}</CardTitle>
                                    <p><strong>Description:</strong> {Description}</p>
                                    <p><strong>Submission Deadline:</strong> {Submission_deadline}</p>
                                    <p><strong>Review Deadline:</strong> {Review_deadline}</p>
                                    <p><strong>Status:</strong> {Status}</p>
                                    <p><strong>Start Date:</strong> {Start_date}</p>
                                    <p><strong>Location:</strong> {Conference_location}</p>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <p>No conferences found for this tab.</p>
                )}
            </DashboardContainer>
        </Layout>
    );
};

export default OrganizerDashboard;

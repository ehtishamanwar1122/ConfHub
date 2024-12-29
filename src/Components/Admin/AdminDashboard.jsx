import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Layout from './Layouts/Layout';
import '../../styles/AdminDashboard.css'; // Import your CSS file

const AdminDashboard = () => {
  const [organizers, setOrganizers] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/organizers');
        const allRequests = response.data.data;

        // Separate pending and completed requests
        const pending = allRequests.filter(req => req.status === 'pending');
        const completed = allRequests.filter(req => req.status === 'completed');

        setOrganizers(pending);
        setCompletedRequests(completed);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await axios.put('http://localhost:1337/api/organizers/update-status', {
        id,
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating status to '${status}':`, error.response || error.message);
      throw error;
    }
  };

  const handleApprove = async (index) => {
    const organizer = organizers[index];
    try {
      await updateRequestStatus(organizer.id, 'approved');
      const updatedOrganizers = [...organizers];
      updatedOrganizers.splice(index, 1);
      setOrganizers(updatedOrganizers);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (index) => {
    const organizer = organizers[index];
    try {
      await updateRequestStatus(organizer.id, 'rejected');
      const updatedOrganizers = [...organizers];
      updatedOrganizers.splice(index, 1);
      setOrganizers(updatedOrganizers);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const renderRequests = () => {
    const requestsToRender = activeTab === 'pending' ? organizers : completedRequests;

    if (loading) {
      return <p>Loading requests...</p>;
    }

    if (requestsToRender.length === 0) {
      return <p>No {activeTab === 'pending' ? 'pending' : 'completed'} requests.</p>;
    }

    return requestsToRender.map((organizer, index) => (
      <div className="request-card" key={organizer.id}>
        <div className="avatar">
          <div className="avatar-circle"></div>
        </div>
        <div className="request-details">
          <p>Organizer Name: {organizer.Organizer_FirstName} {organizer.Organizer_LastName}</p>
          <p>Organizer Email: {organizer.Organizer_Email}</p>
          <p>Affiliation: {organizer.Affiliation}</p>
        </div>
        {activeTab === 'pending' && (
          <div className="request-actions">
            <button
              className="approve-button"
              onClick={() => handleApprove(index)}
            >
              Approve Request
            </button>
            <button
              className="reject-button"
              onClick={() => handleReject(index)}
            >
              Reject Request
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <Layout>
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>

        <TabContainer>
          <Tab active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
            Pending Requests
          </Tab>
          <Tab active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
            Completed Requests
          </Tab>
        </TabContainer>

        <div className="requests-container">
          {renderRequests()}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

// Styled Components
const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 25px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  border-radius: 25px;
  margin-right: 10px;
`;


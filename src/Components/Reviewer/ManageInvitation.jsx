import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API requests
import Layout from './Layouts/Layout';
import styled from 'styled-components'; // For styling

const ManageInvitations = () => {
  const [activeInvitations, setActiveInvitations] = useState([]); // Invitations sent and active
  const [pendingInvitations, setPendingInvitations] = useState([]); // Invitations waiting for approval
  const [activeTab, setActiveTab] = useState('active'); // Tracks active tab
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch invitations data
  useEffect(() => {
    const fetchInvitationsData = async () => {
      try {
        // Fetch active invitations
        const activeResponse = await axios.get('http://localhost:1337/api/invitations/active');
        setActiveInvitations(activeResponse.data);

        // Fetch pending invitations (for approval)
        const pendingResponse = await axios.get('http://localhost:1337/api/invitations/pending');
        setPendingInvitations(pendingResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching invitations data:', error);
        setLoading(false);
      }
    };

    fetchInvitationsData();
  }, []);

  // Approve invitation handler
  const handleApprove = async (invitationId) => {
    try {
      await axios.post(`http://localhost:1337/api/invitations/approve/${invitationId}`);
      // Refresh pending invitations after approval
      const updatedPending = pendingInvitations.filter(invite => invite.id !== invitationId);
      setPendingInvitations(updatedPending);
      alert('Invitation approved successfully!');
    } catch (error) {
      console.error('Error approving invitation:', error);
    }
  };

  // Render Active Invitations
  const renderActiveInvitations = () => {
    if (loading) return <p>Loading active invitations...</p>;
    if (activeInvitations.length === 0) return <p>No active invitations found.</p>;

    return activeInvitations.map((invite) => (
      <InvitationCard key={invite.id}>
        <h3>{invite.name}</h3>
        <p><strong>Email:</strong> {invite.email}</p>
        <p><strong>Status:</strong> {invite.status}</p>
        <p><strong>Role:</strong> {invite.role}</p>
      </InvitationCard>
    ));
  };

  // Render Pending Invitations (for approval)
  const renderPendingInvitations = () => {
    if (loading) return <p>Loading invitations to approve...</p>;
    if (pendingInvitations.length === 0) return <p>No pending invitations to approve.</p>;

    return pendingInvitations.map((invite) => (
      <InvitationCard key={invite.id}>
        <h3>{invite.name}</h3>
        <p><strong>Email:</strong> {invite.email}</p>
        <p><strong>Requested Role:</strong> {invite.role}</p>
        <Button onClick={() => handleApprove(invite.id)}>Approve</Button>
      </InvitationCard>
    ));
  };

  return (
    <Layout>
      <MainContent>
        <h1>Manage Invitations</h1>

        {/* Tabs */}
        <TabContainer>
          <Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
            Active Invitations
          </Tab>
          <Tab active={activeTab === 'approve'} onClick={() => setActiveTab('approve')}>
            Approve Invitations
          </Tab>
        </TabContainer>

        {/* Content */}
        <ContentContainer>
          {activeTab === 'active' && renderActiveInvitations()}
          {activeTab === 'approve' && renderPendingInvitations()}
        </ContentContainer>
      </MainContent>
    </Layout>
  );
};

export default ManageInvitations;

// Styled Components
const MainContent = styled.div`
  padding: 20px;
`;

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
  background-color: ${(props) => (props.active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  cursor: pointer;
  border-radius: 25px;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#007bff' : '#e9ecef')};
  }
`;

const ContentContainer = styled.div`
  margin-top: 20px;
`;

const InvitationCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;

  h3 {
    margin-top: 0;
  }

  p {
    margin: 5px 0;
  }
`;

const Button = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

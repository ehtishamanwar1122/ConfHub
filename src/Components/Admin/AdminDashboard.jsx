import React, { useState } from 'react';
import '../../styles/AdminDashboard.css'; // Import your CSS file
import './Layouts/Layout'
import Layout from './Layouts/Layout'
const AdminDashboard = () => {
  const [requests, setRequests] = useState([
    {
      name: 'Mudassir Ali',
      email: 'xyz@gmail.com',
      affiliation: 'xyz department',
    },
    {
      name: 'brad adam',
      email: 'xyz@gmail.com',
      affiliation: 'xyz department',
    },
  ]);

  const handleApprove = (index) => {
    // Implement approve logic here (e.g., API call)
    console.log(`Approved request: ${requests[index].name}`);
    // Update the state to reflect the change (e.g., remove from pending, add to completed)
    const updatedRequests = [...requests];
    updatedRequests.splice(index, 1); // Remove from pending
    setRequests(updatedRequests);
  };

  const handleReject = (index) => {
    // Implement reject logic here (e.g., API call)
    console.log(`Rejected request: ${requests[index].name}`);
    const updatedRequests = [...requests];
    updatedRequests.splice(index, 1);
    setRequests(updatedRequests);

  };

  return (
    
      <Layout>
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>

        <div className="tab-container">
          <button className="tab active">Pending Requests</button>
          <button className="tab">Completed Requests</button>
        </div>

        <div className="requests-container">
          {requests.map((request, index) => (
            <div className="request-card" key={index}>
              <div className="avatar"> 
                  <div className='avatar-circle'></div>
              </div>
              <div className="request-details">
                <p>Organizer Name: {request.name}</p>
                <p>Organizer Email: {request.email}</p>
                <p>Affiliation: {request.affiliation}</p>
              </div>
              <div className="request-actions">
                <button className="approve-button" onClick={() => handleApprove(index)}>
                  Approve Request
                </button>
                <button className="reject-button" onClick={() => handleReject(index)}>
                  Reject Request
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p>No pending requests.</p>}
        </div>
      </div>
       
    </Layout>
  );
};

export default AdminDashboard;
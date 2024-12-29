import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import '../../styles/AdminDashboard.css'; // Import your CSS file
import Layout from './Layouts/Layout';

const AdminDashboard = () => {
  // State for organizers
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizers from the backend
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/organizers');
        console.log('Organizers fetched:', response.data);
        
        // Assuming response.data contains the list of organizers
        setOrganizers(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching organizers:", error);
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []); // Empty dependency array ensures this effect runs once on component mount

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await axios.put('http://localhost:1337/api/organizers/update-status', {
        id,
        status,
      });
      console.log(`Successfully updated status to '${status}':`, response.data);
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

      // Update state to remove the approved organizer
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

      // Update state to remove the rejected organizer
      const updatedOrganizers = [...organizers];
      updatedOrganizers.splice(index, 1);
      setOrganizers(updatedOrganizers);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
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
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            organizers.map((organizer, index) => (
              <div className="request-card" key={organizer.id}>
                <div className="avatar">
                  <div className="avatar-circle"></div>
                </div>
                <div className="request-details">
                  <p>Organizer Name: {organizer.Organizer_FirstName} {organizer.Organizer_LastName}</p>
                  <p>Organizer Email: {organizer.Organizer_Email}</p>
                  <p>Affiliation: {organizer.Affiliation}</p>
                </div>
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
              </div>
            ))
          )}
          {organizers.length === 0 && !loading && <p>No pending requests.</p>}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
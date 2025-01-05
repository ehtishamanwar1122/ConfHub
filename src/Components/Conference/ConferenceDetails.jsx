import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ConferenceDetails.css'
import Header from "./Header";
import Footer from "./Footer";
// import axios from "axios";

const ConferenceDetails = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        // Uncomment the following lines when testing with the actual API
        // const response = await axios.get(`http://localhost:1337/api/conferences/${id}`);
        // setConference(response.data);

        // Mock data for testing
        const mockData = {
          id: "123",
          title: "Annual AI Conference 2025",
          description: "A conference focusing on the latest advancements in AI technology.",
          startDate: "2025-05-10",
          endDate: "2025-05-12",
          location: "San Francisco, CA",
          organizer: "Tech Innovators Inc.",
        };

        // Simulate API delay
        setTimeout(() => {
          if (id === mockData.id) {
            setConference(mockData);
          } else {
            setConference(null);
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching conference details:", error);
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [id]);

  const handleJoinConference = () => {
    alert("You have successfully joined the conference!");
    
  };

  if (loading) return <p>Loading...</p>;

  return (
    <><Header />
    <div className="conference-details">
      {conference ? (
        <>
          <h1>{conference.title}</h1>
          <p>{conference.description}</p>
          <p><strong>Start Date:</strong> {conference.startDate}</p>
          <p><strong>End Date:</strong> {conference.endDate}</p>
          <p><strong>Location:</strong> {conference.location}</p>
          <p><strong>Organizer:</strong> {conference.organizer}</p>
          <button onClick={handleJoinConference} className="join-conference-button">
            Join Conference
          </button>
        </>
      ) : (
        <p>Conference not found.</p>
      )}
    </div>
    <Footer />
    </>
  );
};

export default ConferenceDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConferenceDetails = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/conferences/${id}`);
        setConference(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conference details:", error);
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="conference-details">
      {conference ? (
        <>
          <h1>{conference.title}</h1>
          <p>{conference.description}</p>
          <p><strong>Start Date:</strong> {conference.startDate}</p>
          <p><strong>End Date:</strong> {conference.endDate}</p>
          <p><strong>Location:</strong> {conference.location}</p>
          <p><strong>Organizer:</strong> {conference.organizer}</p>
        </>
      ) : (
        <p>Conference not found.</p>
      )}
    </div>
  );
};

export default ConferenceDetails;

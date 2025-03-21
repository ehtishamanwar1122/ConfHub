import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './ConferenceDetails.css'
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { dashboard_bg } from "../../assets/Images";
const OrgConfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
          
        const response = await axios.get(`http://localhost:1337/api/conferences?filters[id][$eq]=${id}&populate=*`);
        setConference(response.data.data);
        setLoading(false);
        console.log("connn,",response.data.data);
       
        
      } catch (error) {
        console.error("Error fetching conference details:", error);
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [id]);

  const handleJoinConference = () => {
  
    navigate("/register");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
  <Header />
  <div >
    
      <section className="conference-details">
          
          {loading ? (
            <p>Loading conferences...</p>
          ) : conference.length > 0 ? (
            <div className="">
              {conference.map((conference) => (
                <div >
                  <h2>{conference.Conference_title}</h2>
                  <p><strong>Organizer's Name:</strong> {conference.Organizer?.Organizer_FirstName} {conference.Organizer?.Organizer_LastName}</p>
                  <p><strong>Conference Description:</strong>{conference.Description}</p>
                  <p><strong>Status:</strong>{conference.Status}</p>
                  <p><strong>Start Date:</strong> {conference.Start_date}</p>
                  <p><strong>Time:</strong>{conference.Conference_time}</p>
                  <p><strong>Paper Submission Deadline</strong> {conference.Submission_deadline  }</p>
                  <p><strong>Review Deadline:</strong>{conference.Review_deadline}</p>
                  <p><strong>Location:</strong>{conference.Conference_location}</p>
                  
                
                  
                </div>
                
              ))}
            </div>
          ) : (
            <p>No conferences in progress at the moment.</p>
          )}
        </section>
    
        </div>
  <Footer />
</>

  );
};

export default OrgConfDetails;

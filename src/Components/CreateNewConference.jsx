import React from 'react';
import Layout from './Layouts/Layout';
import '../styles/CreateConference.css'; // Import the CSS file

const CreateConference = () => {
  return (
    <Layout>
        <h1>
          <span>Create new</span> <span>Conference</span>
        </h1>
      <div className="container">
        
        <form>
          <div>
            <label htmlFor="conferenceTitle">Conference Title</label>
            <input
              type="text"
              id="conferenceTitle"
              placeholder="Enter conference title"
            />
          </div>

          <div>
            <label htmlFor="conferenceDescription">Conference Description</label>
            <textarea
              id="conferenceDescription"
              rows="3"
              placeholder="Enter conference description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
              />
            </div>
            <div>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
              />
            </div>
          </div>

          <div>
            <label htmlFor="conferenceLocation">Conference Location</label>
            <input
              type="text"
              id="conferenceLocation"
              placeholder="Enter conference location"
            />
          </div>

          <h5>Track Details</h5>
          <div>
            <label htmlFor="trackTitle">Track Title</label>
            <input
              type="text"
              id="trackTitle"
              placeholder="Enter track title"
            />
          </div>
          <div>
            <label htmlFor="trackDescription">Track Description</label>
            <textarea
              id="trackDescription"
              rows="3"
              placeholder="Enter track description"
            ></textarea>
          </div>
          <button type="button">Add Track</button>

          <h5>Session Details</h5>
          <div>
            <label htmlFor="sessionTitle">Session Title</label>
            <input
              type="text"
              id="sessionTitle"
              placeholder="Enter session title"
            />
          </div>
          <div>
            <label htmlFor="speakerNames">Speaker Names</label>
            <input
              type="text"
              id="speakerNames"
              placeholder="Enter speakers' names"
            />
          </div>

          <h5>Deadlines</h5>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <label htmlFor="submissionDeadline">Submission Deadline</label>
              <input
                type="date"
                id="submissionDeadline"
              />
            </div>
            <div>
              <label htmlFor="reviewDeadline">Review Deadline</label>
              <input
                type="date"
                id="reviewDeadline"
              />
            </div>
          </div>

          <div className="text-left">
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateConference;

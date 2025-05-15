import React, { useState, useEffect } from "react";
import Layout from "./Layouts/Layout";
import axios from "axios";
import { reviewRequest } from "../../Services/reviewerService";

const ReviewerDashboard = () => {
  const [ongoingPapers, setOngoingPapers] = useState([]);
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("userDetails"));
  const userId = storedUser?.id;
  const reviewerId = storedUser?.reviewerId?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !reviewerId) return;

      try {
        const userResponse = await axios.get(
          `http://localhost:1337/api/users/${userId}?populate=reviewerId`
        );

        const domain = userResponse.data?.reviewerId?.domain;

        const [ongoingRes, completedRes, assignedRes] = await Promise.all([
          axios.get("http://localhost:1337/api/papers?populate=*"),
          axios.get(
            "http://localhost:1337/api/papers?populate[review][populate]=reviewer&populate=conference"
          ),
          axios.get(
            `http://localhost:1337/api/papers?filters[reviewRequestsConfirmed][id][$eq]=${reviewerId}&populate=*`
          ),
        ]);

        const allPapers = ongoingRes.data?.data || [];
        const completedData = completedRes.data?.data || [];
        const assignedData = assignedRes.data?.data || [];

        const completed = completedData.filter((paper) =>
          paper.review?.some((r) => r.reviewer?.id === reviewerId)
        );

        const ongoing = allPapers.filter((paper) => {
          const domainMatch = paper.Domain === domain;
          const alreadyReviewed = completed.some((p) => p.id === paper.id);
          const alreadyRequested =
            paper.reviewRequests?.some((r) => r.id === reviewerId) ||
            paper.reviewRequestsConfirmed?.some((r) => r.id === reviewerId) ||
            paper.reviewRequestsRejected?.some((r) => r.id === reviewerId);

          return domainMatch && !alreadyReviewed && !alreadyRequested;
        });

        setCompletedReviews(completed);
        setAssignedPapers(assignedData);
        setOngoingPapers(ongoing);
      } catch (err) {
        console.error("Error fetching reviewer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, reviewerId]);

  const handleReviewRequest = async (paper) => {
    alert("Request received! Your review request has been submitted.");
    try {
      const response = await reviewRequest({
        paperId: paper.id,
        reviewerId,
        status: "pending",
      });
      console.log("Review request sent:", response);
    } catch (error) {
      console.error("Review request failed:", error);
    }
  };

// Replace renderOngoing function
const renderOngoing = () =>
  ongoingPapers.length ? (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100 text-left">
        <th className="p-3 border">paper Id</th>
          <th className="p-3 border">Title</th>
          <th className="p-3 border">Conference</th>
          <th className="p-3 border">Domain</th>
          <th className="p-3 border">Review Deadline</th>
          <th className="p-3 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {ongoingPapers.map((paper) => (
          <tr key={paper.id} className="border-t">
             <td className="p-3 border">{paper.id}</td>
            <td className="p-3 border">{paper.Paper_Title}</td>
            <td className="p-3 border">{paper.conference?.Conference_title}</td>
            <td className="p-3 border">{paper.Domain}</td>
            <td className="p-3 border">{paper.conference?.Review_deadline}</td>
            <td className="p-3 border">
              <button
                onClick={() => handleReviewRequest(paper)}
                className="bg-blue-500 rounded-full text-white px-4 py-2  hover:bg-blue-600"
              >
                Review This Paper
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No ongoing papers in your domain.</p>
  );

// Replace renderAssigned function
const renderAssigned = () => (
  <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr className="bg-gray-100 text-left">
      <th className="p-3 border">Paper Id</th>
        <th className="p-3 border">Title</th>
        <th className="p-3 border">Author</th>
        <th className="p-3 border">Conference</th>
        <th className="p-3 border">Deadline</th>
        <th className="p-3 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {assignedPapers.map((paper) => (
        <tr key={paper.id} className="border-t">
           <td className="p-3 border">{paper.id}</td>
          <td className="p-3 border">{paper.Paper_Title}</td>
          <td className="p-3 border">{paper.Author}</td>
          <td className="p-3 border">{paper.SubmittedTo?.Conference_title}</td>
          <td className="p-3 border">{paper.conference?.Review_deadline}</td>
          <td className="p-3 border space-y-2">
            {paper.file?.url && (
              <a
                href={paper.file.url}
                download={paper.file.name}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              >
                <i className="fa fa-download mr-1"></i>Download
              </a>
            )}
            <button
              onClick={() => (window.location.href = `/SubmitReview/${paper.id}`)}
              className="inline-block bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
            >
              <i className="fa fa-edit mr-1"></i>Submit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Replace renderCompleted function
const renderCompleted = () => (
  <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-3 border">Title</th>
        <th className="p-3 border">Author</th>
        <th className="p-3 border">Conference</th>
        <th className="p-3 border">Deadline</th>
        <th className="p-3 border">Status</th>
      </tr>
    </thead>
    <tbody>
      {completedReviews.map((paper) => (
        <tr key={paper.id} className="border-t">
          <td className="p-3 border">{paper.Paper_Title}</td>
          <td className="p-3 border">{paper.Author}</td>
          <td className="p-3 border">{paper.conference?.Conference_title}</td>
          <td className="p-3 border">{paper.conference?.Review_deadline}</td>
          <td className="p-3 border rounded-full text-green-600 font-semibold">Review Submitted</td>
        </tr>
      ))}
    </tbody>
  </table>
);


  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Reviewer Dashboard</h1>

        <div className="flex mb-6 p-2 rounded-full">
          {["ongoing", "papers", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-gray-700"
              }`}
            >
              {tab === "ongoing" ? "Ongoing Papers" : tab === "papers" ? "Assigned Papers" : "Completed Reviews"}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "ongoing" ? (
            renderOngoing()
          ) : activeTab === "papers" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderAssigned()}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCompleted()}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewerDashboard;

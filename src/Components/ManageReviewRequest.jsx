import React, { useState, useEffect } from "react";
import Layout from "./Layouts/Layout";
import { confirmReviewRequest } from "../Services/api.js";
import { rejectReviewRequest } from "../Services/api.js";
const ManageReviewerRequests = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch papers with reviewer requests
    const fetchPapers = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/papers?populate=*"
        );
        const data = await response.json();

        // Filter papers where reviewRequests exist and are not empty
        const filteredPapers = data.data.filter(
          (paper) => paper.reviewRequests && paper.reviewRequests.length > 0
        );
        console.log("fil", filteredPapers);

        setPapers(filteredPapers);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handlePaperClick = (paper) => setSelectedPaper(paper);
  const handleBack = () => setSelectedPaper(null);

  const handleApproveRequest = async (reviewerId) => {
    try {
      const payload = {
        paperId: selectedPaper.id,
        reviewerId: reviewerId,
      };
      console.log("psy", payload);

      // Call the service function
      const response = await confirmReviewRequest(payload);
      if (response.message == "paper assignment successful") {
        alert("Reviewer approved successfully!");
        window.location.reload();
      } else {
        console.error("Failed to approve reviewer:", response.error);
      }
    } catch (error) {
      console.error("Error approving reviewer:", error);
    }
  };

  const handleDisapproveRequest = async (reviewerId) => {
    try {
      const payload = {
        paperId: selectedPaper.id,
        reviewerId: reviewerId,
      };
      console.log("psy", payload);

      // Call the service function
      const response = await rejectReviewRequest(payload);
      if (response.message == "paper assignment successful") {
        alert("Reviewer rejected successfully!");
        window.location.reload();
      } else {
        console.error("Failed to reject reviewer:", response.error);
      }
    } catch (error) {
      console.error("Error rejecting reviewer:", error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">
            Manage Reviewer Requests
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading papers...</p>
          ) : !selectedPaper ? (
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold text-gray-700 mb-6">
                Papers with Reviewer Requests
              </h4>
              {papers.length === 0 ? (
                <p className="text-gray-500">
                  No papers found with reviewer requests.
                </p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {papers.map((paper) => (
                    <li
                      key={paper.id}
                      onClick={() => handlePaperClick(paper)}
                      className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer p-6"
                    >
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">
                        Paper Title: {paper.Paper_Title}
                      </h5>
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">
                        Author Name: {paper.Author}
                      </h5>
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">
                        Conference Name: {paper.SubmittedTo.Conference_title}
                      </h5>
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">
                        Domain: {paper.Domain}
                      </h5>
                      <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">
                        Review Deadline: {paper.conference.Review_deadline}
                      </h5>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-3xl space-y-6">
                <div>
                  <h3 className="text-2xl text-center font-bold text-gray-800 mb-2">
                    Paper Title: {selectedPaper.Paper_Title}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Abstract:</strong> {selectedPaper.Abstract}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Assigned Reviewers
                  </h4>
                  {selectedPaper.reviewers?.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedPaper.reviewers.map((reviewer, index) => (
                        <li key={index}>
                          {reviewer.firstName} {reviewer.lastName} (
                          {reviewer.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No reviewers assigned yet.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Reviewer Requests
                  </h4>
                  {selectedPaper.reviewRequests?.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedPaper.reviewRequests.map((request, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-4"
                        >
                          <span className="text-gray-700">
                            {request.firstName} {request.lastName} (
                            {request.email})
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="px-4 py-2 bg-green-500 text-white text-sm rounded shadow hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                            <button
                                 onClick={() => handleDisapproveRequest(request.id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded shadow hover:bg-red-600 transition"
                            >
                              Disapprove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No reviewer requests yet.
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded shadow hover:bg-indigo-700 transition"
                  >
                    Back to Papers List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageReviewerRequests;

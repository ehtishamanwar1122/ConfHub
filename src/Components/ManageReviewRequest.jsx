import React, { useState } from 'react';
import Layout from './Layouts/Layout';

const papersData = [
  {
    id: 1,
    title: 'AI in Healthcare',
    abstract: 'This paper explores AI applications in healthcare.',
    authors: ['John Doe', 'Jane Smith'],
    reviewers: ['Reviewer A', 'Reviewer B'],
    reviewerRequests: ['Reviewer C', 'Reviewer D'],
  },
  {
    id: 2,
    title: 'Blockchain in Finance',
    abstract: 'A deep dive into blockchain applications for finance.',
    authors: ['Alice Johnson'],
    reviewers: ['Reviewer X'],
    reviewerRequests: ['Reviewer Y'],
  },
];

const ManageReviewerRequests = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
  };

  const handleBack = () => {
    setSelectedPaper(null);
  };

  const handleApproveRequest = (reviewer) => {
    const updatedPapers = papersData.map((paper) => {
      if (paper.id === selectedPaper.id) {
        return {
          ...paper,
          reviewers: [...paper.reviewers, reviewer],
          reviewerRequests: paper.reviewerRequests.filter((req) => req !== reviewer),
        };
      }
      return paper;
    });
    const updatedPaper = updatedPapers.find((paper) => paper.id === selectedPaper.id);
    setSelectedPaper(updatedPaper);
  };

  const handleDisapproveRequest = (reviewer) => {
    const updatedPapers = papersData.map((paper) => {
      if (paper.id === selectedPaper.id) {
        return {
          ...paper,
          reviewerRequests: paper.reviewerRequests.filter((req) => req !== reviewer),
        };
      }
      return paper;
    });
    const updatedPaper = updatedPapers.find((paper) => paper.id === selectedPaper.id);
    setSelectedPaper(updatedPaper);
  };

  return (
    <Layout>
      {/* Removed min-h-screen for less vertical space */}
      <div className="flex justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-6xl p-6">
          {/* Removed mb-10 -> adjusted spacing to mb-4 */}
          <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">
            Manage Reviewer Requests
          </h2>

          {/* Paper List */}
          {!selectedPaper ? (
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold text-gray-700 mb-6">All Submitted Papers</h4>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {papersData.map((paper) => (
                  <li
                    key={paper.id}
                    onClick={() => handlePaperClick(paper)}
                    className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer p-6"
                  >
                    <h5 className="text-lg text-center font-semibold text-gray-800 mb-2">{paper.title}</h5>
                    <p className="text-sm text-gray-500">
                      <strong>Authors:</strong> {paper.authors.join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-3xl space-y-6">
                {/* Paper Info */}
                <div>
                  <h3 className="text-2xl text-center font-bold text-gray-800 mb-2">{selectedPaper.title}</h3>
                  <p className="text-gray-700">
                    <strong>Abstract:</strong> {selectedPaper.abstract}
                  </p>
                  <p className="text-gray-700">
                    <strong>Authors:</strong> {selectedPaper.authors.join(', ')}
                  </p>
                </div>

                {/* Assigned Reviewers */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Assigned Reviewers</h4>
                  {selectedPaper.reviewers.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedPaper.reviewers.map((reviewer, index) => (
                        <li key={index}>{reviewer}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No reviewers assigned yet.</p>
                  )}
                </div>

                {/* Reviewer Requests */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Reviewer Requests</h4>
                  {selectedPaper.reviewerRequests.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedPaper.reviewerRequests.map((request, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-4"
                        >
                          <span className="text-gray-700">{request}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(request)}
                              className="px-4 py-2 bg-green-500 text-white text-sm rounded shadow hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDisapproveRequest(request)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded shadow hover:bg-red-600 transition"
                            >
                              Disapprove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No reviewer requests yet.</p>
                  )}
                </div>

                {/* Back Button */}
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layouts/Layout';

const PaperReviewPage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch review based on paper ID (dummy data used here)
  useEffect(() => {
    const dummyReviews = {
      1: {
        paperTitle: "AI in Healthcare",
        conference: "International AI Conference",
        status: "Under Review",
        reviewer: "Dr. John Smith",
        comments: "The paper presents an innovative approach to AI diagnosis. However, methodology details are lacking.",
        strengths: "Innovative approach to AI in healthcare.",
        weaknesses: "Lack of methodology details and empirical data.",
        scores: {
          Originality: 8,
          Significance: 7.5,
          Presentation: 7,
          Overall: 8,
          Recommendation: "Strongly Recommend"
        }
      },
      2: {
        paperTitle: "Optimizing React Apps",
        conference: "Web Development Expo",
        status: "Accepted",
        reviewer: "Prof. Sarah Lee",
        comments: "Well-written and practical. Good use of case studies. Minor improvements needed in performance analysis.",
        strengths: "Practical and well-written. Great case studies.",
        weaknesses: "Minor performance analysis improvements needed.",
        scores: {
          Originality: 9,
          Significance: 9.5,
          Presentation: 9,
          Overall: 9,
          Recommendation: "Accept"
        }
      },
    };

    setTimeout(() => {
      const review = dummyReviews[paperId];
      setReviewData(review || null);
      setLoading(false);
    }, 1000);
  }, [paperId]);

  const calculateOverallScore = (scores) => {
    const values = Object.values(scores);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };

  if (loading) return <Layout><div className="p-6">Loading review...</div></Layout>;

  if (!reviewData) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-red-600 font-semibold">No review found for this paper.</p>
          <button
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Review for: {reviewData.paperTitle}</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <p><span className="font-semibold">Conference:</span> {reviewData.conference}</p>
            <p><span className="font-semibold">Status:</span> {reviewData.status}</p>
            <p><span className="font-semibold">Reviewer:</span> {reviewData.reviewer}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Individual Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Originality", "Significance", "Presentation", "Overall"].map((criterion) => (
                <div key={criterion} className="bg-gray-100 p-4 rounded-lg">
                  <span className="font-medium">{criterion}:</span> {reviewData.scores[criterion]}/10
                </div>
              ))}
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="font-medium">Recommendation:</span> {reviewData.scores.Recommendation}
              </div>
            </div>

            <p className="mt-4 text-blue-600 font-bold">
              Overall Score: {calculateOverallScore(reviewData.scores)}/10
            </p>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Reviewer Comments:</p>
            <p className="bg-gray-100 p-6 rounded-lg">{reviewData.comments}</p>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Strengths:</p>
            <p className="bg-gray-100 p-6 rounded-lg">{reviewData.strengths}</p>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Weaknesses:</p>
            <p className="bg-gray-100 p-6 rounded-lg">{reviewData.weaknesses}</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Back to Submitted Papers
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaperReviewPage;

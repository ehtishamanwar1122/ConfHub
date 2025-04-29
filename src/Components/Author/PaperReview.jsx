import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layouts/Layout';

const PaperReviewPage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const dummyReviews = {
  //   1: {
  //     paperTitle: "AI in Healthcare",
  //     conference: "International AI Conference",
  //     status: "Under Review",
  //     reviewer: "Dr. John Smith",
  //     comments: "The paper presents an innovative approach to AI diagnosis. However, methodology details are lacking.",
  //     strengths: "Innovative approach to AI in healthcare.",
  //     weaknesses: "Lack of methodology details and empirical data.",
  //     scores: {
  //       Originality: 8,
  //       Significance: 7.5,
  //       Presentation: 7,
  //       Overall: 8,
  //       Recommendation: "Strongly Recommend"
  //     }
  //   },
  //   2: {
  //     paperTitle: "Optimizing React Apps",
  //     conference: "Web Development Expo",
  //     status: "Accepted",
  //     reviewer: "Prof. Sarah Lee",
  //     comments: "Well-written and practical. Good use of case studies. Minor improvements needed in performance analysis.",
  //     strengths: "Practical and well-written. Great case studies.",
  //     weaknesses: "Minor performance analysis improvements needed.",
  //     scores: {
  //       Originality: 9,
  //       Significance: 9.5,
  //       Presentation: 9,
  //       Overall: 9,
  //       Recommendation: "Accept"
  //     }
  //   },
  // };
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/papers?filters[id][$eq]=${paperId}&populate=review&populate=SubmittedTo `);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const data = await response.json();
        setReviewData(data.data);
        console.log('dd',data.data);
        
      } catch (error) {
        console.error('Error fetching review:', error);
        setReviewData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [paperId]);
  const calculateOverallScore = (scores) => {
    if (!scores) return 'N/A';
  
    const values = Object.values(scores).filter(val => typeof val === 'number');
    if (values.length === 0) return 'N/A';
  
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  };
  

  // const calculateOverallScore = (scores) => {
  //   const total = scores.originality + scores.presentation + scores.significance;
  //   return total / 3;  // Example calculation for average score
  // };

  // Return loading state while waiting for data
  if (!reviewData) {
    return <div>Loading...</div>;
  }
  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading review...</div>
      </Layout>
    );
  }

  if (!reviewData) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-red-600 font-semibold">No review found for this paper.</p>
          <button
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
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
      <h2 className="text-3xl font-bold mb-6 text-center">Review for: {reviewData[0]?.Paper_Title}</h2>
  
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <p><span className="font-semibold">Conference:</span> {reviewData[0]?.SubmittedTo?.Conference_title}</p>
          <p><span className="font-semibold">Status:</span> {reviewData[0]?.status || 'N/A'}</p>
        </div>
  
        {/* Loop through each review */}
        {reviewData[0]?.review.map((reviews, index) => (
  <div
    key={index}
    className={`mt-10 p-6 bg-white rounded-lg shadow-xl m-10 ${index !== 0 ? 'border-t-2 border-gray-500' : ''}`}
  >
    <h3 className="text-lg font-semibold mb-4">Review {index + 1}</h3>

    {/* First Row: Significance, Originality, Presentation, and Recommendation */}
    <div className="flex space-x-6 mb-6">
      <div className="bg-gray-100 p-4 rounded-lg flex-1">
        <span className="font-medium">Significance:</span> 
        {reviews.significance || 'N/A'}/10
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex-1">
        <span className="font-medium">Originality:</span> 
        {reviews.originality || 'N/A'}/10
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex-1">
        <span className="font-medium">Presentation:</span> 
        {reviews.presentation || 'N/A'}/10
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex-1">
        <span className="font-medium">Recommendation:</span> 
        {reviews.Recommendations || 'N/A'}
      </div>
    </div>

    {/* Second Row: Overall Score */}
    <div className="mt-6">
      <p className="text-blue-600 font-bold">
        Overall Score: {reviews.overall || 'N/A'}/10
      </p>
    </div>

    {/* Third Row: Reviewer Comments */}
    <div className="mt-6">
      <p className="font-semibold mb-2">Reviewer Comments:</p>
      <p className="bg-gray-100 p-6 rounded-lg">
        {reviews.Comments || 'No comments available'}
      </p>
    </div>
  </div>
))}

  
        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Back to Submitted Papers
          </button>
        </div>
      </div>
    </div>
  </Layout>
  
  

  );
};

export default PaperReviewPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layouts/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { submitReview } from "../../Services/reviewerService";

// Rating options used across the component
const ratingOptions = [
  { label: "Strongly Disagree", value: 0 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 5 },
  { label: "Agree", value: 7 },
  { label: "Strongly Agree", value: 10 },
];

const SubmitReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reviewerId, setReviewerId] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  const [reviewComments, setReviewComments] = useState("");
  const [recommendation, setRecommendation] = useState("Accept");

  const [originality, setOriginality] = useState("");
  const [significance, setSignificance] = useState("");
  const [presentation, setPresentation] = useState("");
  const [overall, setOverall] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get reviewerId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    if (storedUser?.reviewerId?.id) {
      setReviewerId(storedUser.reviewerId.id);
    } else {
      setErrorMessage("Reviewer not found. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, []);

  // Fetch paper details
  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/papers?filters[id][$eq]=${id}&populate=*`
        );
        setPaperDetails(res.data.data[0]);
      } catch {
        setErrorMessage("Failed to load paper details.");
      }
    };
    fetchPaperDetails();
  }, [id]);

  // Fetch existing review
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!reviewerId || !id) return;
      try {
        const res = await axios.get(
          `http://localhost:1337/api/reviews?filters[paperId][$eq]=${id}&filters[reviewerId][$eq]=${reviewerId}&populate=*`
        );
        if (res.data.data.length > 0) {
          setExistingReview(res.data.data[0].attributes);
        }
      } catch (err) {
        console.error("Error fetching existing review:", err);
      }
    };
    fetchExistingReview();
  }, [reviewerId, id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      originality === "" ||
      significance === "" ||
      presentation === "" ||
      overall === "" ||
      !reviewComments
    ) {
      setErrorMessage("Please fill in all review fields.");
      return;
    }

    const reviewData = {
      paperId: id,
      reviewerId,
      comments: reviewComments,
      recommendation,
      originality: parseInt(originality),
      significance: parseInt(significance),
      presentation: parseInt(presentation),
      overall: parseInt(overall),
    };

    setLoading(true);
    try {
      await submitReview(reviewData);
      setSuccessMessage("Review submitted successfully.");
    } catch (err) {
      setErrorMessage("An error occurred while submitting the review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen px-4 py-10 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-6">Submit Your Review</h2>

          {paperDetails ? (
            <div className="mb-6 text-sm text-gray-700 space-y-1">
              <p><strong>Paper Id:</strong> {paperDetails.id}</p>
              <p><strong>Title:</strong> {paperDetails.Paper_Title}</p>
              <p><strong>Author:</strong> {paperDetails.Author}</p>
              <p><strong>Conference:</strong> {paperDetails.conference?.Conference_title}</p>
              <p><strong>Deadline:</strong> {paperDetails.conference?.Review_deadline}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading paper details...</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold mb-2">
              Rate the Following (Based on Agreement)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScoreSelect label="Originality" value={originality} onChange={setOriginality} />
              <ScoreSelect label="Significance of Topic" value={significance} onChange={setSignificance} />
              <ScoreSelect label="Presentation" value={presentation} onChange={setPresentation} />
              <ScoreSelect label="Overall Recommendation" value={overall} onChange={setOverall} />
            </div>

            <SelectField
              label="Recommendation"
              value={recommendation}
              onChange={setRecommendation}
              options={["Accept", "Minor Revision", "Major Revision", "Reject"]}
            />

            <div>
              <label className="block font-medium mb-1">Review Comments</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Write your detailed comments..."
                rows={5}
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold transition duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

// Reusable field components
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const ScoreSelect = ({ label, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select rating</option>
      {ratingOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label} ({opt.value})
        </option>
      ))}
    </select>
  </div>
);

export default SubmitReview;

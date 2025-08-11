import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layouts/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { submitReview } from "../../Services/reviewerService";

// Rating options
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

  const [dynamicScores, setDynamicScores] = useState({});
  const [reviewFields, setReviewFields] = useState([
    // fallback static fields (optional)
    { id: "originality", label: "Originality", enabled: true },
    { id: "significance", label: "Significance", enabled: true },
    { id: "presentation", label: "Presentation", enabled: true },
    { id: "overall", label: "Overall Recommendation", enabled: true }
  ]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load reviewerId
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    if (storedUser?.reviewerId?.id) {
      setReviewerId(storedUser.reviewerId.id);
    } else {
      setErrorMessage("Reviewer not found. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, []);

  // Fetch paper and conference details
  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const res = await axios.get(
          `https://amused-fulfillment-production.up.railway.app/api/papers?filters[id][$eq]=${id}&populate=conference`
        );
        const paper = res.data.data[0];
        setPaperDetails(paper);

        const conf = paper.conference;
        const fields = conf?.reviewFormFields;

        if (fields && Array.isArray(fields) && fields.length > 0) {
          setReviewFields(fields.filter(f => f.enabled));
        }
      } catch (err) {
        console.error(err);
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
          `https://amused-fulfillment-production.up.railway.app/api/reviews?filters[paperId][$eq]=${id}&filters[reviewerId][$eq]=${reviewerId}&populate=*`
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

  // Handle dynamic score change
  const handleScoreChange = (fieldId, value) => {
    setDynamicScores((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    for (const field of reviewFields) {
      if (!dynamicScores[field.id]) {
        setErrorMessage(`Please rate ${field.label}.`);
        return;
      }
    }
    if (!reviewComments) {
      setErrorMessage("Please add review comments.");
      return;
    }

    const reviewData = {
      paperId: id,
      reviewerId,
      comments: reviewComments,
      recommendation,
      ...Object.fromEntries(
        Object.entries(dynamicScores).map(([key, val]) => [key, parseInt(val)])
      ),
    };

    setLoading(true);
    try {
      await submitReview(reviewData);
      setSuccessMessage("Review submitted successfully.");
    } catch (err) {
      console.error(err);
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
              {reviewFields.map((field) => (
                <ScoreSelect
                  key={field.id}
                  label={field.label}
                  value={dynamicScores[field.id] || ""}
                  onChange={(value) => handleScoreChange(field.id, value)}
                />
              ))}
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
  disabled={loading || successMessage} // disable on success too
  className={`w-full mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold transition duration-200 ${
    loading || successMessage ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
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

// Reusable Components
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

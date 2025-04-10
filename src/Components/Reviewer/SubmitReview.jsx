import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layouts/Layout";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { submitReview } from "../../Services/reviewerService";

const SubmitReview = () => {
  const { id } = useParams(); // Get paperId from URL
  const navigate = useNavigate();
  const [reviewerId, setReviewerId] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);
  const [reviewComments, setReviewComments] = useState("");
  const [score, setScore] = useState("");
  const [recommendation, setRecommendation] = useState("Accept");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch reviewerId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    if (storedUser?.reviewerId?.id) {
      setReviewerId(storedUser.reviewerId.id);
    } else {
      setErrorMessage("Reviewer not found. Please log in.");
      // Optional: Redirect to login page
      setTimeout(() => navigate("/login"), 2000);
    }
  }, []);

  // Fetch paper details
  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/papers?filters[id][$eq]=${id}&populate=*`
        );
        setPaperDetails(response.data.data[0]); // Use single object instead of array
      } catch (error) {
        console.error("Error fetching paper details:", error);
        setErrorMessage("Failed to load paper details.");
      }
    };

    fetchPaperDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!reviewComments || !score || !reviewerId) {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const reviewData = {
      paperId: id,
      reviewerId: reviewerId,
      comments: reviewComments,
      score: parseInt(score),
      recommendation,
    };

    try {
      const response = await submitReview(reviewData);
      setSuccessMessage("Review submitted successfully.");
      console.log("Review sent:", response);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setErrorMessage("An error occurred while submitting the review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <FormCard>
          <FormHeader>Submit Your Review</FormHeader>

          {paperDetails ? (
            <div>
              <p>
                <strong>Paper Title:</strong> {paperDetails.Paper_Title}
              </p>
              <p>
                <strong>Author:</strong> {paperDetails.Author}
              </p>
              <p>
                <strong>Conference:</strong>{" "}
                {paperDetails.conference?.Conference_title}
              </p>
              <p>
                <strong>Review Deadline:</strong>{" "}
                {paperDetails.conference?.Review_deadline}
              </p>
            </div>
          ) : (
            <p>Loading paper details...</p>
          )}

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>Review Comments</Label>
              <Textarea
                rows="5"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Write your review comments here..."
              />
            </Field>

            <FieldRow>
              <Field>
                <Label>Score (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Recommendation</Label>
                <Select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                >
                  <option value="Accept">Accept</option>
                  <option value="Minor Revision">Minor Revision</option>
                  <option value="Major Revision">Major Revision</option>
                  <option value="Reject">Reject</option>
                </Select>
              </Field>
            </FieldRow>

            {errorMessage && <Message error>{errorMessage}</Message>}
            {successMessage && <Message success>{successMessage}</Message>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </SubmitButton>
          </Form>
        </FormCard>
      </PageWrapper>
    </Layout>
  );
};

export default SubmitReview;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const FormCard = styled.div`
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 12px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const FormHeader = styled.h2`
  font-size: 28px;
  color: #333333;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  margin-bottom: 20px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 20px;

  ${Field} {
    flex: 1;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555555;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  font-size: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  font-size: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  font-size: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  outline: none;
  background: #ffffff;
  appearance: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: #ffffff;
  padding: 14px 0;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab7;
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ error, success }) =>
    error ? "#d9534f" : success ? "#28a745" : "#333"};
  text-align: center;
`;

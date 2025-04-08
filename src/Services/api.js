// src/services/api.js
import axios from "axios";

// Set your correct backend URL here
const BASE_API_URL = "http://localhost:1337/api/organizers"; // Replace with the correct URL

// POST request to register an organizer
export const registerOrganizer = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/register`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error registering organizer", error);
    throw error; // Handle error accordingly
  }
};
export const loginOrganizer = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/login`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error login organizer", error);
    throw error; // Handle error accordingly
  }
};
export const loginAdmin = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/Adminlogin`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error login admin", error);
    throw error; // Handle error accordingly
  }
};
export const confirmReviewRequest = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/ConfirmReviewRequest`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error confirming review ", error);
    throw error; // Handle error accordingly
  }
};
export const rejectReviewRequest = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/RejectReviewRequest`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error rejecting review ", error);
    throw error; // Handle error accordingly
  }
};

export const assignSubOrganizerRole = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/AssignRole`, data);
    return response.data; 
  } catch (error) {
    console.error("Error assigning role ", error);
    throw error; // Handle error accordingly
  }
};
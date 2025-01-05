import axios from "axios";

// Set your correct backend URL here
const BASE_API_URL = "http://localhost:1337/api/author"; 

export const registerAuthor = async (data) => {
    try {
      console.log('datta',data);
      
      const response = await axios.post(`${BASE_API_URL}/register`, data);
      return response.data; // Return the response data (e.g., success message, etc.)
    } catch (error) {
      console.error("Error registering author", error);
      throw error; // Handle error accordingly
    }
  };
  export const loginAuthor = async (data) => {
    try {
      console.log('datta',data);
      
      const response = await axios.post(`${BASE_API_URL}/authorLogin`, data);
      return response.data; // Return the response data (e.g., success message, etc.)
    } catch (error) {
      console.error("Error login author", error);
      throw error; // Handle error accordingly
    }
  };
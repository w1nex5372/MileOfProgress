import axios from "axios";

// Function to set the authorization headers for Axios requests
export function setAuthHeaders(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// Function to handle API errors
export function handleApiError(error) {
  // Handle and display error messages
  console.log(error);
}

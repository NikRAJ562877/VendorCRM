import axios from 'axios';

// Set base URL
//const API_BASE_URL = 'http://localhost:5000/api'; // Update if needed
const API_BASE_URL='https://vendorcrm.onrender.com/api'
/**
 * apiClient - Makes API requests with axios
 * 
 * @param {Object} options - Options for the API request
 * @param {string} options.endpoint - The API endpoint
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} [options.method='GET'] - HTTP method
 * @param {any} [options.body=null] - The request body
 * @param {string|null} [options.token=null] - Optional token for authentication
 * @returns {Promise<any>} - The response data from the API
 */
const apiClient = async ({ endpoint, method = 'GET', body = null, token = null }) => {
  try {
    const isFormData = body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization if token exists
    };

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      ...(body && { data: body }), // ✅ send body directly (no stringify!)
    };

    const response = await axios(config);
    console.log('API Response:', response.data); // For debugging
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export default apiClient;

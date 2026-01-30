import axios from 'axios';
import { TriageRequest, TriageResponse, ErrorResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 35000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const triageFeedback = async (request: TriageRequest): Promise<TriageResponse> => {
  try {
    const response = await api.post<TriageResponse>('/triage', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data as ErrorResponse;
        throw new Error(errorData.message || 'An error occurred while processing the feedback');
      } else if (error.request) {
        // Network error - no response received
        throw new Error('Network error: Unable to connect to the server. Please check your connection.');
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        throw new Error('Request timeout: The server took too long to respond. Please try again.');
      }
    }
    
    // Unknown error
    throw new Error('An unexpected error occurred while processing the feedback');
  }
};

export default api;
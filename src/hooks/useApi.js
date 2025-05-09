// src/hooks/useApi.js
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

// GET method
export const useApiGet = (key, endpoint, options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(endpoint);

        // If response structure is unexpected, handle accordingly
        if (!response || !response.data) {
          throw new Error("No data received from API.");
        }

        if (response.data.content.List.length > 0) {
          return response.data.content.List;
        }

        return response.data; // only data is returned to the component
      } catch (error) {
        // Centralized error handler (optional)
        handleApiError(error);
        throw error; // important: re-throw so React Query handles it
      }
    },
    ...options,
  });
};

// POST / PUT / PATCH method
export const useApiMutation = (method = "post", options = {}) => {
  return useMutation({
    mutationFn: async ({ endpoint, payload }) => {
      const { data } = await axiosInstance[method](endpoint, payload);
      return data;
    },
    ...options,
  });
};


// Optional: Centralized error handler (log, toast, etc.)
function handleApiError(error) {
  if (!error.response) {
    console.error("Network error or no response from server", error);
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      console.warn("Bad Request – The server could not understand the request due to invalid syntax.");
      break;
    case 401:
      console.warn("Unauthorized – Authentication is required and has failed or not been provided.");
      break;
    case 403:
      console.warn("Forbidden – The client does not have access rights to the content.");
      break;
    case 404:
      console.warn("Not Found – The server can not find the requested resource.");
      break;
    case 409:
      console.warn("Conflict – The request conflicts with the current state of the server.");
      break;
    case 422:
      console.warn("Unprocessable Entity – The server understands the content type but was unable to process the contained instructions.");
      break;
    case 500:
      console.error("Internal Server Error – A generic error occurred on the server.");
      break;
    case 503:
      console.error("Service Unavailable – The server is not ready to handle the request.");
      break;
    default:
      console.error(`Unexpected status (${status}) – ${data?.message || error.message}`);
  }
  
}

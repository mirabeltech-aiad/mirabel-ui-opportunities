import axiosInstance from "@/services/axiosInstance";
import { API_GET_SITEWIDE_DEFAULTS } from "@/config/apiUrls";
// import { handleApiError } from "@/services/errorHandler";
export const getSiteWideList = async () => {
  try {
    const response = await axiosInstance.get(API_GET_SITEWIDE_DEFAULTS);
    if(response.data.content.Status === "Success"){
      return response.data.content.Data;
    }else{
      throw new Error(response.data.content.Message);
    }
  } catch (error) {
    // Centralized error handler (optional)
    // handleApiError(error);
    throw error; // important: re-throw so React Query handles it
  }
};


import axiosInstance from "@/services/axiosInstance";
import { API_REPORTS_DASHBOARD } from "@/config/apiUrls";

export const getReportsDashboard = async () => {
  try {
    const response = await axiosInstance.get(API_REPORTS_DASHBOARD+"/1");
    console.log("response", response.data.content.Data);
    if(response?.data?.content?.Status === "Success"){
      return response?.data?.content?.Data;
    }else{
      throw new Error(response?.data?.content?.Message);
    }
  } catch (error) {
    // Centralized error handler (optional)
    // handleApiError(error);
    throw error; // important: re-throw so React Query handles it
  }
};

// add post call too with same path and send edited object.
export const postReportsDashboard = async (data) => {
  try {
    const response = await axiosInstance.post(API_REPORTS_DASHBOARD, data);
    console.log("response", response);
    return response;
  } catch (error) {
    throw error;
  }
};


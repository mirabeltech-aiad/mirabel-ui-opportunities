import axiosInstance from "@/services/axiosInstance";
import { API_CIRCULATION_TYPES, API_GET_SITEWIDE_DEFAULTS, API_SAVE_SITEWIDE_SETTINGS } from "@/config/apiUrls";
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

export const getCirculationTypes = async () => {
  try {
    const response = await axiosInstance.get(API_CIRCULATION_TYPES);
    if (response.data.content.Status === "Success") {
      return response.data.content.List;
    } else {
      throw new Error(response.data.content.Message);
    }
  } catch (error) {
    throw error;
  }
};

export const saveSiteWideSettings = async (payload) => {
  try {
    const response = await axiosInstance.post(API_SAVE_SITEWIDE_SETTINGS, payload);
    console.log(response);
    if (response.data.content.Status === "Success") {
      return response.data.content;
    } else {
      throw new Error(response.data.content.Message);
    }
  } catch (error) {
    throw error;
  }
};
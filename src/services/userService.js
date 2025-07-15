import httpClient from './httpClient';
import {
  API_USER_ACCOUNT_GET,
  API_USER_ACCOUNT_UPDATE,
  API_USER_LIST_GET,
  API_USER_CREATE,
  API_USER_UPDATE,
  API_USER_DELETE,
} from '@/config/apiUrls';

/**
 * User Service for handling user-related API calls
 */

// Get current user account information
export const getUserAccount = async () => {
  try {
    const response = await httpClient.get(API_USER_ACCOUNT_GET);
    return response.data;
  } catch (error) {
    console.error('Error fetching user account:', error);
    throw error;
  }
};

// Update current user account
export const updateUserAccount = async (userData) => {
  try {
    const response = await httpClient.post(API_USER_ACCOUNT_UPDATE, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user account:', error);
    throw error;
  }
};

// Get list of users (for admin)
export const getUserList = async (params = {}) => {
  try {
    const response = await httpClient.get(API_USER_LIST_GET, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};

// Create new user (for admin)
export const createUser = async (userData) => {
  try {
    const response = await httpClient.post(API_USER_CREATE, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user (for admin)
export const updateUser = async (userId, userData) => {
  try {
    const response = await httpClient.post(API_USER_UPDATE, { ...userData, userId });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user (for admin)
export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(`${API_USER_DELETE}${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get user permissions
export const getUserPermissions = async () => {
  try {
    // This would typically come from the user account or a separate permissions endpoint
    const response = await httpClient.get('/services/User/Permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    // Return default permissions if API fails
    return {
      canManageUsers: false,
      canManageNavigation: false,
      canManageWebsite: false,
    };
  }
}; 
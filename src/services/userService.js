import axiosService from './axiosService';
import { getUserInfo } from '../utils/sessionHelpers';
import {
  API_USER_ACCOUNT_GET,
  API_USER_ACCOUNT_UPDATE,
  API_USER_LIST_GET,
  API_USER_CREATE,
  API_USER_UPDATE,
  API_USER_DELETE,
} from '../utils/apiUrls';

/**
 * User Service for handling user-related API calls
 */

// Get current user account information
export const getUserAccount = async () => {
  try {
    const response = await axiosService.get(API_USER_ACCOUNT_GET);
    return response;
  } catch (error) {
    console.error('Error fetching user account:', error);
    throw error;
  }
};

// Update current user account
export const updateUserAccount = async (userData) => {
  try {
    const response = await axiosService.post(API_USER_ACCOUNT_UPDATE, userData);
    return response;
  } catch (error) {
    console.error('Error updating user account:', error);
    throw error;
  }
};

// Get list of users (for admin)
export const getUserList = async (params = {}) => {
  try {
    const response = await axiosService.getWithParams(API_USER_LIST_GET, params);
    return response;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};

// Create new user (for admin)
export const createUser = async (userData) => {
  try {
    const response = await axiosService.post(API_USER_CREATE, userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user (for admin)
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosService.post(API_USER_UPDATE, { ...userData, userId });
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user (for admin)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosService.delete(`${API_USER_DELETE}${userId}`);
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get user permissions - Fixed to derive from session data
export const getUserPermissions = async () => {
  try {
    // Get user info from session (similar to ASP.NET SessionManager)
    const userInfo = getUserInfo();
    
    // Derive permissions from user role, similar to ASP.NET logic
    const isAdmin = userInfo?.isAdmin || false;
    const isSA = userInfo?.isSA || false;
    
    // Permission logic matching ASP.NET: IsAdmin || IsSA
    const hasAdminAccess = isAdmin || isSA;
    
    console.log('User permissions derived:', {
      userInfo,
      isAdmin,
      isSA,
      hasAdminAccess
    });
    
    return {
      canManageUsers: hasAdminAccess,
      canManageNavigation: hasAdminAccess,
      canManageWebsite: hasAdminAccess,
      isAdmin: isAdmin,
      isSA: isSA,
      hasAdminAccess: hasAdminAccess
    };
  } catch (error) {
    console.error('Error deriving user permissions:', error);
    // Return default permissions if session data is unavailable
    return {
      canManageUsers: false,
      canManageNavigation: false,
      canManageWebsite: false,
      isAdmin: false,
      isSA: false,
      hasAdminAccess: false
    };
  }
}; 
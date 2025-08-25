import { useEffect } from "react";
import { getSessionData } from "@/utils/sessionHelpers";
import axiosService from "@/services/axiosService";
import { AUTH_API, STATIC_URLS } from "@/utils";

const HEARTBEAT_INTERVAL = 10 * 60 * 1000; // 10 minutes
const SessionManager = () => {

  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  // Renew session
  const renew = async () => {
    try {
      // 1. Check if user session still exists
      const sessionData = getSessionData();
      const loginGUID = getCookieValue("LoginGUID");
      const isSystemUser = sessionData.IsSystem;
      // 2. Check for multiple logins
      if (!isSystemUser) {
        const response = await axiosService.post(
          AUTH_API.CHECK_ANOTHER_SESSION,
          loginGUID
        );
        if (response.Value === 1) {
          window.location.href = STATIC_URLS.LOGIN_ENDED;
          return;
        }

        // 3. Update logout time (keep session alive)
        await updateLogoutTime();
      }
    } catch (err) {
      console.error("Error during renew:", err);
    }
  };

  // Update logout time
  const updateLogoutTime = async () => {
    try {
      await axiosService.post(AUTH_API.UPDATE_LOGOUT_TIME);
    } catch (err) {
      console.error("Failed to update logout time:", err);
    }
  };

  // Start heartbeat
  useEffect(() => {
    // run once immediately on load
    renew();
    // then run every HEARTBEAT_INTERVAL
    const interval = setInterval(renew, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return null;
};
export default SessionManager;

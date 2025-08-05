import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setSessionValue, getUserInfo } from "../../utils/sessionHelpers";
import { useAuth } from "../../contexts/AuthContext";
import { isDevelopmentMode } from "../../utils/developmentHelper";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🔄 AuthCallback: Processing authentication callback...");

        // Get all URL parameters for debugging
        const allParams = {};
        for (const [key, value] of searchParams) {
          allParams[key] = value;
        }

        console.log("📍 AuthCallback: URL parameters:", allParams);
        setDebugInfo(allParams);

        // Check for token in URL parameters (various formats)
        const token =
          searchParams.get("token") ||
          searchParams.get("accesstoken") ||
          searchParams.get("access_token") ||
          searchParams.get("Token") ||
          searchParams.get("AccessToken");

        const domain =
          searchParams.get("domain") ||
          searchParams.get("d") ||
          searchParams.get("Domain");

        const fullDomain =
          searchParams.get("fullDomain") ||
          searchParams.get("fd") ||
          searchParams.get("FullDomain");

        const refreshToken =
          searchParams.get("refreshToken") ||
          searchParams.get("rt") ||
          searchParams.get("refresh_token");

        // Check for error parameters
        const authError =
          searchParams.get("error") || searchParams.get("Error");

        const errorDescription =
          searchParams.get("error_description") ||
          searchParams.get("errorDescription") ||
          searchParams.get("message");

        console.log("🔍 AuthCallback: Extracted parameters:", {
          hasToken: !!token,
          hasDomain: !!domain,
          hasFullDomain: !!fullDomain,
          hasRefreshToken: !!refreshToken,
          hasError: !!authError,
          tokenLength: token ? token.length : 0,
        });

        if (authError) {
          const errorMsg = errorDescription || authError;
          console.error("❌ AuthCallback: OAuth error received:", errorMsg);
          throw new Error(`Authentication error: ${errorMsg}`);
        }

        if (token) {
          console.log(
            "✅ AuthCallback: Token received, storing authentication data..."
          );

          // Store authentication tokens
          setSessionValue("Token", token);

          if (refreshToken) {
            setSessionValue("RefreshToken", refreshToken);
            console.log("✅ AuthCallback: Refresh token stored");
          }

          if (domain) {
            setSessionValue("Domain", domain);
            console.log("✅ AuthCallback: Domain stored:", domain);
          }

          if (fullDomain) {
            setSessionValue("FullDomain", fullDomain);
            console.log("✅ AuthCallback: Full domain stored:", fullDomain);
          }

          // Extract user info from token
          const userInfo = getUserInfo();
          console.log("👤 AuthCallback: User info extracted:", userInfo);

          if (userInfo) {
            updateUser(userInfo);
            console.log("✅ AuthCallback: User context updated");
          } else {
            console.warn(
              "⚠️ AuthCallback: Could not extract user info from token"
            );
          }

          setStatus("success");

          console.log(
            "🎉 AuthCallback: Authentication successful! Redirecting..."
          );

          // Redirect to intended page after a brief delay
          setTimeout(() => {
            const returnUrl =
              sessionStorage.getItem("auth_return_url") || "/opportunities";
            sessionStorage.removeItem("auth_return_url");
            console.log("🔄 AuthCallback: Redirecting to:", returnUrl);
            navigate(returnUrl, { replace: true });
          }, 1500);
        } else {
          console.log(
            "🔍 AuthCallback: No token in URL, checking existing authentication..."
          );

          // Check if we're already authenticated (maybe tokens are in localStorage)
          const existingToken = JSON.parse(
            localStorage.getItem("MMClientVars") || "{}"
          )?.Token;

          if (existingToken) {
            console.log(
              "✅ AuthCallback: Found existing token in localStorage"
            );

            const userInfo = getUserInfo();
            if (userInfo) {
              updateUser(userInfo);
              console.log(
                "✅ AuthCallback: Updated user context with existing token"
              );
            }

            setStatus("success");
            setTimeout(() => {
              const returnUrl =
                sessionStorage.getItem("auth_return_url") || "/opportunities";
              sessionStorage.removeItem("auth_return_url");
              console.log("🔄 AuthCallback: Redirecting to:", returnUrl);
              navigate(returnUrl, { replace: true });
            }, 1000);
          } else {
            console.error(
              "❌ AuthCallback: No token found in URL or localStorage"
            );

            // If we have URL parameters but no token, show them for debugging
            if (Object.keys(allParams).length > 0) {
              console.log(
                "🔍 AuthCallback: Available parameters but no recognized token:",
                allParams
              );
              setError(
                `No authentication token found. Available parameters: ${Object.keys(
                  allParams
                ).join(", ")}`
              );
            } else {
              setError("No authentication token received from login system");
            }

            setStatus("error");
          }
        }
      } catch (err) {
        console.error("❌ AuthCallback: Authentication callback error:", err);
        setError(err.message);
        setStatus("error");
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, updateUser]);

 
  return (
    <></>
  );
};

export default AuthCallback;

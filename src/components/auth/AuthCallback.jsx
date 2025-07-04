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

  const renderStatus = () => {
    switch (status) {
      case "processing":
        return (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Processing authentication...</p>
            {import.meta.env.DEV && Object.keys(debugInfo).length > 0 && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs w-full">
                <div className="font-semibold mb-2">Debug Info:</div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-600 mb-2">Authentication successful!</p>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-600 mb-2">Authentication failed</p>
            <p className="text-gray-600 text-sm text-center mb-4">{error}</p>

            {import.meta.env.DEV && (
              <div className="mb-4 p-3 bg-red-50 rounded text-xs w-full">
                <div className="font-semibold mb-2 text-red-700">
                  Debug Info:
                </div>
                <div>
                  <strong>Current URL:</strong> {window.location.href}
                </div>
                <div>
                  <strong>URL Parameters:</strong> {JSON.stringify(debugInfo)}
                </div>
                <div>
                  <strong>LocalStorage MMClientVars:</strong>{" "}
                  {localStorage.getItem("MMClientVars") || "null"}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (isDevelopmentMode()) {
                    // In development mode, just reload instead of redirecting to login
                    window.location.reload();
                  } else {
                    navigate("/login");
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isDevelopmentMode() ? "Reload" : "Try Again"}
              </button>

              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear & Reload
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600">Mirabel</span>
          </div>
        </div>

        {renderStatus()}
      </div>
    </div>
  );
};

export default AuthCallback;

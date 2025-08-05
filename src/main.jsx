import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../src/styles/index.css";
import { initializeDesignSystem } from "./lib/styleManager";

// Initialize design system on app start - ensures knowledge base styling is applied
initializeDesignSystem();

// Listen for auth logout events from axiosService interceptor (matches mirabel.mm.ui pattern)
window.addEventListener("auth:logout", (event) => {

  // Import session helpers dynamically to clear authentication data
  import("./utils/sessionHelpers.js").then(({ resetSession }) => {
    import("./utils/authHelpers.js").then(({ getMainLoginUrl }) => {
      import("./utils/developmentHelper.js").then(({ isDevelopmentMode }) => {
        resetSession();

        // In development mode, don't redirect to login - just reload
        if (isDevelopmentMode()) {
          console.log(
            "🔧 Development mode: Reloading instead of redirecting to login"
          );
          window.location.reload();
          return;
        }

        // Redirect to login page using the helper function (production only)
        const returnUrl = window.location.href;
        const mainLoginUrl = getMainLoginUrl(returnUrl);
        console.log("🔄 Main: Redirecting to login:", mainLoginUrl);
        window.location.href = mainLoginUrl;
      });
    });
  });
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize global error handling
import { setupGlobalErrorHandling } from './utils/errorHandling';
setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(<App />);

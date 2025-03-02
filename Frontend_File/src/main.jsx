import { createRoot } from "react-dom/client";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "./index.css";
import "./styles/style.css"
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundry.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
   <ErrorBoundary>
     <App />
   </ErrorBoundary>
  </AuthProvider>
);




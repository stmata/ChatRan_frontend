import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import { DARK_THEME } from "./constants/themeConstants";
import ProtectedRoutes from "./routes/ProtectedRoute";
import "./App.scss";
import { ChatSessionProvider } from "./context/ChatSessionContext";

function App() {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <AppProvider>
      <ChatSessionProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </Router>
      </ChatSessionProvider>
    </AppProvider>
  );
}

export default App;

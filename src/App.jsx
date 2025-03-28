import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import EditorPage from "./pages/EditorPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("loggedIn")
  );

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("loggedIn", "true");
    } else {
      localStorage.removeItem("loggedIn");
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/workflows"
          element={
            isAuthenticated ? (
              <WorkflowsPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/editor"
          element={
            isAuthenticated ? (
              <EditorPage />
            ) : (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route path="*" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContest";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Default page */}
            <Route index element={<Navigate to="topics" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="topics" element={<Topics />} />
            <Route path="progress" element={<Progress />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

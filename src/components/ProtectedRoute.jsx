import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContest";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" replace />;
}

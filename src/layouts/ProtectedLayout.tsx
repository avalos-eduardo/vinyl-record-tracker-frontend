import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

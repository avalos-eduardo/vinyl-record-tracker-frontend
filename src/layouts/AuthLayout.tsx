import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="flex flex-col h-screen lg:flex-row-reverse">
      <Outlet />
    </main>
  );
}

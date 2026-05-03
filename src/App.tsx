import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";

export function Welcome() {
  return <p>Welcome to Vinyl Record Collection Tracker</p>;
}

export function Home() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <p>Home</p>
      <button onClick={handleLogout} className="underline">
        Logout
      </button>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";

export function Welcome() {
  return <p>Welcome to Vinyl Record Collection Tracker</p>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="collection" element={<Collection />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  );
}

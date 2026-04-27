import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export function Welcome() {
  return <p>Welcome to Vinyl Record Collection Tracker</p>;
}

export function Home() {
  return <p>Home</p>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="home" element={<Home />} />
    </Routes>
  );
}

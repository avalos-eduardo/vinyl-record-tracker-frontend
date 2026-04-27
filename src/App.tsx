import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";

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
      </Route>
      <Route path="home" element={<Home />} />
    </Routes>
  );
}

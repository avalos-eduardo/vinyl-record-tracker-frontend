import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import VinylDetail from "./pages/VinylDetail";
import MasterReleases from "./pages/MasterReleases";
import WishlistMasterReleases from "./pages/WishlistMasterReleases";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

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
          <Route
            path="collection/masters/:masterId"
            element={<MasterReleases />}
          />
          <Route
            path="collection/masters/:masterId/releases/:id"
            element={<VinylDetail />}
          />
          <Route path="wishlist" element={<Wishlist />} />
          <Route
            path="wishlist/masters/:masterId"
            element={<WishlistMasterReleases />}
          />
          <Route
            path="wishlist/masters/:masterId/releases/:id"
            element={<VinylDetail />}
          />
        </Route>
      </Routes>
      <Toaster position="bottom-center" />
    </>
  );
}

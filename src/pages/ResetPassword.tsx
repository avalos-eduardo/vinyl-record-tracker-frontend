import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const passwordLongEnough = password.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordLongEnough) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword: password }),
        },
      );

      if (response.status === 400) {
        const data = await response.json();
        setError(
          data.error ||
            "Invalid or expired reset link. Please request a new one.",
        );
        return;
      }

      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      localStorage.removeItem("token");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <h1 className="text-4xl font-bold">Password Reset!</h1>
        <p className="mt-4 text-center">
          Your password has been successfully reset.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="font-bold rounded-2xl py-2 px-10 mt-4 cursor-pointer bg-cyan-800 text-white"
        >
          Log In
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold">Reset Password</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter your new password below.
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password-input" className="font-bold">
            New Password:
          </label>
          <br />
          <input
            id="password-input"
            name="password"
            type="password"
            placeholder="New Password"
            className="border px-2 w-75"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password.length > 0 && (
            <p
              className={`text-sm mt-1 ${passwordLongEnough ? "text-green-500" : "text-red-500"}`}
            >
              {passwordLongEnough
                ? "Password is long enough"
                : "Password must be at least 8 characters"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password-input" className="font-bold">
            Confirm New Password:
          </label>
          <br />
          <input
            id="confirm-password-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            className="border px-2 w-75"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordsMatch && (
            <p className="text-sm mt-1 text-green-500">Passwords match</p>
          )}
          {passwordsDontMatch && (
            <p className="text-sm mt-1 text-red-500">Passwords do not match</p>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="font-bold rounded-2xl py-2 px-10 mt-2 cursor-pointer bg-cyan-800 text-white disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </>
  );
}

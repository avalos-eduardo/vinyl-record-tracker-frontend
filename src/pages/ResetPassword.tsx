import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import recordPlayer from "../assets/record-player.jpg";

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
        <aside className="h-55 md:flex-2 md:h-auto">
          <img
            src={recordPlayer}
            className="h-full md:h-screen w-full object-cover md:sticky md:top-0"
          />
        </aside>

        <section className="md:flex-3 flex-auto h-auto py-5 px-5 md:py-10 md:px-10">
          <h1 className="my-4 md:my-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
            Password Reset!
          </h1>
          <p className="text-sm text-gray-500 max-w-3/5 md:max-w-4/5 md:text-lg">
            Your password has been successfully reset.
          </p>
          <div className="w-full h-10 my-2 md:w-4/5 md:h-14">
            <button
              onClick={() => navigate("/login")}
              className="font-bold w-full h-full rounded-lg py-2 px-10 mt-2 cursor-pointer bg-[#1E1E1E] text-[#D9D9D9]"
            >
              Log In
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <aside className="h-55 md:flex-2 md:h-auto">
        <img
          src={recordPlayer}
          className="h-full md:h-screen w-full object-cover md:sticky md:top-0"
        />
      </aside>

      <section className="md:flex-3 flex-auto h-auto py-5 px-5 md:py-10 md:px-10">
        <h1 className="my-4 md:my-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 max-w-3/5 md:max-w-4/5 md:text-lg">
          Enter your new password below.
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="*:mt-3">
          <div>
            <label
              htmlFor="password-input"
              className="font-semibold text-sm md:text-lg"
            >
              New Password:
            </label>
            <br />
            <input
              id="password-input"
              name="password"
              type="password"
              placeholder=""
              className="px-3 w-full h-10 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-14 md:rounded-lg mt-1 md:text-lg"
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
            <label
              htmlFor="confirm-password-input"
              className="font-semibold text-sm md:text-lg"
            >
              Confirm New Password:
            </label>
            <br />
            <input
              id="confirm-password-input"
              name="confirmPassword"
              type="password"
              placeholder=""
              className="px-3 w-full h-10 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-14 md:rounded-lg mt-1 md:text-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordsMatch && (
              <p className="text-sm mt-1 text-green-500">Passwords match</p>
            )}
            {passwordsDontMatch && (
              <p className="text-sm mt-1 text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="w-full h-10 my-2 md:w-4/5 md:h-14">
            <button
              type="submit"
              disabled={loading}
              className="font-bold w-full h-full rounded-lg py-2 px-10 mt-2 cursor-pointer bg-[#1E1E1E] text-[#D9D9D9]"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

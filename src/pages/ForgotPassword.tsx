import { useState } from "react";
import { Link } from "react-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Always show success message regardless of whether
      // the email exists or not - mirrors the backend's
      // email enumeration prevention
      setSubmitted(true);
    } catch (err) {
      // Even on network error, show the same message
      // to avoid leaking information
      setSubmitted(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <h1 className="text-4xl font-bold">Check Your Email</h1>
        <p className="mt-4 text-center">
          If an account exists for <span className="font-bold">{email}</span>,
          you will receive a password reset link shortly.
        </p>
        <p className="mt-2 text-center text-sm text-gray-500">
          Didn't receive an email? Check your spam folder or try again.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 underline cursor-pointer"
        >
          Try a different email
        </button>
        <p className="mt-2">
          Remember your password?{" "}
          <Link to="/login" className="underline cursor-pointer">
            Log in!
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold">Forgot Password</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email-input" className="font-bold">
            Email Address:
          </label>
          <br />
          <input
            id="email-input"
            name="email"
            type="email"
            placeholder="Email"
            className="border px-2 w-75"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="font-bold rounded-2xl py-2 px-10 mt-2 cursor-pointer bg-cyan-800 text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>

      <p className="mt-2">
        Remember your password?{" "}
        <Link to="/login" className="underline cursor-pointer">
          Log in!
        </Link>
      </p>
      <p className="mt-1">
        Don't have an account?{" "}
        <Link to="/sign-up" className="underline cursor-pointer">
          Sign up!
        </Link>
      </p>
    </>
  );
}

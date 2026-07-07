import { useState } from "react";
import { Link } from "react-router";
import recordPlayer from "../assets/record-player.jpg";
import vinylRecord from "../assets/vinyl-record.png";

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
        <aside className="h-55 md:flex-2 md:h-auto">
          <img
            src={recordPlayer}
            className="h-full md:h-screen w-full object-cover md:sticky md:top-0"
          />
        </aside>

        <section className="md:flex-3 flex-auto h-auto py-5 px-5 md:py-10 md:px-10">
          <h1 className="my-4 md:my-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
            Check Your Email
          </h1>
          <p className="text-sm text-gray-500 max-w-3/5 md:max-w-4/5 md:text-lg">
            If an account exists for <span className="font-bold">{email}</span>,
            you will receive a password reset link shortly.
          </p>
          <p className="text-sm text-gray-500 max-w-3/5 md:max-w-4/5 md:text-lg mt-5">
            Didn't receive an email? Check your spam folder or try again.
          </p>
          <div className="text-left text-sm font-semibold *:pt-2 md:text-lg">
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
        <div className="flex items-center">
          <img
            src={vinylRecord}
            className="h-9 w-9 rounded-lg md:h-15 md:w-15 md:rounded-2xl"
          />
          <p className="text-lg pl-3 font-semibold text-[#3C3B3B] md:text-3xl md:pl-4">
            Vinyl Record Tracker
          </p>
        </div>

        <h1 className="my-4 md:mt-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 max-w-3/5 md:max-w-4/5 md:text-lg">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="md:*:mt-3">
          <div>
            <label htmlFor="email-input" className="font-bold">
              Email Address:
            </label>
            <br />
            <input
              id="email-input"
              name="email"
              type="email"
              placeholder=""
              className="px-3 w-full h-10 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-14 md:rounded-lg mt-1 md:text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full h-10 my-2 md:w-4/5 md:h-14">
            <button
              type="submit"
              disabled={loading}
              className="font-bold w-full h-full rounded-lg py-2 px-10 mt-2 cursor-pointer bg-[#1E1E1E] text-[#D9D9D9]"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm font-semibold mt-5 *:pt-2 md:text-left md:text-lg">
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
        </div>
      </section>
    </>
  );
}

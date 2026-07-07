import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        setError("Invalid email or password.");
        return;
      }

      const success = await login();

      if (success) {
        navigate("/home");
      }
    } catch (err) {
      setError("Something went wrong, please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: "demo@vinyltracker.com",
            password: "demo123",
          }),
        },
      );

      if (!response.ok) {
        setError("Demo login failed. Please try again.");
        return;
      }

      await login();
      navigate("/home");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside className="h-55 md:flex-2 md:h-auto">
        <img
          src="./src/assets/record-player.jpg"
          className="h-full md:h-screen w-full object-cover md:sticky md:top-0"
        />
      </aside>

      <section className="md:flex-3 flex-auto h-auto py-5 px-5 md:py-10 md:px-10">
        <div className="flex items-center">
          <img
            src="./src/assets/vinyl-record.png"
            className="h-9 w-9 rounded-lg md:h-15 md:w-15 md:rounded-2xl"
          />
          <p className="text-lg pl-3 font-semibold text-[#3C3B3B] md:text-3xl md:pl-4">
            Vinyl Record Tracker
          </p>
        </div>
        <h1 className="my-4 md:my-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
          Hello!
          <br /> Welcome back.
        </h1>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="md:*:mt-3">
          <div>
            <label
              htmlFor="email-input"
              className="font-semibold text-sm md:text-lg"
            >
              Enter Email:
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
          <div>
            <label
              htmlFor="password-input"
              className="font-semibold text-sm md:text-lg"
            >
              Enter Password:
            </label>
            <br />
            <input
              id="password-input"
              name="password"
              type="password"
              placeholder=""
              className="px-2 w-full h-10 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-14 md:rounded-lg mt-1 md:text-lg"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full h-10 my-2 md:w-4/5 md:h-14">
            <button
              type="submit"
              disabled={loading}
              className="font-bold w-full h-full rounded-lg py-2 px-10 mt-2 cursor-pointer bg-[#1E1E1E] text-[#D9D9D9]"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm font-semibold mt-5 *:pt-2 md:text-left md:text-lg">
          <Link to="/forgot-password" className="underline cursor-pointer">
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link to="/sign-up" className="underline cursor-pointer">
              Sign up!
            </Link>
          </p>
          <button
            onClick={handleDemoLogin}
            className="underline cursor-pointer text-cyan-800"
          >
            Continue with demo account
          </button>
        </div>
      </section>
    </>
  );
}

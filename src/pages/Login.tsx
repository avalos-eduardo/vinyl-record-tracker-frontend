import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        setError("Invalid email or password.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setError("Something went wrong, please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Login</h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email-input" className="font-bold">
            Enter Email Address:
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
        <div>
          <label htmlFor="password-input" className="font-bold">
            Enter Password:
          </label>
          <br />
          <input
            id="password-input"
            name="password"
            type="password"
            placeholder="Password"
            className="border px-2 w-75"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="font-bold rounded-2xl py-2 px-10 mt-2 cursor-pointer bg-cyan-800 text-white"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </div>
      </form>
      <Link to="/forgot-password" className="underline cursor-pointer">
        Forgot Password?
      </Link>
      <p>
        Don't have an account?{" "}
        <Link to="/sign-up" className="underline cursor-pointer">
          Sign up!
        </Link>
      </p>
      <p>Continue to website with a pre-seeded demo account!</p>
    </>
  );
}

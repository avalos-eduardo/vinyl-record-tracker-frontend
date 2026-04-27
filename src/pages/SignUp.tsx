import { useState } from "react";
import { useNavigate, Link } from "react-router";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const passwordLongEnough = password.length >= 8;

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 409) {
        setError("An account with this email already exists.");
        return;
      }

      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Sign Up</h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="font-bold">
            Your Name
          </label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            className="border px-2 w-75"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            Create Password:
          </label>
          <br />
          <input
            id="password-input"
            name="password"
            type="password"
            placeholder="Password"
            className="border px-2 w-75"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordsMatch && (
            <p className="text-sm mt-1 text-green-500">Passwords match</p>
          )}
          {passwordsDontMatch && (
            <p className="text-sm mt-1 text-red-500">Passwords do not match</p>
          )}
        </div>
        <div>
          <label htmlFor="confirm-password-input" className="font-bold">
            Confirm Password:
          </label>
          <br />
          <input
            id="confirm-password-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="border px-2 w-75"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={loading || !passwordLongEnough || !passwordsMatch}
            className="font-bold rounded-2xl py-2 px-10 mt-2 cursor-pointer bg-cyan-800 text-white disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <p className="mt-2">
        Already have an account?{" "}
        <Link to="/login" className="underline cursor-pointer">
          Log in!
        </Link>
      </p>
    </>
  );
}

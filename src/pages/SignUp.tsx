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
      <aside className="h-55 md:flex-2 md:h-auto">
        <img
          src="./src/assets/record-player.jpg"
          className="h-full md:h-screen w-full object-cover md:sticky md:top-0"
        />
      </aside>

      <section className="md:flex-3 flex-auto h-auto py-5 px-5 md:py-10 md:px-10">
        <div className="flex items-center">
          <img
            src="./src/assets/vinyl-record.jpeg"
            className="h-9 w-9 rounded-lg md:h-15 md:w-15 md:rounded-2xl"
          />
          <p className="text-lg pl-3 font-semibold text-[#3C3B3B] md:text-3xl md:pl-4">
            Vinyl Record Tracker
          </p>
        </div>

        <h1 className="my-4 md:my-8 text-[#718b74] font-semibold text-4xl md:text-5xl lg:text-6xl md:max-w-4/5">
          New Here?
          <br />
          Sign Up!
        </h1>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="name" className="font-semibold text-sm md:text-lg">
              Your Name:
            </label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              placeholder=""
              className="px-3 w-full h-8 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-10 md:rounded-lg mt-1 md:text-lg"
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
              placeholder=""
              className="px-3 w-full h-8 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-10 md:rounded-lg mt-1 md:text-lg"
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
              placeholder=""
              className="px-3 w-full h-8 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-10 md:rounded-lg mt-1 md:text-lg"
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
              Confirm Password:
            </label>
            <br />
            <input
              id="confirm-password-input"
              name="confirmPassword"
              type="password"
              placeholder=""
              className="px-3 w-full h-8 rounded-lg bg-[#D9D9D9] md:w-4/5 md:h-10 md:rounded-lg mt-1 md:text-lg"
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
          <div className="w-full h-8 my-2 md:w-4/5 md:h-10">
            <button
              type="submit"
              disabled={loading || !passwordLongEnough || !passwordsMatch}
              className="font-bold w-full h-full rounded-lg py-1 px-10 mt-2 cursor-pointer bg-[#1E1E1E] text-[#D9D9D9] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm font-semibold mt-5 md:text-left md:text-lg">
          <p className="mt-2">
            Already have an account?{" "}
            <Link to="/login" className="underline cursor-pointer">
              Log in!
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

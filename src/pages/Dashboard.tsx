import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <p>Dashboard</p>
      <button onClick={handleLogout} className="underline">
        Logout
      </button>
    </>
  );
}

import { useAuth } from "../context/AuthContext";
import Widget from "../components/Widget";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="grid grid-cols-1 md:grid-cols-[1fr_3fr] min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="bg-[#718b74] flex flex-col items-center justify-center gap-4 p-6">
        <div className="h-28 w-28 rounded-full p-5 object-cover border-0 bg-white">
          <img src="./src/assets/user.svg" className="h-auto" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-2xl italic">
            Hello, {user?.name ?? "..."}!
          </p>
        </div>
        <button
          onClick={logout}
          className="text-white underline text-sm cursor-pointer"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <section className="bg-[#efefef] p-8 flex flex-col gap-6">
        {/* Stat widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget label="Total Records" accentColor="#718b74" />
          <Widget label="Collection Median Valuation" accentColor="#6b85b5" />
          <Widget label="Artist Most Collected" accentColor="#b56b6b" />
        </div>

        {/* Chart widget */}
        <Widget
          label=""
          accentColor="#3C3B3B"
          height="min-h-64"
          className="flex-1"
        />
      </section>
    </main>
  );
}

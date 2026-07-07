import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Widget from "../components/Widget";
import ConditionChart from "../components/ConditionChart";
import DecadeChart from "../components/DecadeChart";
import userSVG from "../assets/user.svg";

interface CollectionGrowthPoint {
  date: string;
  cumulativeCount: number;
}

interface Stats {
  totalRecords: number;
  wishlistCount: number;
  uniqueArtists: number;
  mostCollectedArtist: string | null;
  conditionBreakdown: Record<string, number>;
  decadeBreakdown: Record<string, number>;
  genreBreakdown: Record<string, number>;
  collectionGrowth: CollectionGrowthPoint[];
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stats`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch stats.");
        const data = await res.json();
        setStats(data);
      } catch {
        setError("Could not load stats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="grid grid-cols-1 md:grid-cols-[1fr_3fr] min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="bg-[#718b74] flex flex-col items-center justify-center gap-4 p-6">
        <div className="h-28 w-28 rounded-full p-5 object-cover border-0 bg-white">
          <img src={userSVG} className="h-auto" />
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
        {isLoading && (
          <p className="font-mono text-[#3C3B3B] text-center mt-20">
            Loading stats...
          </p>
        )}

        {error && (
          <p className="font-mono text-red-500 text-center mt-20">{error}</p>
        )}

        {!isLoading && !error && stats && (
          <>
            {/* Stat widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Widget
                label="Total Records"
                value={stats.totalRecords}
                accentColor="#718b74"
              />
              <Widget
                label="Most Collected Artist"
                value={stats.mostCollectedArtist ?? "—"}
                accentColor="#6b85b5"
              />
              <Widget
                label="Unique Artists"
                value={stats.uniqueArtists}
                accentColor="#b56b6b"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <p className="font-mono font-bold text-[#3C3B3B]">
                  Condition Breakdown
                </p>
                <div className="h-80 flex justify-center items-center">
                  <ConditionChart data={stats.conditionBreakdown} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <p className="font-mono font-bold text-[#3C3B3B]">
                  Records by Decade
                </p>
                <div className="h-80 flex justify-center items-center">
                  <DecadeChart data={stats.decadeBreakdown} />
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

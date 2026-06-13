import { useEffect, useRef, useState } from "react";
import VinylCard from "../components/VinylCard";
import SortDropdown, { type SortState } from "../components/SortDropdown";
import AddVinylModal from "../components/AddVinylModal";

interface DiscogsMaster {
  id: number;
  masterId: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseCount: number;
}

export default function Collection() {
  const [masters, setMasters] = useState<DiscogsMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    field: "title",
    direction: "asc",
  });
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchMasters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/masters`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch collection.");
      const data = await response.json();
      setMasters(data);
    } catch {
      setError("Could not load your collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sorted = [...masters].sort((a, b) => {
    const dir = sortState.direction === "asc" ? 1 : -1;
    switch (sortState.field) {
      case "title":
        return a.title.localeCompare(b.title) * dir;
      case "artist":
        return a.artist.localeCompare(b.artist) * dir;
      default:
        return 0;
    }
  });

  const filtered = sorted.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.artist.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] p-6 md:p-10">
      {/* Header row */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-[#3C3B3B] max-w-[65%]">
            My Vinyl Collection
          </h1>
          <p className="text-sm text-[#718b74] font-mono mt-1">
            {masters.length} {masters.length === 1 ? "album" : "albums"} in your
            collection
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#3C3B3B] text-white font-mono font-bold px-5 py-2 rounded-full text-xs hover:bg-[#555] transition-colors cursor-pointer"
        >
          Add Vinyl
        </button>
      </div>

      {/* Search + Sort row */}
      <div className="flex gap-3 mt-4 mb-6">
        <div className="flex items-center flex-1 bg-white rounded-full px-4 py-2 shadow-sm">
          <svg
            className="w-4 h-4 text-gray-400 mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs font-mono text-[#3C3B3B] w-full"
          />
        </div>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className="bg-[#3C3B3B] text-white font-mono font-bold px-5 py-2 rounded-full text-sm hover:bg-[#555] transition-colors cursor-pointer"
          >
            Sort
          </button>
          {sortOpen && (
            <SortDropdown
              sortState={sortState}
              onChange={setSortState}
              onClose={() => setSortOpen(false)}
            />
          )}
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <p className="font-mono text-[#3C3B3B] text-center mt-20">
          Loading your collection...
        </p>
      )}
      {error && (
        <p className="font-mono text-red-500 text-center mt-20">{error}</p>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="font-mono text-[#3C3B3B] text-center mt-20">
          {` No albums found. Add some vinyls! :) `}
        </p>
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((master) => (
            <VinylCard
              key={master.id}
              masterId={master.id}
              albumArt={master.imageUrl}
              title={master.title}
              artist={master.artist}
              releaseCount={master.releaseCount}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddVinylModal
          onClose={() => setShowAddModal(false)}
          onAdded={fetchMasters}
        />
      )}
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import VinylCard from "../components/VinylCard";
import SortDropdown, { type SortState } from "../components/SortDropdown";

interface DiscogsRelease {
  id: number;
  discogsId: number;
  title: string;
  artist: string;
  label: string;
  genre: string;
  format: string;
  releaseYear: number;
  imageUrl: string;
  lastSyncedAt: string;
}

interface UserVinyl {
  id: number;
  condition: string;
  notes: string;
  addedAt: string;
  release: DiscogsRelease;
}

export default function Collection() {
  const [vinyls, setVinyls] = useState<UserVinyl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    field: "addedAt",
    direction: "desc",
  });
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/collection`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        if (!response.ok) throw new Error("Failed to fetch collection.");
        const data = await response.json();
        setVinyls(data);
      } catch {
        setError("Could not load your collection. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVinyls();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sorted = [...vinyls].sort((a, b) => {
    const dir = sortState.direction === "asc" ? 1 : -1;
    switch (sortState.field) {
      case "title":
        return a.release.title.localeCompare(b.release.title) * dir;
      case "artist":
        return a.release.artist.localeCompare(b.release.artist) * dir;
      case "year":
        return (a.release.releaseYear - b.release.releaseYear) * dir;
      case "addedAt":
        return (
          (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()) * dir
        );
    }
  });

  const filtered = sorted.filter(
    (v) =>
      v.release.title.toLowerCase().includes(search.toLowerCase()) ||
      v.release.artist.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] p-6 md:p-10">
      {/* Header row */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-[#3C3B3B]">
            My Vinyl Collection
          </h1>
          <p className="text-sm text-[#718b74] font-mono mt-1">
            You own: {vinyls.length} Vinyl{vinyls.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="bg-[#3C3B3B] text-white font-mono font-bold px-5 py-2 rounded-full text-sm hover:bg-[#555] transition-colors cursor-pointer">
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
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm font-mono text-[#3C3B3B] w-full"
          />
        </div>

        {/* Sort button + dropdown */}
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
          No vinyls found. Add some more!
        </p>
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((vinyl) => (
            <VinylCard
              key={vinyl.id}
              albumArt={vinyl.release.imageUrl}
              title={vinyl.release.title}
              artist={vinyl.release.artist}
              year={vinyl.release.releaseYear}
              condition={vinyl.condition}
              dateAdded={vinyl.addedAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}

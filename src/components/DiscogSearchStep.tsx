import { useState } from "react";
import type { DiscogsSearchResult } from "./AddVinylModal";

interface DiscogSearchStepProps {
  onSelect: (result: DiscogsSearchResult) => void;
}

const PER_PAGE = 10;

export default function DiscogSearchStep({ onSelect }: DiscogSearchStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DiscogsSearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const runSearch = async (searchPage: number, append: boolean) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/discogs/search?query=${encodeURIComponent(query)}&page=${searchPage}`,
        { credentials: "include" },
      );
      if (!response.ok) throw new Error("Search failed.");
      const data: DiscogsSearchResult[] = await response.json();

      setResults((prev) => (append ? [...prev, ...data] : data));
      setHasMore(data.length === PER_PAGE);
      setPage(searchPage);
    } catch {
      setError("Could not reach Discogs. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    setSearched(true);
    await runSearch(1, false);
    setIsSearching(false);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await runSearch(page + 1, true);
    setIsLoadingMore(false);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* Search input */}
      <div className="flex gap-2">
        <div className="flex items-center flex-1 bg-[#f0f0f0] rounded-full px-4 py-2">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-transparent outline-none text-xs font-mono text-[#3C3B3B] w-full"
            autoFocus
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="bg-[#3C3B3B] text-white font-mono font-bold px-5 py-2 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {error && (
        <p className="font-mono text-red-500 text-sm text-center">{error}</p>
      )}
      {!error && searched && results.length === 0 && !isSearching && (
        <p className="font-mono text-[#3C3B3B] text-sm text-center mt-4">
          No results found for "{query}".
        </p>
      )}
      {results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((result) => (
            <li key={result.discogsId}>
              <button
                onClick={() => onSelect(result)}
                className="cursor-pointer w-full flex gap-3 items-center p-3 rounded-xl hover:bg-[#f0f0f0] transition-colors text-left"
              >
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="h-14 w-14 rounded-lg object-cover shrink-0 bg-gray-100"
                />
                <div className="flex flex-col min-w-0">
                  <p className="font-mono font-semibold text-sm text-[#3C3B3B] truncate">
                    {result.title}
                  </p>
                  <p className="font-mono text-sm text-[#3C3B3B] truncate">
                    {result.artist}
                  </p>
                  <p className="font-mono text-xs text-gray-400">
                    {result.releaseYear}
                    {result.label ? ` · ${result.label}` : ""}
                    {result.vinylColor ? ` · ${result.vinylColor}` : ""}
                    {result.formatDescriptions
                      ? ` · ${result.formatDescriptions.map((result) => ` ${result}`)}`
                      : ""}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="cursor-pointer w-full bg-[#f0f0f0] text-[#3C3B3B] font-mono font-semibold py-2.5 rounded-full text-sm hover:bg-[#e4e4e4] transition-colors disabled:opacity-40"
        >
          {isLoadingMore ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

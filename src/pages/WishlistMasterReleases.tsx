import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { VinylCondition } from "../components/AddVinylModal";

const CONDITIONS: { value: VinylCondition; label: string }[] = [
  { value: "MINT", label: "Mint" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

interface DiscogsRelease {
  id: number;
  title: string;
  artist: string;
  label: string;
  format: string;
  releaseYear: number;
  imageUrl: string;
}

interface UserVinyl {
  id: number;
  condition: string;
  notes: string;
  addedAt: string;
  release: DiscogsRelease;
}

export default function WishlistMasterReleases() {
  const { masterId } = useParams<{ masterId: string }>();
  const navigate = useNavigate();

  const [releases, setReleases] = useState<UserVinyl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<
    Record<number, VinylCondition>
  >({});
  const [isManaging, setIsManaging] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/wishlist/masters/${masterId}/releases`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch releases.");
        const data = await res.json();
        setReleases(data);
      } catch {
        setError("Could not load releases. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReleases();
  }, [masterId]);

  const handleDelete = async (e: React.MouseEvent, vinylId: number) => {
    e.stopPropagation();
    setDeletingId(vinylId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${vinylId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to delete.");
      setReleases((prev) => {
        const updated = prev.filter((v) => v.id !== vinylId);
        if (updated.length === 0) navigate("/wishlist");
        return updated;
      });
    } catch {
      // silently fail for now = could add an error toast here later
    } finally {
      setDeletingId(null);
    }
  };

  const handleMoveToCollection = async (vinylId: number) => {
    const condition = selectedCondition[vinylId];
    if (!condition) return;

    setMovingId(vinylId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${vinylId}/move-to-collection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ condition }),
        },
      );
      if (!res.ok) throw new Error("Failed to move to collection.");
      setReleases((prev) => {
        const updated = prev.filter((v) => v.id !== vinylId);
        if (updated.length === 0) navigate("/wishlist");
        return updated;
      });
    } catch {
      // could add error toast here
    } finally {
      setMovingId(null);
    }
  };

  const handleClearCondition = () => {
    setSelectedCondition({});
  };

  if (isLoading)
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] flex items-center justify-center">
        <p className="font-mono text-[#3C3B3B]">Loading releases...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] flex items-center justify-center">
        <p className="font-mono text-red-500">{error}</p>
      </main>
    );

  const first = releases[0];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] p-6 md:p-10">
      <button
        onClick={() => navigate("/wishlist")}
        className="flex items-center gap-2 font-mono text-sm text-[#3C3B3B] hover:text-[#718b74] transition-colors mb-6 cursor-pointer"
      >
        ← Back to Wishlist
      </button>

      {first && (
        <section className="flex items-center gap-5 mb-8">
          <img
            src={first.release.imageUrl}
            alt={first.release.title}
            className="h-20 w-20 rounded-xl object-cover shadow-md shrink-0"
          />
          <div>
            <h1 className="font-mono font-bold text-2xl text-[#3C3B3B]">
              {first.release.title}
            </h1>
            <p className="font-mono text-[#718b74]">{first.release.artist}</p>
            <p className="font-mono text-sm text-gray-400 mt-0.5">
              {releases.length} {releases.length === 1 ? "release" : "releases"}{" "}
              on your wishlist
            </p>
          </div>
        </section>
      )}

      <div className="pb-4">
        <button
          onClick={() => setIsManaging((prev) => !prev)}
          className={`font-mono font-bold px-5 py-2 rounded-full text-xs transition-colors cursor-pointer text-white ${
            isManaging
              ? "bg-[#718b74] hover:bg-[#5f7a62]"
              : "bg-[#3C3B3B] hover:bg-[#555]"
          }`}
        >
          {isManaging ? "Done" : "Manage Collection"}
        </button>
      </div>

      <section className="flex flex-col gap-3">
        {releases.map((vinyl) => (
          <div
            key={vinyl.id}
            className={`relative bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm transition-shadow ${isManaging ? "" : "hover:shadow-md cursor-pointer"}`}
          >
            {/* Delete button */}
            {isManaging && (
              <button
                onClick={(e) => handleDelete(e, vinyl.id)}
                disabled={deletingId === vinyl.id}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#962020] text-white flex items-center justify-center shadow-md hover:bg-[#a94b4b] transition-colors disabled:opacity-40 cursor-pointer z-10"
                aria-label="Remove release"
              >
                {deletingId === vinyl.id ? (
                  <span className="text-xs leading-none">...</span>
                ) : (
                  <span className="text-sm leading-none font-bold">−</span>
                )}
              </button>
            )}
            {/* Release info row */}
            <div
              onClick={() => {
                if (!isManaging) {
                  navigate(
                    `/wishlist/masters/${masterId}/releases/${vinyl.id}`,
                  );
                }
              }}
              className="flex items-center gap-4 cursor-pointer"
            >
              <img
                src={vinyl.release.imageUrl}
                alt={vinyl.release.title}
                className="h-16 w-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
                  {vinyl.release.format ?? "Unknown Format"} —{" "}
                  {vinyl.release.releaseYear ?? "Unknown Year"}
                </p>
                <p className="font-mono text-sm text-gray-400">
                  {vinyl.release.label ?? "Unknown Label"}
                </p>
              </div>
            </div>

            {/* Condition selector */}
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs text-gray-400">
                Select condition to move to collection:
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {CONDITIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setSelectedCondition((prev) => ({
                        ...prev,
                        [vinyl.id]: value,
                      }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-colors cursor-pointer
                      ${
                        selectedCondition[vinyl.id] === value
                          ? "bg-[#718b74] text-white border-[#718b74]"
                          : "bg-white text-[#3C3B3B] border-gray-200 hover:border-[#718b74]"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Move to Collection button */}
            <div className="flex gap-3 *:w-full">
              <button
                onClick={() => handleMoveToCollection(vinyl.id)}
                disabled={!selectedCondition[vinyl.id] || movingId === vinyl.id}
                className="bg-[#718b74] text-white font-mono font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#5f7a62] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {movingId === vinyl.id ? "Moving..." : "Move to Collection"}
              </button>
              <button
                onClick={handleClearCondition}
                disabled={!selectedCondition[vinyl.id] || movingId === vinyl.id}
                className="bg-[#3C3B3B] px-5 text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

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
}

interface UserVinyl {
  id: number;
  condition: string;
  notes: string;
  addedAt: string;
  release: DiscogsRelease;
}

export default function MasterReleases() {
  const { masterId } = useParams<{ masterId: string }>();
  const navigate = useNavigate();

  const [releases, setReleases] = useState<UserVinyl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/collection/masters/${masterId}/releases`,
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
        `${import.meta.env.VITE_API_URL}/collection/${vinylId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to delete.");
      setReleases((prev) => {
        const updated = prev.filter((v) => v.id !== vinylId);
        if (updated.length === 0) navigate("/collection");
        return updated;
      });
    } catch {
      // silently fail for now — could add an error toast here later
    } finally {
      setDeletingId(null);
    }
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
        onClick={() => navigate("/collection")}
        className="flex items-center gap-2 font-mono text-sm text-[#3C3B3B] hover:text-[#718b74] transition-colors mb-6 cursor-pointer"
      >
        ← Back to Collection
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
              in your collection
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
            onClick={() => {
              if (!isManaging)
                navigate(
                  `/collection/masters/${masterId}/releases/${vinyl.id}`,
                );
            }}
            className={`relative bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm transition-shadow
              ${isManaging ? "wiggle" : "hover:shadow-md cursor-pointer"}
            `}
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

            <img
              src={vinyl.release.imageUrl}
              alt={vinyl.release.title}
              className="h-16 w-16 rounded-lg object-cover shrink-0"
            />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
                {vinyl.release.title ?? "Unknown Title"} —{" "}
                {vinyl.release.releaseYear ?? "Unknown Year"}
              </p>
              <p className="font-mono text-sm text-gray-400">
                {vinyl.release.label ?? "Unknown Label"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-mono text-xs bg-[#f0f0f0] text-[#3C3B3B] px-3 py-1 rounded-full">
                {vinyl.condition[0] +
                  vinyl.condition.slice(1).toLowerCase().replace(/_/g, " ")}
              </span>
              <p className="font-mono text-xs text-gray-400">
                Added {new Date(vinyl.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

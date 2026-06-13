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
  discogsId: number;
  title: string;
  artist: string;
  label: string;
  genre: string;
  format: string;
  releaseYear: number;
  imageUrl: string;
  lastSyncedAt: string;
  vinylColor: string | null;
  formatDescriptions: string[];
  barcode: string | null;
}

interface UserVinyl {
  id: number;
  condition: VinylCondition;
  notes: string;
  addedAt: string;
  release: DiscogsRelease;
}

interface PriceHistory {
  id: number;
  lowestPrice: number;
  medianPrice: number;
  highestPrice: number;
  recordedAt: string;
}

export default function VinylDetail() {
  const { id, masterId } = useParams<{ id: string; masterId: string }>();
  const navigate = useNavigate();

  const [vinyl, setVinyl] = useState<UserVinyl | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [condition, setCondition] = useState<VinylCondition | "">("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSetSaveSuccess] = useState(false);
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/collection/masters/${masterId}/releases/${id}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Vinyl not found.");
        const data: UserVinyl = await res.json();
        setVinyl(data);
        setCondition(data.condition);
        setNotes(data.notes ?? "");

        // Fetch price history using the release id
        const priceRes = await fetch(
          `${import.meta.env.VITE_API_URL}/discogs/prices/${data.release.id}`,
          { credentials: "include" },
        );
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setPriceHistory(priceData);
        }
      } catch {
        setError("Could not load this vinyl. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, masterId]);

  const handleSave = async () => {
    if (!condition) return;
    setIsSaving(true);
    setSaveError(null);
    setSetSaveSuccess(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ condition, notes: notes.trim() || null }),
        },
      );
      if (!res.ok) throw new Error("Failed to save changes.");
      const updated: UserVinyl = await res.json();
      setVinyl(updated);
      setSetSaveSuccess(true);
      setTimeout(() => setSetSaveSuccess(false), 2500);
    } catch {
      setSaveError("Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshPrice = async () => {
    if (!vinyl) return;
    setIsRefreshingPrice(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/${vinyl.id}/refresh-price`,
        { method: "POST", credentials: "include" },
      );
      if (res.ok) {
        const priceRes = await fetch(
          `${import.meta.env.VITE_API_URL}/discogs/prices/${vinyl.release.id}`,
          { credentials: "include" },
        );
        if (priceRes.ok) setPriceHistory(await priceRes.json());
      }
    } finally {
      setIsRefreshingPrice(false);
    }
  };

  const chartData = priceHistory.map((p) => ({
    date: new Date(p.recordedAt).toLocaleDateString(),
    Low: p.lowestPrice,
    Median: p.medianPrice,
    High: p.highestPrice,
  }));

  const isDirty =
    vinyl && (condition !== vinyl.condition || notes !== (vinyl.notes ?? ""));

  if (isLoading)
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] flex items-center justify-center">
        <p className="font-mono text-[#3C3B3B]">Loading...</p>
      </main>
    );

  if (error || !vinyl)
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] flex items-center justify-center">
        <p className="font-mono text-red-500">{error ?? "Vinyl not found."}</p>
      </main>
    );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f0f0f0] p-6 md:p-10">
      <button
        onClick={() => navigate(`/collection/masters/${masterId}/`)}
        className="flex items-center gap-2 font-mono text-sm text-[#3C3B3B] hover:text-[#718b74] transition-colors mb-6 cursor-pointer"
      >
        ← Back to Releases
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        {/* Left column — art, condition, notes */}
        <div className="flex flex-col gap-5">
          <img
            src={vinyl.release.imageUrl}
            alt={`${vinyl.release.title} by ${vinyl.release.artist}`}
            className="w-full aspect-square object-cover rounded-2xl shadow-md"
          />

          {/* Condition */}
          <div className="flex flex-col gap-2">
            <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
              Condition
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCondition(value)}
                  className={`py-2 px-3 rounded-xl text-sm font-mono border transition-colors text-left cursor-pointer
                    ${
                      condition === value
                        ? "bg-[#718b74] text-white border-[#718b74]"
                        : "bg-white text-[#3C3B3B] border-gray-200 hover:border-[#718b74]"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
              Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Original pressing, slight scuff on side B..."
              rows={4}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm font-mono text-[#3C3B3B] outline-none resize-none focus:ring-2 focus:ring-[#718b74] border border-gray-200"
            />
          </div>

          {/* Save button */}
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#3C3B3B] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
          {saveSuccess && (
            <p className="font-mono text-[#718b74] text-sm text-center">
              Changes saved!
            </p>
          )}
          {saveError && (
            <p className="font-mono text-red-500 text-sm text-center">
              {saveError}
            </p>
          )}
        </div>

        {/* Right column — vinyl info + price chart */}
        <div className="flex flex-col gap-6">
          {/* Vinyl info card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h1 className="font-mono font-bold text-2xl text-[#3C3B3B]">
              {vinyl.release.artist} - {vinyl.release.title}
            </h1>

            {vinyl.release.formatDescriptions?.length > 0 && (
              <div className="flex flex-wrap gap-2 -mt-1">
                {vinyl.release.formatDescriptions.map((desc) => (
                  <span
                    key={desc}
                    className="font-mono text-xs bg-[#f0f0f0] text-[#3C3B3B] px-3 py-1 rounded-full"
                  >
                    {desc}
                  </span>
                ))}
              </div>
            )}

            {[
              { label: "Artist", value: vinyl.release.artist },
              { label: "Label", value: vinyl.release.label },
              { label: "Genre", value: vinyl.release.genre },
              { label: "Format", value: vinyl.release.format },
              { label: "Color", value: vinyl.release.vinylColor },
              { label: "Barcode", value: vinyl.release.barcode },
              { label: "Year", value: vinyl.release.releaseYear },

              {
                label: "Added",
                value: new Date(vinyl.addedAt).toLocaleDateString(),
              },
            ].map(
              ({ label, value }) =>
                value && (
                  <div
                    key={label}
                    className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                  >
                    <p className="font-mono text-sm text-gray-400">{label}</p>
                    <p className="font-mono text-sm font-semibold text-[#3C3B3B]">
                      {value}
                    </p>
                  </div>
                ),
            )}
          </div>

          {/* Price history chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-[#3C3B3B]">
                Price History
              </p>
              <button
                onClick={handleRefreshPrice}
                disabled={isRefreshingPrice}
                className="text-xs font-mono text-[#718b74] hover:underline disabled:opacity-40"
              >
                {isRefreshingPrice ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {chartData.length === 0 ? (
              <p className="font-mono text-sm text-gray-400 text-center py-8">
                No price data yet. Hit Refresh to fetch from Discogs.
              </p>
            ) : (
              " "
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

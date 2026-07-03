import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import type { VinylCondition } from "../components/AddVinylModal";
import { handleApiError, ToastedError } from "../utils/api";
import toast from "react-hot-toast";

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
  country: string | null;
}

interface UserVinyl {
  id: number;
  condition: VinylCondition;
  notes: string;
  addedAt: string;
  wishlist: boolean;
  release: DiscogsRelease;
}

export default function VinylDetail() {
  const { id, masterId } = useParams<{ id: string; masterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlistContext = location.pathname.includes("/wishlist/");

  const [vinyl, setVinyl] = useState<UserVinyl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [condition, setCondition] = useState<VinylCondition | "">("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [duplicateConflict, setDuplicateConflict] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const context = isWishlistContext ? "wishlist" : "collection";
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/${context}/masters/${masterId}/releases/${id}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Vinyl not found.");
        const data: UserVinyl = await res.json();
        setVinyl(data);
        setCondition(data.condition ?? "");
        setNotes(data.notes ?? "");
      } catch {
        setError("Could not load this vinyl. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, masterId, isWishlistContext]);

  const handleSave = async () => {
    if (!condition) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ condition, notes: notes.trim() || null }),
        },
      );
      if (!response.ok) {
        await handleApiError(response);
        throw new Error("Failed to save changes.");
      }
      const updated: UserVinyl = await response.json();
      setVinyl(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e: unknown) {
      if (!(e instanceof ToastedError)) {
        toast.error("Could not save changes. Try again later.");
      }
      setSaveError("Could not save changes. Try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveToCollection = async () => {
    if (!condition) return;
    setIsSaving(true);
    setSaveError(null);
    setDuplicateConflict(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${id}/move-to-collection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ condition }),
        },
      );
      if (response.status === 409) {
        setDuplicateConflict(true);
        throw new Error("You already own this release.");
      }
      if (!response.ok) {
        const err = await response.json();
        await handleApiError(response);
        throw new Error(err.error || "Failed to move to collection.");
      }
      navigate(`/collection/masters/${masterId}`);
    } catch (e: unknown) {
      if (!(e instanceof ToastedError)) {
        toast.error("Could not move to collection. Try again later.");
        setSaveError((e as Error).message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromWishlist = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        await handleApiError(response);
        return;
      }

      // Check if any releases remain under this master on the wishlist
      const remainingRes = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/masters/${masterId}/releases`,
        { credentials: "include" },
      );
      const remaining = remainingRes.ok ? await remainingRes.json() : [];

      if (remaining.length === 0) {
        navigate("/wishlist");
      } else {
        navigate(`/wishlist/masters/${masterId}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCondition = () => {
    setCondition("");
  };

  const handleSaveWishlistNotes = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            condition: vinyl?.condition ?? null,
            notes: notes.trim() || null,
          }),
        },
      );
      if (!res.ok) {
        await handleApiError(res);
      }
      const updated: UserVinyl = await res.json();
      setVinyl(updated);
      setNotes(updated.notes ?? "");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e: unknown) {
      if (!(e instanceof ToastedError)) {
        toast.error("Could not save notes. Try again later.");
      }
      setSaveError("Could not save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty =
    !isWishlistContext &&
    vinyl &&
    (condition !== vinyl.condition || notes !== (vinyl.notes ?? ""));

  const isNotesDirty = notes !== (vinyl?.notes ?? "");

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
      {/* Back button */}
      <button
        onClick={() =>
          navigate(
            isWishlistContext
              ? `/wishlist/masters/${masterId}`
              : `/collection/masters/${masterId}`,
          )
        }
        className="flex items-center gap-2 font-mono text-sm text-[#3C3B3B] hover:text-[#718b74] transition-colors mb-6 cursor-pointer"
      >
        ← Back to {isWishlistContext ? "Wishlist" : "Releases"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <img
            src={vinyl.release.imageUrl}
            alt={`${vinyl.release.title} by ${vinyl.release.artist}`}
            className="w-full aspect-square object-cover rounded-2xl shadow-md"
          />

          {/* Notes — always shown */}
          <div className="flex flex-col gap-2">
            <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
              Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isWishlistContext
                  ? "e.g. Want the peach vinyl variant..."
                  : "e.g. Original pressing, slight scuff on side B..."
              }
              rows={4}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm font-mono text-[#3C3B3B] outline-none resize-none focus:ring-2 focus:ring-[#718b74] border border-gray-200"
            />
          </div>

          {/* Action section — branches on wishlist vs collection */}
          {isWishlistContext ? (
            <>
              {/* Save notes independently while still on wishlist */}
              {isNotesDirty && (
                <button
                  onClick={handleSaveWishlistNotes}
                  disabled={isSaving}
                  className="w-full bg-[#3C3B3B] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </button>
              )}
              {saveSuccess && (
                <p className="font-mono text-[#718b74] text-sm text-center">
                  Notes saved!
                </p>
              )}

              {/* Condition selector for moving to collection */}
              <div className="flex flex-col gap-2">
                <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
                  Select condition to move to collection
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

              <button
                onClick={handleMoveToCollection}
                disabled={!condition || isSaving}
                className="w-full bg-[#718b74] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#5f7a62] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? "Moving..." : "Move to Collection"}
              </button>
              <button
                onClick={handleClearCondition}
                disabled={!condition || isSaving}
                className="w-full bg-[#3C3B3B] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear Selection
              </button>

              {saveError && (
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-red-500 text-sm text-center">
                    {saveError}
                  </p>
                  {duplicateConflict && (
                    <button
                      onClick={handleRemoveFromWishlist}
                      disabled={isSaving}
                      className="w-full bg-[#962020] text-white font-mono font-bold py-2.5 rounded-full text-sm hover:bg-[#a94b4b] transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Remove from Wishlist
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Condition selector */}
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

              {isDirty && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[#3C3B3B] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 cursor-pointer"
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
            </>
          )}
        </div>

        {/* Right column */}
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
              { label: "Country", value: vinyl.release.country },
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
        </div>
      </div>
    </main>
  );
}

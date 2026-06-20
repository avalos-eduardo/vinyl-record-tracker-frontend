import { useState } from "react";
import type { DiscogsSearchResult, VinylCondition } from "./AddVinylModal";

const CONDITIONS: { value: VinylCondition; label: string }[] = [
  { value: "MINT", label: "Mint" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

interface ConditionNotesStepProps {
  result: DiscogsSearchResult;
  onClose: () => void;
  onAdded: () => void;
  endpoint: "/collection" | "/wishlist";
  requiresCondition: boolean;
}

export default function ConditionNotesStep({
  result,
  onClose,
  onAdded,
  endpoint,
  requiresCondition,
}: ConditionNotesStepProps) {
  const [condition, setCondition] = useState<VinylCondition | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (requiresCondition && !condition) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            discogsId: result.discogsId,
            condition: condition || null,
            notes: notes.trim() || null,
          }),
        },
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add vinyl.");
      }
      onAdded();
      onClose();
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Selected release preview */}
      <div className="flex gap-3 items-center p-3 bg-[#f0f0f0] rounded-xl">
        <img
          src={result.imageUrl}
          alt={result.title}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
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
          </p>
        </div>
      </div>

      {/* Condition selector */}
      {requiresCondition && (
        <div className="flex flex-col gap-2">
          <label className="font-mono font-semibold text-sm text-[#3C3B3B]">
            Condition <span className="text-red-400">*</span>
          </label>
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
      )}

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="font-mono font-semibold text-sm text-[#3C3B3B]">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            requiresCondition
              ? "e.g. Original pressing, slight scuff on side B..."
              : "e.g. Want the peach vinyl variant..."
          }
          rows={3}
          className="w-full bg-[#f0f0f0] rounded-xl px-4 py-3 text-sm font-mono text-[#3C3B3B] outline-none resize-none focus:ring-2 focus:ring-[#718b74]"
        />
      </div>

      {error && <p className="font-mono text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={(requiresCondition && !condition) || isSubmitting}
        className="w-full bg-[#3C3B3B] text-white font-mono font-bold py-3 rounded-full text-sm hover:bg-[#555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting
          ? "Adding..."
          : requiresCondition
            ? "Add to Collection"
            : "Add to Wishlist"}
      </button>
    </div>
  );
}

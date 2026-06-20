import { useState } from "react";
import DiscogSearchStep from "./DiscogSearchStep";
import ConditionNotesStep from "./ConditionNotesStep";

export type VinylCondition = "MINT" | "VERY_GOOD" | "GOOD" | "FAIR" | "POOR";

export interface DiscogsSearchResult {
  discogsId: string;
  title: string;
  artist: string;
  label: string;
  genre: string;
  format: string;
  releaseYear: number;
  imageUrl: string;
  vinylColor: string;
  formatDescriptions: string[];
}

interface AddVinylModalProps {
  onClose: () => void;
  onAdded: () => void;
  endpoint: "/collection" | "/wishlist";
  requiresCondition: boolean;
}

export default function AddVinylModal({
  onClose,
  onAdded,
  endpoint,
  requiresCondition,
}: AddVinylModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedResult, setSelectedResult] =
    useState<DiscogsSearchResult | null>(null);

  const handleSelectResult = (result: DiscogsSearchResult) => {
    setSelectedResult(result);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="text-[#3C3B3B] hover:text-[#718b74] transition-colors cursor-pointer"
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <h2 className="font-mono font-bold text-[#3C3B3B] text-lg">
              {step === 1
                ? "Search Discogs"
                : requiresCondition
                  ? "Add to Collection"
                  : "Add to Wishlist"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Step indicator */}
            <div className="flex gap-1.5">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    s === step ? "bg-[#718b74]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#3C3B3B] transition-colors text-xl leading-none cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="overflow-y-auto flex-1">
          {step === 1 && <DiscogSearchStep onSelect={handleSelectResult} />}
          {step === 2 && selectedResult && (
            <ConditionNotesStep
              result={selectedResult}
              onClose={onClose}
              onAdded={onAdded}
              endpoint={endpoint}
              requiresCondition={requiresCondition}
            />
          )}
        </div>
      </div>
    </div>
  );
}

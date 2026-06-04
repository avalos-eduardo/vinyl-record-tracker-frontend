export type SortField = "artist" | "year" | "addedAt" | "title";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface SortDropdownProps {
  sortState: SortState;
  onChange: (sort: SortState) => void;
  onClose: () => void;
}

const SORT_OPTIONS: {
  field: SortField;
  ascLabel: string;
  descLabel: string;
}[] = [
  { field: "title", ascLabel: "Title (A → Z)", descLabel: "Title (Z → A)" },
  { field: "artist", ascLabel: "Artist (A → Z)", descLabel: "Artist (Z → A)" },
  {
    field: "year",
    ascLabel: "Year (Oldest first)",
    descLabel: "Year (Newest first)",
  },
  {
    field: "addedAt",
    ascLabel: "Date Added (Oldest first)",
    descLabel: "Date Added (Newest first)",
  },
];

export default function SortDropdown({
  sortState,
  onChange,
  onClose,
}: SortDropdownProps) {
  const handleSelect = (field: SortField, direction: SortDirection) => {
    onChange({ field, direction });
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 z-10 bg-white rounded-xl shadow-lg overflow-hidden w-50 md:w-64 border border-gray-100">
      {SORT_OPTIONS.map(({ field, ascLabel, descLabel }) => (
        <div key={field}>
          {(["asc", "desc"] as SortDirection[]).map((dir) => {
            const isActive =
              sortState.field === field && sortState.direction === dir;
            return (
              <button
                key={dir}
                onClick={() => handleSelect(field, dir)}
                className={`w-full text-left px-4 py-2.5 text-xs md:text-sm font-mono transition-colors cursor-pointer
                  ${
                    isActive
                      ? "bg-[#718b74] text-white"
                      : "text-[#3C3B3B] hover:bg-gray-50"
                  }`}
              >
                {dir === "asc" ? ascLabel : descLabel}
              </button>
            );
          })}
          <div className="border-t border-gray-100 last:hidden" />
        </div>
      ))}
    </div>
  );
}

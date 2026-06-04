interface VinylCardProps {
  albumArt: string;
  title: string;
  artist: string;
  year: number;
  condition: string;
  dateAdded: string;
}

export default function VinylCard({
  albumArt,
  title,
  artist,
  year,
  condition,
  dateAdded,
}: VinylCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out cursor-pointer">
      <img
        src={albumArt}
        alt={`${title} by ${artist}`}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3 flex flex-col items-center text-center gap-0.5 *:cursor-text">
        <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
          {title}
        </p>
        <p className="font-mono text-sm text-[#3C3B3B]">{artist}</p>
        <p className="font-mono text-sm text-[#3C3B3B]">{year}</p>
        <p className="font-mono text-sm text-[#3C3B3B]">
          Condition: {condition}
        </p>
        <p className="font-mono text-sm text-[#3C3B3B]">
          Date Added: {dateAdded}
        </p>
      </div>
    </div>
  );
}

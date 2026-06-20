import { useNavigate } from "react-router";

interface VinylCardProps {
  masterId: number;
  albumArt: string;
  title: string;
  artist: string;
  releaseCount: number;
  context?: "collection" | "wishlist";
}

export default function VinylCard({
  masterId,
  albumArt,
  title,
  artist,
  releaseCount,
  context = "collection",
}: VinylCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/${context}/masters/${masterId}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out cursor-pointer"
    >
      <img
        src={albumArt}
        alt={`${title} by ${artist}`}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3 flex flex-col items-center text-center gap-0.5">
        <p className="font-mono font-semibold text-sm text-[#3C3B3B]">
          {title}
        </p>
        <p className="font-mono text-sm text-[#3C3B3B]">{artist}</p>
        <p className="font-mono text-xs text-[#718b74] mt-0.5">
          {releaseCount} {releaseCount === 1 ? "release" : "releases"}{" "}
          {context === "wishlist" ? "wishlisted" : "owned"}
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";

interface HeatmapImage {
  src: string;
  label: string;
  color: "team-a" | "team-b" | "combined";
}

const heatmaps: HeatmapImage[] = [
  {
    src: "/heatmap_combined.png",
    label: "Combined Player Heatmap",
    color: "combined",
  },
  {
    src: "/heatmap_team_a.png",
    label: "Team A Heatmap",
    color: "team-a",
  },
  {
    src: "/heatmap_team_b.png",
    label: "Team B Heatmap",
    color: "team-b",
  },
];

function HeatmapCard({ src, label, color }: HeatmapImage) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const borderColor =
    color === "team-a"
      ? "border-team-a/30"
      : color === "team-b"
        ? "border-team-b/30"
        : "border-card-border";

  return (
    <div
      className={`rounded-xl border ${borderColor} bg-card overflow-hidden`}
    >
      <div className="border-b border-card-border px-4 py-2.5">
        <h4 className="text-sm font-semibold text-white">{label}</h4>
      </div>
      <div className="relative p-3">
        {isLoading && !hasError && (
          <div className="flex aspect-[4/3] items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-team-a border-t-transparent" />
          </div>
        )}
        {hasError ? (
          <div className="flex aspect-[4/3] items-center justify-center">
            <p className="text-xs text-navy-400 italic">
              Heatmap image not available
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={label}
            className={`aspect-[4/3] w-full rounded-lg object-contain ${isLoading ? "hidden" : ""}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function Heatmaps() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {heatmaps.map((hm) => (
        <HeatmapCard key={hm.src} {...hm} />
      ))}
    </div>
  );
}

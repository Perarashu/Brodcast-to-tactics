import { Maximize2 } from "lucide-react";
import type { Player } from "../lib/dataLoader";
import { PlayerDot } from "./PlayerDot";

interface CourtViewProps {
  players: Player[];
}

export function CourtView({ players }: CourtViewProps) {
  const teamAPlayers = players.filter((p) => p.team === "A");
  const teamBPlayers = players.filter((p) => p.team === "B");

  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-card-border px-4 py-2.5">
        <h3 className="text-sm font-semibold text-white">
          Top-Down Court View
        </h3>
        <button className="text-navy-300 transition-colors hover:text-white">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative aspect-[1.8/1] bg-navy-800 p-4">
        {/* Court outline */}
        <div className="absolute inset-4 rounded border-2 border-white/20 bg-court-green/20">
          {/* Half-court line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />

          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />

          {/* Three-point arcs - left side */}
          <svg
            className="absolute left-0 top-0 h-full w-1/2"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 10,20 Q 30,50 10,80"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
          </svg>
          {/* Three-point arcs - right side */}
          <svg
            className="absolute right-0 top-0 h-full w-1/2"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 90,20 Q 70,50 90,80"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
          </svg>

          {/* Key/paint areas */}
          <div className="absolute left-0 top-1/3 h-1/3 w-[15%] border border-white/15" />
          <div className="absolute right-0 top-1/3 h-1/3 w-[15%] border border-white/15" />

          {/* Player positions */}
          {teamAPlayers.map((p) => (
            <PlayerDot
              key={p.id}
              player={p}
              color="team-a"
              size="md"
            />
          ))}
          {teamBPlayers.map((p) => (
            <PlayerDot
              key={p.id}
              player={p}
              color="team-b"
              size="md"
            />
          ))}

          {/* Formation labels */}
          <div className="absolute left-2 top-2 rounded bg-team-a/20 px-1.5 py-0.5 text-[9px] font-medium text-team-a-light">
            1-3-1 Zone
          </div>
          <div className="absolute right-2 top-2 rounded bg-team-b/20 px-1.5 py-0.5 text-[9px] font-medium text-team-b-light">
            Man-to-Man
          </div>
        </div>
      </div>
    </div>
  );
}

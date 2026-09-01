import type { Player } from "../lib/dataLoader";

interface PlayerDotProps {
  player: Player;
  color: "team-a" | "team-b";
  size?: "sm" | "md" | "lg";
}

export function PlayerDot({ player, color, size = "md" }: PlayerDotProps) {
  const sizeClasses = {
    sm: "h-3 w-3 text-[6px]",
    md: "h-5 w-5 text-[8px]",
    lg: "h-7 w-7 text-[10px]",
  };

  const bgClasses = {
    "team-a": "bg-team-a border-team-a-light shadow-team-a/40",
    "team-b": "bg-team-b border-team-b-light shadow-team-b/40",
  };

  return (
    <div
      className={`absolute flex items-center justify-center rounded-full border font-bold text-white shadow-lg transition-all duration-700 ease-out ${sizeClasses[size]} ${bgClasses[color]}`}
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      title={`#${player.jersey} ${player.label}`}
    >
      {player.jersey}
    </div>
  );
}

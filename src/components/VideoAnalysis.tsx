import { Maximize2 } from "lucide-react";

export function VideoAnalysis() {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-card-border px-4 py-2.5">
        <h3 className="text-sm font-semibold text-white">Video Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="rounded bg-team-a/20 px-2 py-0.5 text-[10px] font-medium text-team-a-light">
            LIVE
          </span>
          <button className="text-navy-300 transition-colors hover:text-white">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="bg-navy-800">
        <video
          src="/game_30fps.mp4"
          controls
          muted
          playsInline
          preload="metadata"
          className="aspect-video w-full object-contain"
        />
      </div>
    </div>
  );
}

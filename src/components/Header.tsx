import { Upload, Activity } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-card-border bg-navy-900/80 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-team-a/15">
          <Activity className="h-5 w-5 text-team-a" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Broadcast-to-Tactics
          </h1>
          <p className="text-xs text-navy-300">
            Automated Team Formation Analyzer
          </p>
        </div>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-team-a px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-team-a-light active:bg-team-a-dark">
        <Upload className="h-4 w-4" />
        Upload Video
      </button>
    </header>
  );
}

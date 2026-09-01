import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { VideoAnalysis } from "./components/VideoAnalysis";
import { CourtView } from "./components/CourtView";
import { PlayerPositions } from "./components/PlayerPositions";
import { Heatmaps } from "./components/Heatmaps";
import { PossessionSummary } from "./components/PossessionSummary";
import { TacticalEvents } from "./components/TacticalEvents";
import { useDashboardData } from "./lib/useDashboardData";

function App() {
  const data = useDashboardData();

  return (
    <div className="flex h-screen flex-col bg-navy-950">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          players={data.players}
          keyMetrics={data.keyMetrics}
          possession={data.possession}
        />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4">
          {/* Loading indicator */}
          {data.loading && (
            <div className="mb-4 flex items-center justify-center rounded-lg border border-card-border bg-card py-6">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-team-a border-t-transparent" />
                <span className="text-sm text-navy-300">
                  Loading pipeline data…
                </span>
              </div>
            </div>
          )}

          {/* Error banner */}
          {data.error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-300">
                Error loading data: {data.error}
              </p>
            </div>
          )}

          {/* Main area: Video + Court side by side */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <VideoAnalysis />
            <CourtView players={data.players} />
          </div>

          {/* Player positions */}
          <div className="mb-4">
            <PlayerPositions players={data.players} />
          </div>

          {/* Bottom section: Heatmaps — Python-generated PNG images */}
          <div className="mb-4">
            <Heatmaps />
          </div>

          {/* Bottom row: Possession + Tactical Events */}
          <div className="grid grid-cols-2 gap-4">
            <PossessionSummary possession={data.possession} />
            <TacticalEvents events={data.tacticalEvents} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

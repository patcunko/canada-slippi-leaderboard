import { Suspense } from "react";
import PlayerSection from "@/components/PlayerSection";
import ErrorBoundary from "@/components/ErrorBoundary";

export const maxDuration = 60;

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#222224]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ErrorBoundary message="Could not load player data. The Slippi API may be temporarily unavailable.">
          <Suspense fallback={
            <div className="rounded-lg px-6 py-16 text-center border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
              <p className="text-[#636366] text-base">Loading player data…</p>
            </div>
          }>
            <PlayerSection />
          </Suspense>
        </ErrorBoundary>

        <p className="mt-5 text-xs text-[#48484a] text-center">
          Data from the unofficial Slippi GG API · Rankings may not reflect real-time standings
        </p>
        <p className="mt-2 text-xs text-[#48484a] text-center">
          Maintained by Cunko ·{" "}
          <a
            href="https://github.com/patcunko/canada-slippi-leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#636366] transition-colors"
          >
            Open source on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}

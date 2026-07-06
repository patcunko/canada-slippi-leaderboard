import { Suspense } from "react";
import { LEADERBOARD_REGION } from "@/config/players";
import PlayerSection from "@/components/PlayerSection";
import PlayerErrorBoundary from "@/components/PlayerErrorBoundary";

export const maxDuration = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#222224]">
      <div className="w-full px-6 py-3 flex items-center gap-3 bg-[#cc0000] border-b border-[#990000]">
        <img src="/maple-leaf.svg" alt="" aria-hidden="true" style={{ width: 28, height: 28 }} />
        <span className="text-white font-bold text-lg tracking-wide">
          {LEADERBOARD_REGION} · Slippi
        </span>
        <div className="ml-auto">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdJgzCGLwyrMuMij9gt5oCyeQId5a1-6qYA4gpvZsYqIpD3TA/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#cc0000] font-semibold text-sm px-3 py-1.5 rounded hover:bg-[#f2f2f7] transition-colors"
          >
            + Add your tag
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <PlayerErrorBoundary>
          <Suspense fallback={
            <div className="rounded-lg px-6 py-16 text-center bg-[#2c2c2e] border border-[#48484a]">
              <p className="text-[#636366] text-base">Loading player data…</p>
            </div>
          }>
            <PlayerSection />
          </Suspense>
        </PlayerErrorBoundary>

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

import { Suspense } from "react";
import { LEADERBOARD_TITLE, LEADERBOARD_REGION } from "@/config/players";
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
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#f2f2f7]">{LEADERBOARD_TITLE}</h1>
          <p className="mt-1 text-sm text-[#636366]">Canada Slippi GG Ranked Leaderboard</p>
        </div>

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

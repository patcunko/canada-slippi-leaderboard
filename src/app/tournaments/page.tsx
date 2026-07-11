import { Suspense } from "react";
import TournamentsSection from "@/components/TournamentsSection";
import ErrorBoundary from "@/components/ErrorBoundary";

export const maxDuration = 60;

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-[#222224]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ErrorBoundary message="Could not load tournament data. The start.gg API may be temporarily unavailable.">
          <Suspense fallback={
            <div className="rounded-lg px-6 py-16 text-center border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
              <p className="text-[#636366] text-base">Loading tournaments…</p>
            </div>
          }>
            <TournamentsSection />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

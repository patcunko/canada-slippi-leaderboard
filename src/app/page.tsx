import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LEADERBOARD_REGION, PLAYERS, PROVINCE_COLORS } from "@/config/players";
import { fetchCanadianTournaments } from "@/lib/startgg";
import { fetchAllPlayers } from "@/lib/fetch-players";
import { iconPath } from "@/lib/character-icons";
import { TIER_TEXT, RANK_ICON } from "@/components/RankBadge";
import ErrorBoundary from "@/components/ErrorBoundary";

const MEDAL: Record<number, string> = { 0: "#f5c518", 1: "#a0a0b0", 2: "#cd7f3c" };

function IconCircle({ children, size = 40 }: { children: React.ReactNode; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: "#cc00001a" }}
    >
      {children}
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    </svg>
  );
}

function CalendarIcon({ color = "#cc0000", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

const RESOURCE_ROWS = [
  { label: "Practice Saves", desc: "Common matchup save files", src: iconPath("fox"), rounded: "rounded-full", frame: true },
  { label: "Guides", desc: "Practice setup and walkthroughs", src: "/slippi-logo.png", rounded: "rounded-lg", frame: false },
  { label: "Links", desc: "Discord & community links", src: "/discord-logo.webp", rounded: "rounded-lg", frame: false },
];

async function TournamentPreview() {
  const tournaments = await fetchCanadianTournaments();
  if (tournaments.length === 0) {
    return (
      <div className="px-6 pb-6">
        <p className="text-xs text-[#636366]">No upcoming events</p>
      </div>
    );
  }

  const next = tournaments[0];
  const date = new Date(next.startAt * 1000).toLocaleDateString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
  });
  const provinceColor = next.province ? PROVINCE_COLORS[next.province] : null;

  return (
    <>
      {next.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={next.imageUrl} alt="" className="w-full h-40 object-cover" />
      ) : (
        <div
          className="w-full h-40"
          style={{ background: "radial-gradient(ellipse 100% 100% at 0% 0%, #cc000044, #111113 70%)" }}
        />
      )}
      <div className="px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-1.5">Next up</p>
        <p className="text-sm font-semibold text-[#f2f2f7] truncate">{next.name}</p>
        <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] mt-1.5">
          <CalendarIcon color="#8e8e93" size={13} />
          {date}
        </div>

        <div className="h-px my-3" style={{ background: "#2f2f31" }} />

        <div className="flex items-center justify-between gap-2">
          {next.province ? (
            <span
              className="px-2 py-0.5 rounded text-xs font-semibold"
              style={{
                background: provinceColor?.bg ?? "#232325",
                color: provinceColor?.text ?? "#aeaeb2",
                border: `1px solid ${provinceColor?.border ?? "#3a3a3c"}`,
              }}
            >
              {next.city ? `${next.city}, ${next.province}` : next.province}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-[#636366]">
            {tournaments.length} upcoming event{tournaments.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </>
  );
}

async function LeaderboardPreview() {
  const { players } = await fetchAllPlayers(PLAYERS);
  const placedCount = players.filter((p) => p.placed).length;
  const top3 = players.filter((p) => p.placed).slice(0, 3);

  if (top3.length === 0) {
    return (
      <div className="px-6 pb-6">
        <p className="text-xs text-[#636366]">No ranked players yet</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 flex-1 flex flex-col gap-5">
      <div className="flex flex-col flex-1 justify-evenly">
        {top3.map((p, i) => {
          const accent = TIER_TEXT[p.rankTier];
          return (
            <div key={p.connectCode} className="flex items-center gap-3">
              <span className="text-sm font-bold w-4 flex-shrink-0 text-center" style={{ color: MEDAL[i] }}>
                {i + 1}
              </span>
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{ width: 32, height: 32, background: "#111113", border: `2px solid ${accent}` }}
              >
                <Image
                  src={iconPath(p.characters[0]?.character ?? "")}
                  alt=""
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                  unoptimized
                />
              </div>
              <span className="text-sm text-[#f2f2f7] font-medium truncate flex-1 min-w-0">{p.displayName}</span>
              {RANK_ICON[p.rank] && (
                <Image
                  src={RANK_ICON[p.rank]}
                  alt={p.rank}
                  width={22}
                  height={22}
                  className="object-contain flex-shrink-0"
                  unoptimized
                />
              )}
              <span className="text-sm font-mono tabular-nums text-[#636366] flex-shrink-0">
                {p.ratingOrdinal.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div>
          <p className="text-2xl font-bold font-mono tabular-nums text-[#f2f2f7]">{placedCount}</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mt-0.5">Ranked</p>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono tabular-nums text-[#f2f2f7]">{players.length}</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mt-0.5">Tracked</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#222224]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div
          className="relative overflow-hidden rounded-2xl mb-5 px-6 py-10 text-center"
          style={{ background: "#18181a", border: "1px solid #2f2f31" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 100% at 0% 0%, #cc000033, transparent 60%)" }}
          />
          <div className="relative">
            <h1 className="text-2xl font-extrabold text-[#f2f2f7]">{LEADERBOARD_REGION} SSBM Community</h1>
            <p className="mt-1 text-sm text-[#8e8e93]">
              Rankings, tournaments, and resources for the Canadian Melee scene
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/leaderboard"
            className="rounded-lg overflow-hidden border flex flex-col transition-colors hover:border-[#cc0000]"
            style={{ background: "#18181a", borderColor: "#2f2f31" }}
          >
            <div className="px-6 pt-6 flex items-center gap-3">
              <IconCircle>
                <TrophyIcon />
              </IconCircle>
              <h2 className="font-semibold text-lg text-[#f2f2f7]">Leaderboard</h2>
            </div>
            <p className="px-6 mt-3 text-sm text-[#8e8e93]">Ranked Slippi standings for Canadian players</p>
            <div className="mx-6 mt-4 mb-4 h-px" style={{ background: "#2f2f31" }} />
            <ErrorBoundary compact message="Player data unavailable">
              <Suspense
                fallback={
                  <div className="px-6 pb-6">
                    <p className="text-xs text-[#636366]">Loading…</p>
                  </div>
                }
              >
                <LeaderboardPreview />
              </Suspense>
            </ErrorBoundary>
          </Link>

          <Link
            href="/tournaments"
            className="rounded-lg overflow-hidden border flex flex-col transition-colors hover:border-[#cc0000]"
            style={{ background: "#18181a", borderColor: "#2f2f31" }}
          >
            <div className="px-6 pt-6 flex items-center gap-3">
              <IconCircle>
                <CalendarIcon />
              </IconCircle>
              <h2 className="font-semibold text-lg text-[#f2f2f7]">Tournaments</h2>
            </div>
            <p className="px-6 mt-3 mb-4 text-sm text-[#8e8e93]">Upcoming Melee events across Canada</p>
            <ErrorBoundary compact message="Tournament data unavailable">
              <Suspense
                fallback={
                  <div className="px-6 pb-6">
                    <p className="text-xs text-[#636366]">Loading…</p>
                  </div>
                }
              >
                <TournamentPreview />
              </Suspense>
            </ErrorBoundary>
          </Link>

          <Link
            href="/resources"
            className="rounded-lg overflow-hidden border flex flex-col transition-colors hover:border-[#cc0000]"
            style={{ background: "#18181a", borderColor: "#2f2f31" }}
          >
            <div className="px-6 pt-6 flex items-center gap-3">
              <IconCircle>
                <BookIcon />
              </IconCircle>
              <h2 className="font-semibold text-lg text-[#f2f2f7]">Resources</h2>
            </div>
            <p className="px-6 mt-3 text-sm text-[#8e8e93]">Guides, tools, and links for the community</p>
            <div className="mx-6 mt-4 mb-4 h-px" style={{ background: "#2f2f31" }} />
            <div className="px-6 pb-6 flex-1 flex flex-col gap-3 justify-center">
              {RESOURCE_ROWS.map((r) => (
                <div
                  key={r.label}
                  className="rounded-lg px-4 py-3 flex items-center gap-4 border"
                  style={{ background: "#111113", borderColor: "#2f2f31" }}
                >
                  <div
                    className={`${r.rounded} overflow-hidden flex-shrink-0`}
                    style={{
                      width: 44,
                      height: 44,
                      background: r.frame ? "#18181a" : "transparent",
                      border: r.frame ? "2px solid #cc0000" : "none",
                    }}
                  >
                    <Image src={r.src} alt="" width={44} height={44} className="object-contain p-0.5" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#f2f2f7]">{r.label}</p>
                    <p className="text-xs text-[#8e8e93] mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

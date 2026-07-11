"use client";
import { useState, useMemo } from "react";
import { StartggTournament } from "@/lib/startgg";
import { PROVINCE_NAMES, PROVINCE_COLORS } from "@/config/players";

function formatDateRange(startAt: number, endAt: number | null): string {
  const opts: Intl.DateTimeFormatOptions = { timeZone: "America/Toronto", month: "short", day: "numeric" };
  const start = new Date(startAt * 1000).toLocaleDateString("en-CA", opts);
  if (!endAt || endAt === startAt) return start;
  const end = new Date(endAt * 1000).toLocaleDateString("en-CA", opts);
  return start === end ? start : `${start} – ${end}`;
}

function CalendarIcon({ color = "#8e8e93" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function PeopleIcon({ color = "#636366" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4v-1z" />
    </svg>
  );
}

function TournamentCard({ tournament }: { tournament: StartggTournament }) {
  const [hovered, setHovered] = useState(false);
  const provinceColor = tournament.province ? PROVINCE_COLORS[tournament.province] : null;

  return (
    <a
      href={tournament.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl overflow-hidden border flex flex-col transition-colors"
      style={{
        background: hovered ? "#202022" : "#18181a",
        borderColor: hovered ? "#cc0000" : "#2f2f31",
      }}
    >
      {tournament.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tournament.imageUrl} alt="" className="w-full h-48 object-cover" />
      ) : (
        <div
          className="relative w-full h-48 overflow-hidden"
          style={{ background: "radial-gradient(ellipse 100% 100% at 0% 0%, #cc000033, #111113 70%)" }}
        />
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-[#f2f2f7] leading-snug line-clamp-2">{tournament.name}</h3>

        <div className="flex items-center gap-1.5 text-xs text-[#8e8e93]">
          <CalendarIcon />
          {formatDateRange(tournament.startAt, tournament.endAt)}
        </div>

        <div className="h-px my-1" style={{ background: "#2f2f31" }} />

        <div className="flex items-center justify-between gap-2">
          {tournament.province ? (
            <span
              className="px-2 py-0.5 rounded text-xs font-semibold"
              style={{
                background: provinceColor?.bg ?? "#232325",
                color: provinceColor?.text ?? "#aeaeb2",
                border: `1px solid ${provinceColor?.border ?? "#3a3a3c"}`,
              }}
            >
              {tournament.city ? `${tournament.city}, ${tournament.province}` : tournament.province}
            </span>
          ) : (
            <span />
          )}
          {tournament.numAttendees !== null && (
            <span className="flex items-center gap-1 text-xs text-[#636366] font-mono tabular-nums">
              <PeopleIcon />
              {tournament.numAttendees}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function TournamentsView({ tournaments }: { tournaments: StartggTournament[] }) {
  const [province, setProvince] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const provinces = useMemo(() => {
    const set = new Set(tournaments.map((t) => t.province).filter((p): p is string => !!p));
    return Array.from(set).sort((a, b) => {
      const countA = tournaments.filter((t) => t.province === a).length;
      const countB = tournaments.filter((t) => t.province === b).length;
      return countB - countA || a.localeCompare(b);
    });
  }, [tournaments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tournaments.filter(
      (t) =>
        (province === "ALL" || t.province === province) &&
        (!q || t.name.toLowerCase().includes(q) || t.city?.toLowerCase().includes(q))
    );
  }, [tournaments, province, search]);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl mb-5 px-6 py-6"
        style={{ background: "#18181a", border: "1px solid #2f2f31" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 100% at 0% 0%, #cc000033, transparent 60%)" }}
        />
        <div className="relative">
          <h1 className="text-2xl font-extrabold text-[#f2f2f7]">Tournaments</h1>
          <p className="mt-1 text-sm text-[#8e8e93]">Upcoming Melee tournaments in Canada, via start.gg</p>

          <div className="h-px my-5" style={{ background: "#2f2f31" }} />

          <p className="text-[10px] uppercase tracking-widest font-bold text-[#8e8e93] mb-2">Region</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProvince("ALL")}
              className="px-3 py-1 rounded text-xs font-semibold transition-colors"
              style={{
                background: province === "ALL" ? "#cc0000" : "#232325",
                color: province === "ALL" ? "#fff" : "#aeaeb2",
                border: `1px solid ${province === "ALL" ? "#cc0000" : "#3a3a3c"}`,
              }}
            >
              All
            </button>
            {provinces.map((prov) => {
              const c = PROVINCE_COLORS[prov];
              return (
                <button
                  key={prov}
                  onClick={() => setProvince(prov)}
                  title={PROVINCE_NAMES[prov] ?? prov}
                  className="px-3 py-1 rounded text-xs font-semibold transition-colors"
                  style={{
                    background: province === prov ? (c?.bg ?? "#232325") : "#232325",
                    color: c?.text ?? "#aeaeb2",
                    border: `1px solid ${province === prov ? (c?.border ?? "#3a3a3c") : "#3a3a3c"}`,
                  }}
                >
                  {prov}
                </button>
              );
            })}
          </div>

          <div className="h-px my-5" style={{ background: "#2f2f31" }} />

          <input
            type="text"
            placeholder="Search by tournament or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#232325] text-[#f2f2f7] placeholder-[#636366] outline-none focus:ring-1 focus:ring-[#48484a]"
            style={{ border: "1px solid #3a3a3c" }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg px-6 py-16 text-center border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
          <p className="text-[#636366]">
            No upcoming tournaments found
            {province !== "ALL" && ` in ${PROVINCE_NAMES[province] ?? province}`}
            {search.trim() && ` matching “${search.trim()}”`}.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </>
  );
}

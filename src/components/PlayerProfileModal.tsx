"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { SlippiPlayer, getCharacterName } from "@/lib/slippi";
import { PROVINCE_COLORS, PROVINCE_NAMES } from "@/config/players";
import { iconPath } from "./CharacterBubble";
import { RANK_ICON, TIER_TEXT } from "./RankBadge";

function rankOf(list: SlippiPlayer[], connectCode: string): number {
  return list.findIndex((p) => p.connectCode === connectCode) + 1;
}

function RankStat({
  label,
  rank,
  total,
  sub,
  accent,
}: {
  label: string;
  rank: number;
  total: number;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex flex-col gap-0.5"
      style={{ background: "#18181a", border: "1px solid #2f2f31" }}
    >
      <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accent }}>
        {label}
      </p>
      <p className="text-lg font-bold font-mono tabular-nums text-[#f2f2f7]">
        #{rank} <span className="text-xs font-normal text-[#636366]">/ {total}</span>
      </p>
      {sub && <p className="text-xs text-[#8e8e93]">{sub}</p>}
    </div>
  );
}

export default function PlayerProfileModal({
  player,
  players,
  onClose,
}: {
  player: SlippiPlayer;
  players: SlippiPlayer[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#1c1c1e",
        pixelRatio: 2,
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains("no-capture")),
      });
      const link = document.createElement("a");
      link.download = `${player.connectCode.replace("#", "-")}-profile.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate profile image", err);
    } finally {
      setDownloading(false);
    }
  }

  const stats = useMemo(() => {
    const nationalList = players;
    const regionalList = players.filter((p) => p.province === player.province);

    const mainChar = player.characters[0]?.character ?? null;
    const charNationalList = mainChar
      ? players.filter((p) => p.characters[0]?.character === mainChar)
      : [];
    const charRegionalList = mainChar
      ? charNationalList.filter((p) => p.province === player.province)
      : [];

    return {
      national: { rank: rankOf(nationalList, player.connectCode), total: nationalList.length },
      regional: { rank: rankOf(regionalList, player.connectCode), total: regionalList.length },
      mainChar,
      charNational: mainChar
        ? { rank: rankOf(charNationalList, player.connectCode), total: charNationalList.length }
        : null,
      charRegional: mainChar
        ? { rank: rankOf(charRegionalList, player.connectCode), total: charRegionalList.length }
        : null,
    };
  }, [players, player]);

  const accent = TIER_TEXT[player.rankTier];
  const rankIconSrc = RANK_ICON[player.rank];
  const mainCharIcon = iconPath(player.characters[0]?.character ?? "");
  const provinceColor =
    PROVINCE_COLORS[player.province] ?? { text: "#ff4444", bg: "#cc000022", border: "#cc000055" };
  const provinceName = PROVINCE_NAMES[player.province] ?? player.province;
  const winRate =
    player.wins + player.losses > 0
      ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
      : null;
  const totalGames = player.characters.reduce((s, c) => s + c.gameCount, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "#00000099" }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "#1c1c1e",
          border: `1.5px solid ${accent}88`,
          boxShadow: `0 0 0 1px ${accent}22, 0 12px 40px -8px ${accent}33`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-5 pt-5 pb-4"
          style={{ background: `radial-gradient(ellipse 120% 100% at 10% 0%, ${accent}26, transparent 65%)` }}
        >
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="rounded-full overflow-hidden flex-shrink-0"
                style={{ width: 56, height: 56, background: "#111113", border: `2px solid ${accent}` }}
              >
                <Image src={mainCharIcon} alt="" width={56} height={56} className="object-contain p-1" unoptimized />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#f2f2f7]">{player.displayName}</h2>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ borderColor: provinceColor.text, color: provinceColor.text }}
                    title={provinceName}
                  >
                    {player.province}
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-[#8e8e93]">{player.connectCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {rankIconSrc && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ border: `1px solid ${accent}55`, background: `${accent}14` }}
                >
                  <Image src={rankIconSrc} alt={player.rank} width={22} height={22} className="object-contain" unoptimized />
                  <span className="text-sm font-bold" style={{ color: accent }}>
                    {player.rank}
                  </span>
                </div>
              )}

              <div className="no-capture flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="text-[#8e8e93] hover:text-[#f2f2f7] transition-colors disabled:opacity-50"
                  aria-label="Download profile as image"
                  title="Download as image"
                >
                  {downloading ? (
                    <span className="text-xs">Saving…</span>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-[#8e8e93] hover:text-[#f2f2f7] transition-colors text-xl leading-none px-1"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">
          {/* Rank icon / rating / W-L */}
          <div className="flex items-center gap-4">
            {rankIconSrc && (
              <Image src={rankIconSrc} alt={player.rank} width={64} height={64} className="object-contain flex-shrink-0" unoptimized />
            )}
            <span className="text-4xl font-extrabold font-mono tabular-nums text-[#f2f2f7]">
              {player.placed ? player.ratingOrdinal.toFixed(1) : "—"}
            </span>
            <div className="ml-auto text-right flex-shrink-0">
              {player.placed ? (
                <>
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    <span style={{ color: "#30d158" }}>{player.wins}W</span>
                    <span className="text-[#636366]"> / </span>
                    <span style={{ color: "#ff9f0a" }}>{player.losses}L</span>
                  </p>
                  {winRate && <p className="text-xs text-[#636366] mt-0.5">{winRate}%</p>}
                </>
              ) : (
                <span className="text-xs text-[#636366]">Not placed</span>
              )}
            </div>
          </div>

          {/* Rankings */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: accent }}>
              Leaderboard Rankings
            </p>
            <div className="grid grid-cols-2 gap-2">
              <RankStat
                label="Canada Rank"
                rank={stats.national.rank}
                total={stats.national.total}
                accent={accent}
              />
              <RankStat
                label={`${provinceName} Rank`}
                rank={stats.regional.rank}
                total={stats.regional.total}
                accent={accent}
              />
              {stats.mainChar && stats.charNational && (
                <RankStat
                  label="Char Rank (Canada)"
                  rank={stats.charNational.rank}
                  total={stats.charNational.total}
                  sub={getCharacterName(stats.mainChar)}
                  accent={accent}
                />
              )}
              {stats.mainChar && stats.charRegional && (
                <RankStat
                  label={`Char Rank (${player.province})`}
                  rank={stats.charRegional.rank}
                  total={stats.charRegional.total}
                  sub={getCharacterName(stats.mainChar)}
                  accent={accent}
                />
              )}
            </div>
          </div>

          {/* Characters */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: accent }}>
              Characters Played
            </p>
            {player.characters.length > 0 ? (
              <div className="flex flex-col gap-2">
                {player.characters.map((c) => {
                  const pct = totalGames > 0 ? (c.gameCount / totalGames) * 100 : 0;
                  return (
                    <div key={c.character} className="flex items-center gap-2.5">
                      <div
                        className="rounded-full overflow-hidden flex-shrink-0"
                        style={{ width: 28, height: 28, background: "#111113", border: "1px solid #2f2f31" }}
                      >
                        <Image
                          src={iconPath(c.character)}
                          alt={getCharacterName(c.character)}
                          width={28}
                          height={28}
                          className="object-contain p-0.5"
                          unoptimized
                        />
                      </div>
                      <span className="text-sm text-[#f2f2f7] w-28 flex-shrink-0 truncate">
                        {getCharacterName(c.character)}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#111113" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: accent }}
                        />
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#636366] w-16 text-right flex-shrink-0">
                        {c.gameCount} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#636366]">No character data</p>
            )}
          </div>

          {/* Footer link */}
          <a
            href={`https://slippi.gg/user/${player.connectCode.replace("#", "-")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-[#8e8e93] hover:text-[#f2f2f7] transition-colors"
            style={{ background: "#18181a", border: "1px solid #2f2f31" }}
          >
            View on Slippi.gg ↗
          </a>
        </div>
      </div>
    </div>
  );
}

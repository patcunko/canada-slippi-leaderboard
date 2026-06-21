import { RankTier } from "@/lib/slippi";

const TIER_STYLES: Record<RankTier, string> = {
  bronze: "bg-amber-800 text-amber-100",
  silver: "bg-slate-500 text-slate-100",
  gold: "bg-yellow-500 text-yellow-950",
  platinum: "bg-cyan-500 text-cyan-950",
  diamond: "bg-blue-400 text-blue-950",
  master: "bg-purple-500 text-purple-100",
  grandmaster: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
  unranked: "bg-zinc-600 text-zinc-300",
};

export default function RankBadge({
  rank,
  tier,
}: {
  rank: string;
  tier: RankTier;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${TIER_STYLES[tier]}`}
    >
      {rank}
    </span>
  );
}

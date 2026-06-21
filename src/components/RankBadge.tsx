import Image from "next/image";
import { RankTier } from "@/lib/slippi";

// Maps rank name → SVG icon file in /public/ranks/ (no background)
const RANK_ICON: Record<string, string> = {
  "Bronze 1":    "/ranks/bronze_1.svg",
  "Bronze 2":    "/ranks/bronze_2.svg",
  "Bronze 3":    "/ranks/bronze_3.svg",
  "Silver 1":    "/ranks/silver_1.svg",
  "Silver 2":    "/ranks/silver_2.svg",
  "Silver 3":    "/ranks/silver_3.svg",
  "Gold 1":      "/ranks/gold_1.svg",
  "Gold 2":      "/ranks/gold_2.svg",
  "Gold 3":      "/ranks/gold_3.svg",
  "Platinum 1":  "/ranks/platinum_1.svg",
  "Platinum 2":  "/ranks/platinum_2.svg",
  "Platinum 3":  "/ranks/platinum_3.svg",
  "Diamond 1":   "/ranks/diamond_1.svg",
  "Diamond 2":   "/ranks/diamond_2.svg",
  "Diamond 3":   "/ranks/diamond_3.svg",
  "Master 1":    "/ranks/master_1.svg",
  "Master 2":    "/ranks/master_2.svg",
  "Master 3":    "/ranks/master_3.svg",
  "Grandmaster": "/ranks/grandmaster.svg",
};

const TIER_TEXT: Record<RankTier, string> = {
  bronze:      "#cd7f3c",
  silver:      "#c0c0d0",
  gold:        "#f5c518",
  platinum:    "#5bc8e8",
  diamond:     "#4fc3f7",
  master:      "#c084fc",
  grandmaster: "#ff6b35",
  unranked:    "#636366",
};

export default function RankBadge({ rank, tier }: { rank: string; tier: RankTier }) {
  const iconSrc = RANK_ICON[rank];

  if (!iconSrc) {
    return (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        Unranked
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Image
        src={iconSrc}
        alt={rank}
        width={28}
        height={28}
        className="object-contain"
        unoptimized
      />
      <span className="text-xs font-semibold" style={{ color: TIER_TEXT[tier] }}>
        {rank}
      </span>
    </div>
  );
}

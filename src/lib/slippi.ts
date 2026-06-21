export interface SlippiCharacter {
  character: string;
  gameCount: number;
}

export type RankTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "grandmaster"
  | "unranked";

export interface SlippiPlayer {
  displayName: string;
  connectCode: string;
  province: string;
  ratingOrdinal: number;
  wins: number;
  losses: number;
  dailyGlobalPlacement: number | null;
  continent: string | null;
  characters: SlippiCharacter[];
  rank: string;
  rankTier: RankTier;
  placed: boolean;
}

const RANK_THRESHOLDS: { min: number; max: number; name: string; tier: RankTier }[] = [
  { min: 0,       max: 765.43,  name: "Bronze 1",   tier: "bronze" },
  { min: 765.43,  max: 913.72,  name: "Bronze 2",   tier: "bronze" },
  { min: 913.72,  max: 1054.87, name: "Bronze 3",   tier: "bronze" },
  { min: 1054.87, max: 1188.88, name: "Silver 1",   tier: "silver" },
  { min: 1188.88, max: 1315.75, name: "Silver 2",   tier: "silver" },
  { min: 1315.75, max: 1435.48, name: "Silver 3",   tier: "silver" },
  { min: 1435.48, max: 1548.07, name: "Gold 1",     tier: "gold" },
  { min: 1548.07, max: 1653.52, name: "Gold 2",     tier: "gold" },
  { min: 1653.52, max: 1751.83, name: "Gold 3",     tier: "gold" },
  { min: 1751.83, max: 1843.0,  name: "Platinum 1", tier: "platinum" },
  { min: 1843.0,  max: 1927.03, name: "Platinum 2", tier: "platinum" },
  { min: 1927.03, max: 2003.92, name: "Platinum 3", tier: "platinum" },
  { min: 2003.92, max: 2073.67, name: "Diamond 1",  tier: "diamond" },
  { min: 2073.67, max: 2136.28, name: "Diamond 2",  tier: "diamond" },
  { min: 2136.28, max: 2191.75, name: "Diamond 3",  tier: "diamond" },
  { min: 2191.75, max: 2275.0,  name: "Master 1",   tier: "master" },
  { min: 2275.0,  max: 2350.0,  name: "Master 2",   tier: "master" },
  { min: 2350.0,  max: Infinity, name: "Master 3",  tier: "master" },
];

export function getRank(elo: number, dailyGlobalPlacement: number | null): { name: string; tier: RankTier } {
  if (dailyGlobalPlacement && elo >= 2191.75) {
    return { name: "Grandmaster", tier: "grandmaster" };
  }
  for (const r of RANK_THRESHOLDS) {
    if (elo >= r.min && elo < r.max) return { name: r.name, tier: r.tier };
  }
  return { name: "Bronze 1", tier: "bronze" };
}

const CHARACTER_NAMES: Record<string, string> = {
  MARIO: "Mario", LUIGI: "Luigi", PEACH: "Peach", YOSHI: "Yoshi",
  DK: "Donkey Kong", CPTFALCON: "Captain Falcon", GANON: "Ganondorf",
  FALCO: "Falco", FOX: "Fox", NESS: "Ness", ICE_CLIMBERS: "Ice Climbers",
  KIRBY: "Kirby", SAMUS: "Samus", ZELDA: "Zelda", LINK: "Link",
  YOUNG_LINK: "Young Link", PICHU: "Pichu", PIKACHU: "Pikachu",
  JIGGLYPUFF: "Jigglypuff", MEWTWO: "Mewtwo", MR_GAME_AND_WATCH: "Mr. Game & Watch",
  MARTH: "Marth", ROY: "Roy", DOC: "Dr. Mario", SHEIK: "Sheik",
};

export function getCharacterName(key: string): string {
  return CHARACTER_NAMES[key] ?? key;
}

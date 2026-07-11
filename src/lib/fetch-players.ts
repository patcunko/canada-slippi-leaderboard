import { cacheLife, cacheTag } from "next/cache";
import { PlayerConfig } from "@/config/players";
import { SlippiPlayer, getRank, SlippiCharacter } from "@/lib/slippi";

const SLIPPI_GQL_ENDPOINT = "https://internal.slippi.gg/graphql";
const FIREBASE_API_KEY = "AIzaSyAuQqc_wgqcUu3FqrICEPZ9Av_hPxMR_i4";

const PLAYER_FIELDS = `
  displayName
  connectCode { code }
  rankedNetplayProfile {
    ratingOrdinal
    wins
    losses
    dailyGlobalPlacement
    continent
    characters { character gameCount }
  }
`;

async function getFirebaseIdToken(): Promise<string | null> {
  const refreshToken = process.env.SLIPPI_REFRESH_TOKEN;
  if (!refreshToken) return null;
  try {
    const res = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant_type: "refresh_token", refresh_token: refreshToken }),
      }
    );
    const data = await res.json();
    return data.id_token ?? null;
  } catch {
    return null;
  }
}

function parsePlayer(user: Record<string, unknown>, province: string): SlippiPlayer | null {
  if (!user) return null;
  const profile = user.rankedNetplayProfile as Record<string, unknown> | null;
  if (!profile) return null;
  const wins = (profile.wins as number) ?? 0;
  const losses = (profile.losses as number) ?? 0;
  const placed = wins + losses >= 5;
  const elo = profile.ratingOrdinal as number;
  const dailyPlacement = (profile.dailyGlobalPlacement as number | null) ?? null;
  const { name: rankName, tier: rankTier } = placed
    ? getRank(elo, dailyPlacement)
    : { name: "Unranked", tier: "unranked" as const };
  const connectCodeObj = user.connectCode as { code: string };
  return {
    displayName: user.displayName as string,
    connectCode: connectCodeObj.code,
    province,
    ratingOrdinal: placed ? elo : 0,
    wins,
    losses,
    dailyGlobalPlacement: dailyPlacement,
    continent: (profile.continent as string | null) ?? null,
    characters: [...((profile.characters as SlippiCharacter[]) ?? [])].sort(
      (a, b) => b.gameCount - a.gameCount
    ),
    rank: rankName,
    rankTier,
    placed,
  };
}

// Fetch a batch of players in a single GraphQL request using aliases
async function fetchBatch(
  configs: PlayerConfig[],
  authHeader: string | null
): Promise<(SlippiPlayer | null)[]> {
  const aliases = configs
    .map((c, i) => {
      const cc = c.code.toUpperCase();
      return `p${i}: getUser(connectCode: "${cc}", fbUid: "${cc}") { ${PLAYER_FIELDS} }`;
    })
    .join("\n");

  const query = `query BatchQuery { ${aliases} }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "slippi-launcher/3.6.0 (darwin; x64)",
  };
  if (authHeader) headers["Authorization"] = authHeader;

  try {
    const res = await fetch(SLIPPI_GQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return configs.map(() => null);
    const json = await res.json();
    if (!json?.data) return configs.map(() => null);
    return configs.map((c, i) => parsePlayer(json.data[`p${i}`], c.province));
  } catch {
    return configs.map(() => null);
  }
}

export interface PlayersResult {
  players: SlippiPlayer[];
  cachedAt: string;
}

export async function fetchAllPlayers(configs: PlayerConfig[]): Promise<PlayersResult> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 43200, expire: 86400 });
  cacheTag("players-v4");

  const idToken = await getFirebaseIdToken();
  const authHeader = idToken ? `Bearer ${idToken}` : null;

  // 30 players per HTTP request = ~10 requests total for 300 players
  const BATCH = 30;
  const results: (SlippiPlayer | null)[] = [];
  for (let i = 0; i < configs.length; i += BATCH) {
    const batch = await fetchBatch(configs.slice(i, i + BATCH), authHeader);
    results.push(...batch);
  }

  const valid = results.filter((p): p is SlippiPlayer => p !== null);

  if (valid.length === 0) {
    throw new Error("Slippi API returned no data");
  }

  const players = valid.sort((a, b) => {
    if (a.placed && !b.placed) return -1;
    if (!a.placed && b.placed) return 1;
    return b.ratingOrdinal - a.ratingOrdinal;
  });

  const cachedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return { players, cachedAt };
}

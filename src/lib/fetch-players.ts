"use cache";
import { cacheLife } from "next/cache";
import { PlayerConfig } from "@/config/players";
import { SlippiPlayer, getRank, SlippiCharacter } from "@/lib/slippi";

const SLIPPI_GQL_ENDPOINT = "https://internal.slippi.gg/graphql";
const FIREBASE_API_KEY = "AIzaSyAuQqc_wgqcUu3FqrICEPZ9Av_hPxMR_i4";

const PLAYER_QUERY = `
query UserProfilePageQuery($cc: String, $uid: String) {
  getUser(connectCode: $cc, fbUid: $uid) {
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
  }
}`;

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

async function fetchSlippiPlayer(
  config: PlayerConfig,
  authHeader: string | null
): Promise<SlippiPlayer | null> {
  const cc = config.code.toUpperCase();
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "slippi-launcher/3.6.0 (darwin; x64)",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    const response = await fetch(SLIPPI_GQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        operationName: "UserProfilePageQuery",
        query: PLAYER_QUERY,
        variables: { cc, uid: cc },
      }),
    });
    if (!response.ok) return null;
    const json = await response.json();
    const user = json?.data?.getUser;
    if (!user) return null;
    const profile = user.rankedNetplayProfile;
    if (!profile) return null;
    const wins = profile.wins ?? 0;
    const losses = profile.losses ?? 0;
    const placed = wins + losses >= 5;
    const { name: rankName, tier: rankTier } = placed
      ? getRank(profile.ratingOrdinal, profile.dailyGlobalPlacement ?? null)
      : { name: "Unranked", tier: "unranked" as const };
    return {
      displayName: user.displayName,
      connectCode: user.connectCode.code,
      province: config.province,
      ratingOrdinal: placed ? profile.ratingOrdinal : 0,
      wins,
      losses,
      dailyGlobalPlacement: profile.dailyGlobalPlacement ?? null,
      continent: profile.continent ?? null,
      characters: [...(profile.characters ?? [])].sort(
        (a: SlippiCharacter, b: SlippiCharacter) => b.gameCount - a.gameCount
      ),
      rank: rankName,
      rankTier,
      placed,
    };
  } catch {
    return null;
  }
}

export async function fetchAllPlayers(configs: PlayerConfig[]): Promise<SlippiPlayer[]> {
  cacheLife("hours");
  const idToken = await getFirebaseIdToken();
  const authHeader = idToken ? `Bearer ${idToken}` : null;

  const BATCH = 10;
  const DELAY_MS = 200;
  const results: (SlippiPlayer | null)[] = [];
  for (let i = 0; i < configs.length; i += BATCH) {
    if (i > 0) await new Promise((r) => setTimeout(r, DELAY_MS));
    const batch = await Promise.all(
      configs.slice(i, i + BATCH).map((c) => fetchSlippiPlayer(c, authHeader))
    );
    results.push(...batch);
  }
  const valid = results.filter((p): p is SlippiPlayer => p !== null);

  // Don't cache empty results — throw so Next.js retries next request
  if (valid.length === 0) {
    throw new Error("Slippi API returned no data");
  }

  return valid.sort((a, b) => {
    if (a.placed && !b.placed) return -1;
    if (!a.placed && b.placed) return 1;
    return b.ratingOrdinal - a.ratingOrdinal;
  });
}

import { cacheLife, cacheTag } from "next/cache";
import { fetchAllPlayers } from "@/lib/fetch-players";
import { PLAYERS } from "@/config/players";
import LeaderboardView from "@/components/LeaderboardView";

export default async function PlayerSection() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 43200, expire: 86400 });
  cacheTag("players-v4");

  const cachedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const players = await fetchAllPlayers(PLAYERS);
  return <LeaderboardView players={players} cachedAt={cachedAt} />;
}

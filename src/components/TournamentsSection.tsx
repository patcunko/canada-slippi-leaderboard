import { fetchCanadianTournaments } from "@/lib/startgg";
import TournamentsView from "@/components/TournamentsView";

export default async function TournamentsSection() {
  const tournaments = await fetchCanadianTournaments();
  return <TournamentsView tournaments={tournaments} />;
}

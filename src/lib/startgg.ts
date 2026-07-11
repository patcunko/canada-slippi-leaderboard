import { cacheLife, cacheTag } from "next/cache";

export interface StartggTournament {
  id: string;
  name: string;
  url: string;
  startAt: number;
  endAt: number | null;
  city: string | null;
  province: string | null;
  numAttendees: number | null;
  imageUrl: string | null;
}

const STARTGG_ENDPOINT = "https://api.start.gg/gql/alpha";
const MELEE_VIDEOGAME_ID = 1;

const TOURNAMENTS_QUERY = `
  query CanadianTournaments($afterDate: Timestamp, $videogameIds: [ID], $perPage: Int!) {
    tournaments(query: {
      perPage: $perPage
      page: 1
      sortBy: "startAt asc"
      filter: {
        countryCode: "CA"
        videogameIds: $videogameIds
        afterDate: $afterDate
        upcoming: true
      }
    }) {
      nodes {
        id
        name
        url(relative: false)
        startAt
        endAt
        city
        addrState
        numAttendees
        images(type: "profile") {
          url
        }
      }
    }
  }
`;

interface RawTournamentNode {
  id: string | number;
  name: string;
  url: string;
  startAt: number;
  endAt: number | null;
  city: string | null;
  addrState: string | null;
  numAttendees: number | null;
  images: { url: string }[] | null;
}

export async function fetchCanadianTournaments(): Promise<StartggTournament[]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 21600 });
  cacheTag("tournaments-v1");

  const token = process.env.STARTGG_API_TOKEN;
  if (!token) {
    throw new Error("Missing STARTGG_API_TOKEN environment variable");
  }

  const res = await fetch(STARTGG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: TOURNAMENTS_QUERY,
      variables: {
        afterDate: Math.floor(Date.now() / 1000),
        videogameIds: [MELEE_VIDEOGAME_ID],
        perPage: 50,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`start.gg API responded with ${res.status}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "start.gg API error");
  }

  const nodes: RawTournamentNode[] = (json.data?.tournaments?.nodes ?? []).filter(Boolean);

  return nodes.map((n) => ({
    id: String(n.id),
    name: n.name,
    url: n.url,
    startAt: n.startAt,
    endAt: n.endAt,
    city: n.city,
    province: n.addrState,
    numAttendees: n.numAttendees,
    imageUrl: n.images?.[0]?.url ?? null,
  }));
}

// Normalize API character keys (which vary in format) to our icon filenames
const CHAR_NORMALIZE: Record<string, string> = {
  mario: "mario", luigi: "luigi", peach: "peach", yoshi: "yoshi",
  dk: "dk", donkeykong: "dk", donkey_kong: "dk",
  cptfalcon: "cptfalcon", captain_falcon: "cptfalcon", captainfalcon: "cptfalcon",
  ganon: "ganon", ganondorf: "ganon",
  falco: "falco", fox: "fox",
  ness: "ness",
  ice_climbers: "ice_climbers", iceclimbers: "ice_climbers", popo: "ice_climbers",
  kirby: "kirby",
  samus: "samus",
  zelda: "zelda", sheik: "sheik",
  link: "link",
  young_link: "young_link", younglink: "young_link",
  pichu: "pichu", pikachu: "pikachu",
  jigglypuff: "jigglypuff", puff: "jigglypuff",
  mewtwo: "mewtwo",
  mr_game_and_watch: "mr_game_and_watch", mrgameandwatch: "mr_game_and_watch", gnw: "mr_game_and_watch",
  game_and_watch: "mr_game_and_watch", gameandwatch: "mr_game_and_watch",
  marth: "marth", roy: "roy",
  doc: "doc", drmario: "doc", dr_mario: "doc",
  bowser: "bowser",
};

export function iconPath(key: string): string {
  const normalized = CHAR_NORMALIZE[key.toLowerCase().replace(/\s/g, "_")];
  return normalized ? `/characters/${normalized}.png` : "/characters/unknown.png";
}

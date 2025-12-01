export interface Organisation {
  id: string;
  name: string;
  description: string;
}

// Example organisations (replace with real data or fetch from API)
export const organisations: Organisation[] = [
  {
    id: "org1",
    name: "Jugendgruppe St. Martin",
    description: "Konfi-Tag Organisation St. Martin",
  },
  {
    id: "org2",
    name: "Ev. Jugend West",
    description: "Evangelische Jugendgruppe Nord",
  },
  { id: "org3", name: "Konfi-Team Süd", description: "Konfi-Tag Team Süd" },
];
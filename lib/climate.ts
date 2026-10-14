export type Season = "rainy" | "dry" | "transition";
export type Locale = "en" | "id";

export type Region = {
  id: string;
  name: string;
  patternAvailable: boolean;
};

export const regions: Region[] = [
  { id: "indonesia", name: "Indonesia · general overview", patternAvailable: true },
  { id: "jatim", name: "Jawa Timur", patternAvailable: false },
  { id: "kediri", name: "Kediri, Jawa Timur", patternAvailable: false },
  { id: "jabar", name: "Jawa Barat", patternAvailable: false },
  { id: "jakarta", name: "Jakarta", patternAvailable: false },
  { id: "bali", name: "Bali", patternAvailable: false },
  { id: "sumut", name: "Sumatera Utara", patternAvailable: false },
  { id: "kaltim", name: "Kalimantan Timur", patternAvailable: false },
  { id: "sulsel", name: "Sulawesi Selatan", patternAvailable: false },
  { id: "ntt", name: "Nusa Tenggara Timur", patternAvailable: false },
  { id: "papua", name: "Papua", patternAvailable: false },
];

export const monthLabels = [
  { en: "January", id: "Januari", short: { en: "JAN", id: "JAN" } },
  { en: "February", id: "Februari", short: { en: "FEB", id: "FEB" } },
  { en: "March", id: "Maret", short: { en: "MAR", id: "MAR" } },
  { en: "April", id: "April", short: { en: "APR", id: "APR" } },
  { en: "May", id: "Mei", short: { en: "MAY", id: "MEI" } },
  { en: "June", id: "Juni", short: { en: "JUN", id: "JUN" } },
  { en: "July", id: "Juli", short: { en: "JUL", id: "JUL" } },
  { en: "August", id: "Agustus", short: { en: "AUG", id: "AGU" } },
  { en: "September", id: "September", short: { en: "SEP", id: "SEP" } },
  { en: "October", id: "Oktober", short: { en: "OCT", id: "OKT" } },
  { en: "November", id: "November", short: { en: "NOV", id: "NOV" } },
  { en: "December", id: "Desember", short: { en: "DEC", id: "DES" } },
] as const;

// Broad, educational pattern only. It is not a forecast or a regional classification.
export const monthlyPattern: Season[] = [
  "rainy", "rainy", "transition", "transition", "dry", "dry",
  "dry", "dry", "transition", "transition", "rainy", "rainy",
];

export const seasonCopy: Record<Locale, Record<Season, { label: string; eyebrow: string; description: string; conditions: string[] }>> = {
  en: {
    rainy: {
      label: "Rainy season pattern", eyebrow: "Wetter monsoon months",
      description: "Across much of monsoonal Indonesia, October–March is generally associated with wetter conditions as the western monsoon brings moist air. Local timing and rainfall can vary widely.",
      conditions: ["Moist monsoon flow", "More frequent rainfall", "Lush, humid landscapes"],
    },
    dry: {
      label: "Dry season pattern", eyebrow: "Relatively drier months",
      description: "April–September is generally associated with reduced rainfall across many monsoonal areas as drier air arrives with the eastern monsoon. Dry season does not mean rain-free.",
      conditions: ["Drier monsoon flow", "Rainfall often eases", "Brighter, warmer days"],
    },
    transition: {
      label: "Pancaroba · transition", eyebrow: "Season in transition",
      description: "Pancaroba is the shift between wetter and drier monsoon patterns. Winds and rainfall can be less settled, and brief heavy showers may occur. The timing differs from place to place.",
      conditions: ["Shifting wind direction", "Changeable rainfall", "Warm, humid afternoons"],
    },
  },
  id: {
    rainy: {
      label: "Pola musim hujan", eyebrow: "Bulan dengan monsun lebih basah",
      description: "Di banyak wilayah Indonesia bermonsun, Oktober–Maret umumnya berkaitan dengan kondisi lebih basah saat monsun baratan membawa udara lembap. Waktu dan curah hujan setempat dapat berbeda.",
      conditions: ["Aliran monsun lembap", "Hujan lebih sering", "Lanskap hijau dan lembap"],
    },
    dry: {
      label: "Pola musim kemarau", eyebrow: "Bulan relatif lebih kering",
      description: "April–September umumnya berkaitan dengan berkurangnya hujan di banyak wilayah bermonsun saat udara lebih kering datang bersama monsun timuran. Kemarau bukan berarti tanpa hujan.",
      conditions: ["Aliran monsun lebih kering", "Hujan cenderung berkurang", "Hari lebih cerah dan hangat"],
    },
    transition: {
      label: "Pancaroba · masa peralihan", eyebrow: "Musim sedang berganti",
      description: "Pancaroba adalah peralihan antara pola monsun yang lebih basah dan lebih kering. Arah angin dan hujan dapat berubah-ubah; hujan lebat singkat juga mungkin terjadi. Waktunya berbeda di setiap tempat.",
      conditions: ["Arah angin berubah", "Pola hujan tidak menentu", "Siang hangat dan lembap"],
    },
  },
};

export type ClimateRecord = {
  region: string;
  regionId: string;
  year: number;
  month: number;
  season: Season;
  dataType: "climatology" | "forecast";
  sourceName: string;
  publicationDate: string | null;
  sourceUrl: string;
  lastUpdated: string;
  notes?: string;
};

export type OfficialForecastRecord = ClimateRecord & { dataType: "forecast" };

// Add only records whose BMKG source maps to the selected region and calendar month.
export const officialForecasts: OfficialForecastRecord[] = [];

export const climatologyReference = {
  sourceName: "Informasi Iklim BMKG",
  sourceUrl: "https://iklim.bmkg.go.id/id/faq/",
  publicationDate: null,
  lastReviewed: "14 October 2026",
};

export function getClimatologyRecord(monthIndex: number, year: number): ClimateRecord {
  return {
    region: "Indonesia · general overview",
    regionId: "indonesia",
    month: monthIndex + 1,
    year,
    season: monthlyPattern[monthIndex],
    dataType: "climatology",
    sourceName: climatologyReference.sourceName,
    publicationDate: climatologyReference.publicationDate,
    sourceUrl: climatologyReference.sourceUrl,
    lastUpdated: "2026-10-14T00:00:00+07:00",
    notes: "National educational pattern; not a regional or daily forecast.",
  };
}

export const bmkgOutlook = {
  title: "Prediksi Musim Hujan 2026/2027 di Indonesia",
  publicationDate: "2 October 2026",
  sourceUrl: "https://www.bmkg.go.id/iklim/prediksi-musim/prediksi-musim-hujan-2026-2027-di-indonesia",
  summary: {
    en: "BMKG’s national outlook places many rainy-season onsets in November–December 2026, with peak-rain timing concentrated in December 2026–February 2027. The publication reports Zona Musim (ZOM), not a direct one-to-one mapping to the region choices here.",
    id: "Prediksi nasional BMKG menempatkan banyak awal musim hujan pada November–Desember 2026, dengan puncak hujan pada Desember 2026–Februari 2027. Publikasi ini menggunakan Zona Musim (ZOM), bukan pemetaan langsung ke pilihan wilayah di sini.",
  },
};

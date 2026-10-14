# Musimku

**Explore Indonesia’s Seasons.** A lightweight, bilingual calendar for learning about Indonesia’s broad monsoon patterns.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Climate data model

- The month colors are an educational, national-level climatological guide: wetter monsoon months are generally associated with October–March, drier months with April–September, and March/April/September/October are presented as transition periods.
- This is not a daily weather forecast. Rain can occur during the dry season, and local season timing varies.
- Non-national regions (including Kediri) intentionally show a missing-data message. The national illustration is not presented as a regional classification.
- `lib/climate.ts` defines `OfficialForecastRecord` and `officialForecasts`. Add a record only when a BMKG publication supports the selected region and month. The 2026/27 national outlook is linked as context; its ZOM data is not mapped to the administrative region selector.
- Educational context and current outlook link to BMKG sources directly in the app.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Motion for React, and Lucide icons. No account or database is required.

## Deploy

The project is ready for Vercel. Import the GitHub repository or run `vercel` from the project directory. No environment variables are required.

import { NextResponse } from "next/server";
import { regions } from "@/lib/climate";

export const revalidate = 900;

type OpenMeteoResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    is_day?: number;
    precipitation?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
};

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function GET(request: Request) {
  const regionId = new URL(request.url).searchParams.get("region") ?? "indonesia";
  const region = regions.find((item) => item.id === regionId);

  if (!region) {
    return NextResponse.json({ error: "Wilayah tidak dikenal." }, { status: 400 });
  }

  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", String(region.latitude));
  endpoint.searchParams.set("longitude", String(region.longitude));
  endpoint.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m");
  endpoint.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  endpoint.searchParams.set("forecast_days", "1");
  endpoint.searchParams.set("timezone", region.timezone);
  endpoint.searchParams.set("wind_speed_unit", "kmh");

  try {
    const response = await fetch(endpoint, {
      next: { revalidate },
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);

    const payload = (await response.json()) as OpenMeteoResponse;
    const current = payload.current;
    if (!current || !current.time || !finite(current.temperature_2m) || !finite(current.weather_code)) {
      throw new Error("Weather provider returned incomplete current conditions");
    }

    return NextResponse.json({
      regionId: region.id,
      regionName: region.name,
      timezone: region.timezone,
      latitude: region.latitude,
      longitude: region.longitude,
      observedAt: current.time,
      temperature: current.temperature_2m,
      feelsLike: finite(current.apparent_temperature) ? current.apparent_temperature : null,
      humidity: finite(current.relative_humidity_2m) ? current.relative_humidity_2m : null,
      precipitation: finite(current.precipitation) ? current.precipitation : null,
      windSpeed: finite(current.wind_speed_10m) ? current.wind_speed_10m : null,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      todayHigh: finite(payload.daily?.temperature_2m_max?.[0]) ? payload.daily?.temperature_2m_max?.[0] : null,
      todayLow: finite(payload.daily?.temperature_2m_min?.[0]) ? payload.daily?.temperature_2m_min?.[0] : null,
      rainChance: finite(payload.daily?.precipitation_probability_max?.[0]) ? payload.daily?.precipitation_probability_max?.[0] : null,
      source: "Open-Meteo",
      sourceUrl: "https://open-meteo.com/",
      refreshedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json(
      { error: "Data cuaca sementara tidak dapat dimuat. Silakan coba lagi." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

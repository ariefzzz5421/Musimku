"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CloudDrizzle, CloudRain,
  CloudSun, Compass, Droplets, ExternalLink, Leaf, MapPin, Moon, Sun, SunMedium,
  Wind, Share2, Sparkles, Waves,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bmkgOutlook, climatologyReference, getClimatologyRecord, monthLabels, monthlyPattern, officialForecasts, regions,
  seasonCopy, type Locale, type Season,
} from "@/lib/climate";

const words = {
  en: {
    tagline: "Explore Indonesia’s Seasons.", explore: "A year, in seasons", intro: "Twelve months. Countless local rhythms.",
    choose: "Choose a month", monthNote: "The color shows a broad Indonesian monsoon pattern.", region: "Explore a place", regionPlaceholder: "Search a region…",
    general: "General overview", year: "Year", today: "Today", share: "Copy link", copied: "Link copied",
    climatology: "Climatological pattern", forecast: "Official outlook · national", source: "BMKG source", updated: "Published", reviewed: "Reviewed",
    unavailable: "Regional pattern not available", unavailableBody: "We don’t have a region-specific climatology here yet. The landscape remains an illustration of the broad national pattern; this is not a local forecast.",
    outlookTitle: "A note on 2026/27", category: "Seasonal character", why: "Why do seasons change?", whyIntro: "A short field guide to the forces that shape rain across the archipelago.",
    rainTitle: "The western monsoon", rainBody: "From around October to March, winds from the Asian continent often carry moist air across Indonesia. Many monsoonal areas see more rain, but the onset and intensity vary by location.",
    dryTitle: "The eastern monsoon", dryBody: "From around April to September, winds associated with Australia often bring drier air to many parts of Indonesia. Rain can still fall during the dry season.",
    ensoTitle: "El Niño & La Niña", ensoBody: "These Pacific Ocean patterns can shift rainfall odds across Indonesia. Their effects depend on the season, local seas, and other climate systems; neither one guarantees a particular outcome.",
    sourceNote: "Broad educational pattern · not a daily weather forecast", seasonalNote: "Climatology is a long-term guide, not a promise for a particular day.",
    follow: "Follow the seasonal rhythm", footer: "Made for curious minds, under an equatorial sky.",
    north: "North", wet: "Wetter", dry: "Drier", transition: "Pancaroba", seasonUnavailable: "Local pattern not mapped",
    dialogClose: "Close", theme: "Switch color theme", language: "Switch language", locationLabel: "Location search", yearLabel: "Calendar year",
    janMar: "JAN — DEC", sourceLabel: "Read the BMKG outlook", dataType: "Data type", note: "Note", todayShort: "Jump to current month",
  },
  id: {
    tagline: "Jelajahi Musim Indonesia.", explore: "Satu tahun, berganti musim", intro: "Dua belas bulan. Irama lokal yang beragam.",
    choose: "Pilih bulan", monthNote: "Warna menunjukkan pola monsun Indonesia secara umum.", region: "Jelajahi wilayah", regionPlaceholder: "Cari wilayah…",
    general: "Gambaran umum", year: "Tahun", today: "Hari ini", share: "Salin tautan", copied: "Tautan disalin",
    climatology: "Pola klimatologis", forecast: "Tinjauan resmi · nasional", source: "Sumber BMKG", updated: "Terbit", reviewed: "Ditinjau",
    unavailable: "Pola wilayah belum tersedia", unavailableBody: "Data klimatologis khusus wilayah ini belum tersedia. Lanskap tetap menjadi ilustrasi pola nasional secara umum; ini bukan prediksi setempat.",
    outlookTitle: "Catatan 2026/27", category: "Karakter musim", why: "Mengapa musim berubah?", whyIntro: "Panduan singkat tentang faktor yang membentuk hujan di kepulauan Indonesia.",
    rainTitle: "Monsun baratan", rainBody: "Sekitar Oktober hingga Maret, angin dari Benua Asia sering membawa udara lembap melintasi Indonesia. Banyak wilayah bermonsun mengalami lebih banyak hujan, tetapi awal dan intensitasnya berbeda di setiap tempat.",
    dryTitle: "Monsun timuran", dryBody: "Sekitar April hingga September, angin yang berkaitan dengan Australia sering membawa udara lebih kering ke banyak wilayah Indonesia. Hujan tetap dapat turun saat musim kemarau.",
    ensoTitle: "El Niño & La Niña", ensoBody: "Pola di Samudra Pasifik ini dapat mengubah peluang hujan di Indonesia. Dampaknya bergantung pada musim, laut setempat, dan sistem iklim lain; keduanya tidak memastikan satu kondisi tertentu.",
    sourceNote: "Pola edukasi umum · bukan prakiraan cuaca harian", seasonalNote: "Klimatologi adalah panduan jangka panjang, bukan kepastian untuk hari tertentu.",
    follow: "Ikuti irama musim", footer: "Dibuat untuk pikiran yang ingin tahu, di bawah langit khatulistiwa.",
    north: "Utara", wet: "Lebih basah", dry: "Lebih kering", transition: "Pancaroba", seasonUnavailable: "Pola lokal belum dipetakan",
    dialogClose: "Tutup", theme: "Ganti tema warna", language: "Ganti bahasa", locationLabel: "Pencarian wilayah", yearLabel: "Tahun kalender",
    janMar: "JAN — DES", sourceLabel: "Baca tinjauan BMKG", dataType: "Jenis data", note: "Catatan", todayShort: "Ke bulan saat ini",
  },
} as const;

function SeasonGlyph({ season, size = 17 }: { season: Season; size?: number }) {
  if (season === "rainy") return <CloudRain size={size} strokeWidth={1.7} aria-hidden="true" />;
  if (season === "dry") return <SunMedium size={size} strokeWidth={1.7} aria-hidden="true" />;
  return <CloudSun size={size} strokeWidth={1.7} aria-hidden="true" />;
}

function WeatherScene({ season, monthIndex, reducedMotion, isVisible }: { season: Season; monthIndex: number; reducedMotion: boolean; isVisible: boolean }) {
  const isWet = season === "rainy";
  const isTransition = season === "transition";
  const particles = Array.from({ length: isWet ? 24 : 14 }, (_, i) => i);

  return (
    <motion.div
      key={`${season}-${monthIndex}`}
      className={`season-scene season-scene--${season} ${isVisible ? "" : "scene-paused"}`}
      initial={reducedMotion ? false : { opacity: 0.15, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 1.05, ease: [0.22, 0.7, 0.14, 1] }}
      aria-hidden="true"
    >
      <div className="scene-grain" />
      <div className="scene-sun" />
      <div className="scene-cloud scene-cloud--back" />
      <div className="scene-cloud scene-cloud--front" />
      <div className="scene-haze scene-haze--one" />
      <div className="scene-haze scene-haze--two" />
      <div className="scene-island scene-island--far" />
      <div className="scene-island scene-island--near" />
      <svg className="scene-palm scene-palm--left" viewBox="0 0 220 330" fill="none">
        <path d="M109 326C103 237 102 134 117 24" stroke="currentColor" strokeWidth="8" />
        <path d="M117 36C78 9 43 5 7 17C39 22 67 35 94 58C57 44 27 46 0 63C40 62 73 72 101 91C66 86 39 96 17 120C55 106 88 108 115 117M117 35C148 4 181-3 218 3C189 15 163 32 140 58C174 38 204 35 220 47C188 53 162 67 135 91C167 77 197 81 214 96C178 96 149 106 120 120" fill="currentColor" />
      </svg>
      <svg className="scene-palm scene-palm--right" viewBox="0 0 220 330" fill="none">
        <path d="M109 326C103 237 102 134 117 24" stroke="currentColor" strokeWidth="8" />
        <path d="M117 36C78 9 43 5 7 17C39 22 67 35 94 58C57 44 27 46 0 63C40 62 73 72 101 91C66 86 39 96 17 120C55 106 88 108 115 117M117 35C148 4 181-3 218 3C189 15 163 32 140 58C174 38 204 35 220 47C188 53 162 67 135 91C167 77 197 81 214 96C178 96 149 106 120 120" fill="currentColor" />
      </svg>
      <div className="scene-ground" />
      <div className={`scene-atmosphere ${isWet ? "rainfall" : "sun-dust"} ${reducedMotion ? "is-still" : ""}`}>
        {particles.map((particle) => <i key={particle} style={{ "--particle": particle } as React.CSSProperties} />)}
      </div>
      {isTransition && <div className={`scene-atmosphere sun-dust ${reducedMotion ? "is-still" : ""}`}>{particles.slice(0, 8).map((particle) => <i key={particle} style={{ "--particle": particle } as React.CSSProperties} />)}</div>}
    </motion.div>
  );
}

export default function MusimkuApp() {
  const prefersReducedMotion = useReducedMotion();
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(2026);
  const [regionId, setRegionId] = useState("indonesia");
  const [regionInput, setRegionInput] = useState(regions[0].name);
  const [locale, setLocale] = useState<Locale>("en");
  const [lightTheme, setLightTheme] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = words[locale];
  const region = regions.find((item) => item.id === regionId) ?? regions[0];
  const season = monthlyPattern[month];
  const copy = seasonCopy[locale][season];
  const monthName = monthLabels[month][locale];
  const hasLocalPattern = region.patternAvailable;
  const forecast = officialForecasts.find((item) => item.regionId === regionId && item.year === year && item.month === month + 1);
  const climatologyRecord = hasLocalPattern ? getClimatologyRecord(month, year) : undefined;
  const seasonLabel = forecast ? copy.label : hasLocalPattern ? copy.label : t.unavailable;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedMonth = Number(params.get("month"));
    const parsedYear = Number(params.get("year"));
    const parsedRegion = regions.find((item) => item.id === params.get("region"));
    if (Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) setMonth(parsedMonth - 1);
    if (Number.isInteger(parsedYear) && parsedYear >= 2025 && parsedYear <= 2030) setYear(parsedYear);
    if (parsedRegion) {
      setRegionId(parsedRegion.id);
      setRegionInput(parsedRegion.name);
    }
    const localeParam = params.get("lang");
    if (localeParam === "id" || localeParam === "en") setLocale(localeParam);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? "light" : "dark";
  }, [lightTheme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const element = heroSceneRef.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("month", String(month + 1));
    url.searchParams.set("year", String(year));
    url.searchParams.set("region", regionId);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
  }, [month, year, regionId, locale]);

  const onRegionChange = useCallback((value: string) => {
    setRegionInput(value);
    const selected = regions.find((item) => item.name.toLocaleLowerCase() === value.toLocaleLowerCase());
    if (selected) setRegionId(selected.id);
  }, []);

  const selectMonth = useCallback((index: number) => setMonth(index), []);
  const goToday = () => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(Math.min(2030, Math.max(2025, now.getFullYear())));
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const monthTitle = useMemo(() => `${monthName} ${year}`, [monthName, year]);

  return (
    <main className={`app-shell ${lightTheme ? "app-shell--light" : ""}`}>
      <header className="topbar page-width">
        <a href="#top" className="brand" aria-label="Musimku, home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-name">musimku<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="topbar-note"><span className="live-dot" /> {t.tagline}</span>
          <button className="icon-button" type="button" onClick={() => setLocale(locale === "en" ? "id" : "en")} aria-label={t.language} title={t.language}>
            <span className="language-code">{locale === "en" ? "ID" : "EN"}</span>
          </button>
          <button className="icon-button" type="button" onClick={() => setLightTheme((current) => !current)} aria-label={t.theme} title={t.theme}>
            {lightTheme ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </header>

      <section className="hero page-width" id="top" aria-label="Seasonal landscape">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> {t.explore}</div>
          <h1>{monthName}<span className="year-accent">, {year}</span><br /><em>{t.tagline}</em></h1>
          <p className="hero-intro">{t.intro}</p>
        </div>
        <div className="hero-side-note" aria-hidden="true"><Compass size={15} /><span>06° S<br />108° E</span><i /></div>
        <div ref={heroSceneRef} className="hero-landscape" role="img" aria-label={`${seasonLabel} landscape illustration for ${monthTitle}`}>
          <AnimatePresence mode="sync"><WeatherScene season={season} monthIndex={month} reducedMotion={Boolean(prefersReducedMotion)} isVisible={sceneVisible} /></AnimatePresence>
          <div className="scene-label scene-label--top"><span className={`season-dot season-dot--${season}`} />{hasLocalPattern ? copy.eyebrow : t.seasonUnavailable}</div>
            <div className="scene-coordinate"><Waves size={12} /> NUSANTARA · {monthLabels[month].short[locale]} ’{String(year).slice(-2)}</div>
          <div className="scene-caption"><span className="caption-icon"><SeasonGlyph season={season} size={18} /></span><span><strong>{monthName} {year}</strong><small>{hasLocalPattern ? seasonLabel : t.unavailable}</small></span><ArrowUpRight size={16} className="caption-arrow" /></div>
          <div className="scene-progress" aria-hidden="true"><span className="scene-progress-dot" style={{ left: `${(month / 11) * 100}%` }} /></div>
        </div>
      </section>

      <section className="calendar-section page-width" aria-labelledby="calendar-heading">
        <div className="section-topline">
          <div><div className="eyebrow section-eyebrow"><span className="eyebrow-line" /> {t.follow}</div><h2 id="calendar-heading">{t.choose}<span className="heading-period">.</span></h2></div>
          <div className="calendar-tools">
            <label className="region-field"><MapPin size={15} /><span className="sr-only">{t.locationLabel}</span><input list="region-list" value={regionInput} onChange={(event) => onRegionChange(event.target.value)} aria-label={t.locationLabel} placeholder={t.regionPlaceholder} /><datalist id="region-list">{regions.map((item) => <option key={item.id} value={item.name} />)}</datalist><ArrowDownRight size={13} className="field-caret" /></label>
            <div className="year-picker" aria-label={t.yearLabel}>
              <span className="year-label">{t.year}</span>
              <button type="button" onClick={() => setYear((value) => Math.max(2025, value - 1))} disabled={year <= 2025} aria-label="Previous year"><ArrowLeft size={15} /></button>
              <AnimatePresence mode="wait" initial={false}><motion.strong key={year} initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}>{year}</motion.strong></AnimatePresence>
              <button type="button" onClick={() => setYear((value) => Math.min(2030, value + 1))} disabled={year >= 2030} aria-label="Next year"><ArrowRight size={15} /></button>
            </div>
            <button className="today-button" type="button" onClick={goToday}><Sparkles size={13} /> {t.today}</button>
          </div>
        </div>
        <div className="calendar-note"><span className="mini-season-legend"><i className="legend-rain" /><i className="legend-transition" /><i className="legend-dry" /></span>{t.monthNote}<button className="share-button" type="button" onClick={share} aria-live="polite"><Share2 size={13} /> {copied ? t.copied : t.share}</button></div>
        <div className="month-grid" role="group" aria-label={t.choose}>
          {monthLabels.map((item, index) => {
            const cardSeason = monthlyPattern[index];
            const active = month === index;
            return <motion.button key={item.short.en} type="button" className={`month-card month-card--${cardSeason} ${active ? "is-active" : ""}`} onClick={() => selectMonth(index)} aria-pressed={active} whileHover={prefersReducedMotion ? undefined : { y: -3 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
              <span className="month-card-top"><span className="month-index">{String(index + 1).padStart(2, "0")}</span><SeasonGlyph season={cardSeason} size={16} /></span>
              <span className="month-card-name">{item.short[locale]}</span>
              <span className="month-card-track"><i /></span>
              {active && <motion.span className="month-active-mark" layoutId="month-active-mark" transition={{ type: "spring", stiffness: 460, damping: 34 }} />}
            </motion.button>;
          })}
        </div>
      </section>

      <section className="detail-section page-width" aria-live="polite">
        <div className="detail-heading"><span className="detail-number">01 / 12</span><span className="detail-rule" /><span>{monthTitle}</span></div>
        <div className="detail-grid">
          <article className="season-card">
            <div className="season-card-head"><span className={`season-emblem season-emblem--${season}`}><SeasonGlyph season={season} size={21} /></span><div><span className="eyebrow card-eyebrow">{t.category}</span><h3>{seasonLabel}</h3></div></div>
            <p>{hasLocalPattern ? copy.description : t.unavailableBody}</p>
            {hasLocalPattern && <div className="condition-list">{copy.conditions.map((condition) => <span key={condition}><i />{condition}</span>)}</div>}
            <div className="source-strip"><span className="source-icon"><Leaf size={14} /></span>{hasLocalPattern ? <><a href={climatologyRecord?.sourceUrl} target="_blank" rel="noreferrer">{climatologyRecord?.sourceName}<ExternalLink size={11} /></a><span className="source-reviewed">{t.reviewed}: {climatologyReference.lastReviewed}</span></> : <span>{t.sourceNote}</span>}<span className="source-status">{hasLocalPattern ? "≈" : "—"}</span></div>
            <p className="small-caveat">{t.seasonalNote}</p>
          </article>
          <aside className="data-card">
            <div className="data-card-top"><span className="data-symbol"><Droplets size={16} /></span><span className="data-period">{monthLabels[month].short[locale]} / {year}</span></div>
            <div className="data-region"><span>{t.region}</span><strong><MapPin size={13} />{region.name}</strong></div>
            <div className="data-divider" />
            <div className="data-meta"><span>{t.dataType}</span><strong><i className={`data-type-dot ${!forecast && !hasLocalPattern ? "data-type-dot--unavailable" : ""}`} />{forecast ? t.forecast : hasLocalPattern ? t.climatology : t.unavailable}</strong></div>
            {year === 2026 || year === 2027 ? <div className="outlook-note"><div className="outlook-label"><span />{t.outlookTitle}</div><p>{bmkgOutlook.summary[locale]}</p><a href={bmkgOutlook.sourceUrl} target="_blank" rel="noreferrer">{t.sourceLabel}<ExternalLink size={12} /></a><span className="outlook-date">{t.updated}: {bmkgOutlook.publicationDate}</span></div> : <div className="regional-empty"><Wind size={16} /><span>{hasLocalPattern ? t.sourceNote : t.unavailable}</span></div>}
          </aside>
        </div>
      </section>

      <section className="education-section page-width" aria-labelledby="education-title">
        <div className="education-heading"><div><div className="eyebrow section-eyebrow"><span className="eyebrow-line" /> FIELD NOTES · 02</div><h2 id="education-title">{t.why}<span className="heading-period">?</span></h2><p>{t.whyIntro}</p></div><div className="education-orbit" aria-hidden="true"><span /><span /><span /><b>↗</b></div></div>
        <div className="education-list">
          <details className="education-card" open>
            <summary><span className="education-index">01</span><span className="education-icon"><CloudDrizzle size={18} /></span><strong>{t.rainTitle}</strong><ArrowDownRight size={16} className="education-chevron" /></summary>
            <p>{t.rainBody}</p><span className="education-footnote">MONSUN ASIA → INDONESIA</span>
          </details>
          <details className="education-card">
            <summary><span className="education-index">02</span><span className="education-icon education-icon--sun"><SunMedium size={18} /></span><strong>{t.dryTitle}</strong><ArrowDownRight size={16} className="education-chevron" /></summary>
            <p>{t.dryBody}</p><span className="education-footnote">MONSUN AUSTRALIA → INDONESIA</span>
          </details>
          <details className="education-card">
            <summary><span className="education-index">03</span><span className="education-icon education-icon--enso"><Waves size={18} /></span><strong>{t.ensoTitle}</strong><ArrowDownRight size={16} className="education-chevron" /></summary>
            <p>{t.ensoBody}</p><span className="education-footnote">PACIFIC OCEAN · ENSO</span>
          </details>
        </div>
      </section>

      <footer className="footer page-width"><a href="#top" className="brand footer-brand"><span className="brand-mark"><span /><span /><span /></span><span className="brand-name">musimku<span className="brand-period">.</span></span></a><span className="footer-tag">{t.footer}</span><span className="footer-signoff">{t.tagline}</span></footer>
    </main>
  );
}

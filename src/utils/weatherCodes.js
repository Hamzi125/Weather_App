// WMO-Wettercodes (Open-Meteo) → Beschreibung, Icon und Hintergrund
// https://open-meteo.com/en/docs#weathervariables
import { lang } from '../settings';

// code: [Deutsch, Arabisch, OpenWeatherMap-Icon, Gruppe]
const CODES = {
    0: ['Klarer Himmel', 'سماء صافية', '01', 'clear'],
    1: ['Überwiegend klar', 'صافٍ غالباً', '02', 'clear'],
    2: ['Teilweise bewölkt', 'غائم جزئياً', '03', 'cloudy'],
    3: ['Bedeckt', 'غائم', '04', 'cloudy'],
    45: ['Nebel', 'ضباب', '50', 'fog'],
    48: ['Reifnebel', 'ضباب متجمّد', '50', 'fog'],
    51: ['Leichter Nieselregen', 'رذاذ خفيف', '09', 'rain'],
    53: ['Nieselregen', 'رذاذ', '09', 'rain'],
    55: ['Starker Nieselregen', 'رذاذ كثيف', '09', 'rain'],
    56: ['Gefrierender Nieselregen', 'رذاذ متجمّد', '13', 'snow'],
    57: ['Starker gefrierender Nieselregen', 'رذاذ متجمّد كثيف', '13', 'snow'],
    61: ['Leichter Regen', 'مطر خفيف', '10', 'rain'],
    63: ['Regen', 'مطر', '10', 'rain'],
    65: ['Starker Regen', 'مطر غزير', '10', 'rain'],
    66: ['Gefrierender Regen', 'مطر متجمّد', '13', 'snow'],
    67: ['Starker gefrierender Regen', 'مطر متجمّد غزير', '13', 'snow'],
    71: ['Leichter Schneefall', 'ثلج خفيف', '13', 'snow'],
    73: ['Schneefall', 'ثلج', '13', 'snow'],
    75: ['Starker Schneefall', 'ثلج كثيف', '13', 'snow'],
    77: ['Schneegriesel', 'حبيبات ثلج', '13', 'snow'],
    80: ['Leichte Regenschauer', 'زخات مطر خفيفة', '09', 'rain'],
    81: ['Regenschauer', 'زخات مطر', '09', 'rain'],
    82: ['Heftige Regenschauer', 'زخات مطر عنيفة', '09', 'rain'],
    85: ['Leichte Schneeschauer', 'زخات ثلج خفيفة', '13', 'snow'],
    86: ['Starke Schneeschauer', 'زخات ثلج كثيفة', '13', 'snow'],
    95: ['Gewitter', 'عاصفة رعدية', '11', 'thunder'],
    96: ['Gewitter mit Hagel', 'عاصفة رعدية مع برَد', '11', 'thunder'],
    99: ['Schweres Gewitter mit Hagel', 'عاصفة رعدية شديدة مع برَد', '11', 'thunder'],
};

const UNKNOWN = ['Unbekannt', 'غير معروف', '01', 'clear'];

export const describeWeather = (code, isDay = true) => {
    const [de, ar, icon] = CODES[code] ?? UNKNOWN;
    return {
        label: lang.value === 'ar' ? ar : de,
        icon: `https://openweathermap.org/img/wn/${icon}${isDay ? 'd' : 'n'}@2x.png`,
    };
};

// Tailwind-Klassen für den Hintergrund-Verlauf (bg-linear-to-b)
const THEMES = {
    clear: ['from-sky-400 to-blue-600', 'from-indigo-950 to-slate-800'],
    cloudy: ['from-slate-400 to-slate-600', 'from-slate-700 to-slate-900'],
    fog: ['from-zinc-400 to-slate-600', 'from-zinc-600 to-slate-800'],
    rain: ['from-slate-500 to-blue-900', 'from-slate-800 to-blue-950'],
    snow: ['from-sky-300 to-slate-500', 'from-slate-500 to-slate-800'],
    thunder: ['from-slate-700 to-purple-950', 'from-slate-900 to-purple-950'],
};

export const DEFAULT_THEME = 'from-violet-500 to-pink-500';

export const themeFor = (code, isDay = true) => {
    const group = (CODES[code] ?? UNKNOWN)[3];
    return THEMES[group][isDay ? 0 : 1];
};

export const uvLevel = (uv) => (uv < 3 ? 0 : uv < 6 ? 1 : uv < 8 ? 2 : uv < 11 ? 3 : 4);

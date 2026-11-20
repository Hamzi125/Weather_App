// Open-Meteo: kostenlos, HTTPS, kein API-Key nötig – https://open-meteo.com
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const getJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

// Liefert bis zu `count` passende Städte (leeres Array, wenn nichts gefunden)
export const searchCities = async (name, language = 'de', count = 5) => {
    const params = new URLSearchParams({ name, count: String(count), language, format: 'json' });
    const data = await getJson(`${GEO_URL}?${params}`);
    return (data.results ?? []).map((city) => ({
        id: city.id,
        name: city.name,
        admin1: city.admin1 ?? '',
        country: city.country ?? '',
        latitude: city.latitude,
        longitude: city.longitude,
    }));
};

export const cityNameFromCoords = async (latitude, longitude, language = 'de', fallback = '') => {
    try {
        const params = new URLSearchParams({ latitude, longitude, localityLanguage: language });
        const data = await getJson(`${REVERSE_GEO_URL}?${params}`);
        return { name: data.city || data.locality || fallback, country: data.countryName ?? '' };
    } catch {
        return { name: fallback, country: '' };
    }
};

export const getForecast = async (latitude, longitude) => {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        hourly: 'temperature_2m,weather_code,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
        timezone: 'auto',
        forecast_days: '6',
    });
    const data = await getJson(`${FORECAST_URL}?${params}`);
    const c = data.current;
    const h = data.hourly;
    const d = data.daily;

    // Stündliche Werte ab der aktuellen (lokalen) Stunde, 24 Stunden lang
    const currentHour = c.time.slice(0, 13);
    const start = Math.max(0, h.time.findIndex((time) => time.slice(0, 13) === currentHour));

    return {
        current: {
            temp: c.temperature_2m,
            feelsLike: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            wind: c.wind_speed_10m,
            code: c.weather_code,
            isDay: c.is_day === 1,
        },
        today: {
            sunrise: d.sunrise[0]?.slice(11, 16) ?? '--:--',
            sunset: d.sunset[0]?.slice(11, 16) ?? '--:--',
            uv: d.uv_index_max[0] ?? 0,
        },
        hourly: h.time.slice(start, start + 24).map((time, i) => ({
            time: time.slice(11, 16),
            temp: h.temperature_2m[start + i],
            code: h.weather_code[start + i],
            isDay: h.is_day[start + i] === 1,
        })),
        // Index 0 ist heute → die nächsten 5 Tage
        daily: d.time.slice(1).map((date, i) => ({
            date,
            code: d.weather_code[i + 1],
            max: d.temperature_2m_max[i + 1],
            min: d.temperature_2m_min[i + 1],
        })),
    };
};

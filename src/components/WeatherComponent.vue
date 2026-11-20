<template>
    <div class="min-h-dvh flex flex-col items-center gap-6 p-5 sm:p-8 bg-linear-to-b border-10 border-white rounded-4xl text-white"
        :class="theme">
        <header class="w-full max-w-2xl flex flex-col gap-4">
            <div class="flex items-center gap-3">
                <img src="/weather-app.png" alt="" class="w-11 h-11 sm:w-14 sm:h-14 shrink-0">
                <span class="flex-1 text-xl sm:text-2xl font-semibold">{{ t('appName') }}</span>
                <button type="button" :aria-label="t('switchUnit')" :title="t('switchUnit')" dir="ltr"
                    class="rounded-full border border-white/70 bg-white/15 hover:bg-white/25 px-3 py-1.5 text-sm font-semibold cursor-pointer"
                    @click="toggleUnit">
                    <span :class="{ 'opacity-50': unit !== 'C' }">°C</span> /
                    <span :class="{ 'opacity-50': unit !== 'F' }">°F</span>
                </button>
                <button type="button" :aria-label="t('switchLang')" :title="t('switchLang')"
                    class="rounded-full border border-white/70 bg-white/15 hover:bg-white/25 px-3 py-1.5 text-sm font-semibold cursor-pointer"
                    @click="toggleLang">{{ t('otherLang') }}</button>
            </div>

            <SearchBar ref="searchBar" :loading="loading" @select="loadPlace" @locate="useMyLocation"
                @error="(msg) => (error = msg)" />

            <ul v-if="favorites.length" class="flex flex-wrap gap-2" :aria-label="t('favorites')">
                <li v-for="fav in favorites" :key="placeKey(fav)"
                    class="flex items-center rounded-full border border-white/70 bg-white/15 text-sm">
                    <button type="button" class="ps-3 pe-1 py-1.5 cursor-pointer hover:underline"
                        @click="loadPlace(fav)">★ {{ fav.name }}</button>
                    <button type="button" class="ps-1 pe-3 py-1.5 opacity-70 hover:opacity-100 cursor-pointer"
                        :aria-label="`${t('removeFavorite')}: ${fav.name}`" @click="removeFavorite(fav)">×</button>
                </li>
            </ul>
        </header>

        <main class="w-full max-w-2xl flex-1 flex flex-col items-center gap-6">
            <CurrentWeather :place="place" :weather="weather" :is-favorite="isFavorite" :loading="loading"
                @toggle-favorite="toggleFavorite" />
            <template v-if="weather">
                <HourlyForecast :hours="weather.hourly" />
                <DailyForecast :days="weather.daily" />
            </template>
        </main>

        <footer class="text-xs opacity-70 text-center">
            {{ t('dataBy') }}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer"
                class="underline hover:opacity-100">Open-Meteo.com</a>
            (CC BY 4.0)
        </footer>

        <Transition enter-from-class="opacity-0 translate-y-4" leave-to-class="opacity-0 translate-y-4"
            enter-active-class="transition duration-300" leave-active-class="transition duration-300">
            <div v-if="error" role="alert"
                class="fixed bottom-8 inset-x-4 mx-auto max-w-md flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-xl z-50">
                <span class="flex-1 font-semibold text-slate-700">{{ error }}</span>
                <button type="button" :aria-label="t('close')"
                    class="text-slate-400 hover:text-slate-700 cursor-pointer text-xl leading-none"
                    @click="error = ''">×</button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import SearchBar from './SearchBar.vue';
import CurrentWeather from './CurrentWeather.vue';
import HourlyForecast from './HourlyForecast.vue';
import DailyForecast from './DailyForecast.vue';
import { cityNameFromCoords, getForecast } from '../api/weather';
import { DEFAULT_THEME, themeFor } from '../utils/weatherCodes';
import { lang, t, toggleLang, toggleUnit, unit } from '../settings';
import { load, save } from '../utils/storage';

const LAST_PLACE_KEY = 'weatherapp:lastPlace';
const FAVORITES_KEY = 'weatherapp:favorites';

const searchBar = ref(null);
const place = ref(null);
const weather = ref(null);
const loading = ref(false);
const error = ref('');

const theme = computed(() =>
    weather.value ? themeFor(weather.value.current.code, weather.value.current.isDay) : DEFAULT_THEME
);

// Nur die Felder speichern, die wir zum erneuten Laden brauchen
const toPlace = ({ name, admin1 = '', country = '', latitude, longitude }) => ({ name, admin1, country, latitude, longitude });

// ---------- Favoriten ----------
const placeKey = (p) => `${p.latitude.toFixed(2)},${p.longitude.toFixed(2)}`;
const favorites = ref(load(FAVORITES_KEY, []).filter((p) => typeof p?.latitude === 'number'));
watch(favorites, (value) => save(FAVORITES_KEY, value));

const isFavorite = computed(() => !!place.value && favorites.value.some((f) => placeKey(f) === placeKey(place.value)));

const removeFavorite = (fav) => {
    favorites.value = favorites.value.filter((f) => placeKey(f) !== placeKey(fav));
};

const toggleFavorite = () => {
    if (!place.value) return;
    if (isFavorite.value) removeFavorite(place.value);
    else favorites.value = [...favorites.value, toPlace(place.value)];
};

// ---------- Fehlermeldung ----------
let errorTimer;
watch(error, (msg) => {
    clearTimeout(errorTimer);
    if (msg) errorTimer = setTimeout(() => (error.value = ''), 5000);
});

// ---------- Wetter laden ----------
let requestId = 0; // nur die Antwort der letzten Anfrage anzeigen

const loadPlace = async (newPlace) => {
    const id = ++requestId;
    loading.value = true;
    error.value = '';
    try {
        const data = await getForecast(newPlace.latitude, newPlace.longitude);
        if (id !== requestId) return;
        place.value = toPlace(newPlace);
        weather.value = data;
        save(LAST_PLACE_KEY, place.value);
        searchBar.value?.setQuery(newPlace.name);
    } catch (err) {
        if (id === requestId) error.value = t('networkError');
        console.error('Fehler beim Abrufen der Wetterdaten:', err);
    } finally {
        if (id === requestId) loading.value = false;
    }
};

const useMyLocation = () => {
    if (!navigator.geolocation) {
        error.value = t('geoUnsupported');
        return;
    }
    const id = ++requestId;
    loading.value = true;
    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            const { latitude, longitude } = coords;
            const info = await cityNameFromCoords(latitude, longitude, lang.value, t('myLocation'));
            if (id === requestId) loadPlace({ ...info, latitude, longitude });
        },
        () => {
            if (id !== requestId) return;
            loading.value = false;
            error.value = t('geoFailed');
        },
        { timeout: 10000 }
    );
};

onMounted(() => {
    const last = load(LAST_PLACE_KEY, null);
    if (typeof last?.latitude === 'number') loadPlace(last);
});
</script>

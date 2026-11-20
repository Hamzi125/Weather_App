<template>
    <section
        class="relative w-full max-w-sm rounded-3xl flex flex-col items-center shadow-xl p-6 border border-white bg-white/10 backdrop-blur-sm transition-opacity"
        :class="{ 'opacity-60': loading }">
        <template v-if="place && weather">
            <button type="button" class="absolute top-4 end-4 text-2xl cursor-pointer hover:scale-110 transition-transform"
                :aria-label="isFavorite ? t('removeFavorite') : t('addFavorite')"
                :title="isFavorite ? t('removeFavorite') : t('addFavorite')" :aria-pressed="isFavorite"
                @click="emit('toggle-favorite')">
                {{ isFavorite ? '★' : '☆' }}
            </button>

            <img :src="condition.icon" :alt="condition.label" class="w-28 h-28 weather-icon">
            <h1 class="text-3xl font-semibold text-center">{{ place.name }}</h1>
            <p v-if="subtitle" class="text-sm opacity-80 text-center">{{ subtitle }}</p>
            <p class="text-6xl font-light mt-3" dir="ltr">{{ formatTemp(weather.current.temp) }}</p>
            <p class="text-lg mt-1">{{ condition.label }}</p>

            <dl class="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-6 text-center text-sm">
                <div v-for="item in details" :key="item.label" class="rounded-2xl bg-white/10 px-1 py-2">
                    <dt class="opacity-80">{{ item.icon }} {{ item.label }}</dt>
                    <dd class="font-semibold" dir="auto">{{ item.value }}</dd>
                    <dd v-if="item.hint" class="text-xs opacity-80">{{ item.hint }}</dd>
                </div>
            </dl>
        </template>
        <template v-else>
            <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="" class="w-28 h-28 opacity-70">
            <h1 class="text-3xl font-semibold">---</h1>
            <p class="text-6xl font-light mt-3">--°</p>
            <p class="text-sm opacity-80 mt-4 text-center">{{ t('emptyHint') }}</p>
        </template>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { describeWeather, uvLevel } from '../utils/weatherCodes';
import { formatTemp, formatWind, t } from '../settings';

const props = defineProps({
    place: Object,
    weather: Object,
    isFavorite: Boolean,
    loading: Boolean,
});
const emit = defineEmits(['toggle-favorite']);

const condition = computed(() => describeWeather(props.weather.current.code, props.weather.current.isDay));

const subtitle = computed(() => [props.place.admin1, props.place.country].filter(Boolean).join(', '));

const details = computed(() => {
    const { current, today } = props.weather;
    return [
        { icon: '🌡️', label: t('feelsLike'), value: formatTemp(current.feelsLike) },
        { icon: '💧', label: t('humidity'), value: `${current.humidity}%` },
        { icon: '💨', label: t('wind'), value: formatWind(current.wind) },
        { icon: '☀️', label: t('uv'), value: Math.round(today.uv), hint: t('uvLevels')[uvLevel(today.uv)] },
        { icon: '🌅', label: t('sunrise'), value: today.sunrise },
        { icon: '🌇', label: t('sunset'), value: today.sunset },
    ];
});
</script>

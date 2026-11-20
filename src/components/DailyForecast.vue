<template>
    <section class="w-full">
        <h2 class="text-sm font-semibold opacity-90 mb-2 px-1">{{ t('daily') }}</h2>
        <ul class="grid grid-cols-5 gap-2 sm:gap-3">
            <li v-for="day in items" :key="day.date"
                class="flex flex-col items-center rounded-2xl border border-white/60 bg-white/10 p-2 sm:p-3 text-xs sm:text-sm">
                <span class="font-semibold">{{ day.weekday }}</span>
                <img :src="day.icon" :alt="day.label" :title="day.label" class="w-10 h-10 sm:w-12 sm:h-12 weather-icon">
                <span dir="ltr">{{ formatTemp(day.max) }}</span>
                <span class="opacity-70" dir="ltr">{{ formatTemp(day.min) }}</span>
            </li>
        </ul>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { describeWeather } from '../utils/weatherCodes';
import { formatTemp, locale, t } from '../settings';

const props = defineProps({ days: { type: Array, required: true } });

const items = computed(() =>
    props.days.map((day) => ({
        ...day,
        ...describeWeather(day.code),
        weekday: new Date(`${day.date}T00:00`).toLocaleDateString(locale.value, { weekday: 'short' }),
    }))
);
</script>

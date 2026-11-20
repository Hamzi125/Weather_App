<template>
    <section class="w-full">
        <h2 class="text-sm font-semibold opacity-90 mb-2 px-1">{{ t('hourly') }}</h2>
        <ul class="scroll-strip flex gap-2 overflow-x-auto pb-3 snap-x" @wheel="onWheel">
            <li v-for="(hour, i) in items" :key="hour.time"
                class="snap-start shrink-0 w-16 flex flex-col items-center rounded-2xl border border-white/60 bg-white/10 py-2 text-sm">
                <span class="opacity-90">{{ i === 0 ? t('now') : hour.time }}</span>
                <img :src="hour.icon" :alt="hour.label" :title="hour.label" class="w-10 h-10 weather-icon">
                <span class="font-semibold" dir="ltr">{{ formatTemp(hour.temp) }}</span>
            </li>
        </ul>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { describeWeather } from '../utils/weatherCodes';
import { formatTemp, t } from '../settings';

const props = defineProps({ hours: { type: Array, required: true } });

// Mausrad (vertikal) scrollt den Streifen horizontal – an den Enden scrollt wieder die Seite
const onWheel = (event) => {
    const el = event.currentTarget;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return; // Touchpad scrollt schon horizontal
    const rtl = getComputedStyle(el).direction === 'rtl';
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    const forward = event.deltaY > 0;
    if ((forward && pos >= max - 1) || (!forward && pos <= 0)) return;
    event.preventDefault();
    el.scrollBy({ left: rtl ? -event.deltaY : event.deltaY });
};

const items = computed(() => props.hours.map((hour) => ({ ...hour, ...describeWeather(hour.code, hour.isDay) })));
</script>

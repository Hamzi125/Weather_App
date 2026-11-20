<template>
    <form class="flex gap-2 w-full" role="search" @submit.prevent="submit">
        <div class="relative flex-1 min-w-0">
            <input ref="inputEl" v-model="query" type="text" autocomplete="off" role="combobox"
                aria-autocomplete="list" aria-controls="city-suggestions" :aria-expanded="open"
                :aria-activedescendant="activeIndex >= 0 ? `city-option-${activeIndex}` : undefined"
                :placeholder="t('searchPlaceholder')" :aria-label="t('searchPlaceholder')" :disabled="loading"
                class="w-full px-5 py-3 sm:py-4 border border-white rounded-3xl bg-white/10 placeholder-white/70 text-white focus:outline-none focus:bg-white/20 disabled:opacity-60"
                @input="onInput" @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.esc="close"
                @blur="close">
            <ul v-if="open" id="city-suggestions" role="listbox"
                class="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl bg-white text-slate-700 shadow-xl">
                <li v-for="(city, i) in suggestions" :id="`city-option-${i}`" :key="city.id" role="option"
                    :aria-selected="i === activeIndex" class="flex flex-col px-5 py-2.5 cursor-pointer"
                    :class="i === activeIndex ? 'bg-slate-100' : ''" @mousedown.prevent="choose(city)"
                    @mouseenter="activeIndex = i">
                    <span class="font-semibold">{{ city.name }}</span>
                    <span class="text-xs text-slate-500">{{ [city.admin1, city.country].filter(Boolean).join(', ') }}</span>
                </li>
                <li v-if="!suggestions.length" class="px-5 py-3 text-slate-500">{{ t('noResults') }}</li>
            </ul>
        </div>
        <button type="submit" :disabled="loading || !query.trim()" :aria-label="t('search')" :title="t('search')"
            class="px-4 sm:px-5 rounded-3xl border border-white bg-white/20 hover:bg-white/30 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
            <span v-if="loading"
                class="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>🔍</span>
        </button>
        <button type="button" :disabled="loading" :aria-label="t('myLocation')" :title="t('myLocation')"
            class="px-4 sm:px-5 rounded-3xl border border-white bg-white/20 hover:bg-white/30 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            @click="emit('locate')">📍</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { searchCities } from '../api/weather';
import { lang, t } from '../settings';

defineProps({ loading: Boolean });
const emit = defineEmits(['select', 'locate', 'error']);

const inputEl = ref(null);
const query = ref('');
const suggestions = ref([]);
const open = ref(false);
const activeIndex = ref(-1);

let debounceTimer;
let requestId = 0;

const fetchSuggestions = async (name) => {
    const id = ++requestId;
    try {
        const results = await searchCities(name, lang.value, 5);
        if (id !== requestId) return;
        suggestions.value = results;
        activeIndex.value = -1;
        open.value = document.activeElement === inputEl.value;
    } catch (err) {
        if (id === requestId) open.value = false;
        console.error('Fehler bei der Städtesuche:', err);
    }
};

const onInput = () => {
    clearTimeout(debounceTimer);
    const name = query.value.trim();
    if (name.length < 2) {
        requestId++;
        suggestions.value = [];
        open.value = false;
        return;
    }
    debounceTimer = setTimeout(() => fetchSuggestions(name), 300);
};

const move = (step) => {
    const count = suggestions.value.length;
    if (!open.value || !count) return;
    activeIndex.value = (activeIndex.value + step + count) % count;
};

const close = () => {
    open.value = false;
    activeIndex.value = -1;
};

const choose = (city) => {
    clearTimeout(debounceTimer);
    requestId++;
    query.value = city.name;
    suggestions.value = [];
    close();
    emit('select', city);
};

const submit = async () => {
    const name = query.value.trim();
    if (!name) return;
    if (open.value && activeIndex.value >= 0) return choose(suggestions.value[activeIndex.value]);

    clearTimeout(debounceTimer);
    const id = ++requestId;
    close();
    try {
        const [city] = await searchCities(name, lang.value, 1);
        if (id !== requestId) return;
        if (city) choose(city);
        else emit('error', t('cityNotFound', { name }));
    } catch (err) {
        console.error('Fehler bei der Städtesuche:', err);
        emit('error', t('networkError'));
    }
};

defineExpose({ setQuery: (value) => (query.value = value) });
</script>

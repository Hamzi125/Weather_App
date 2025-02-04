<template>
    <div>
        <div
            class="flex justify-center items-center h-screen p-5 bg-gray-200 bg-gradient-to-t from-pink-500 to-violet-500 border-10 border-white rounded-4xl">
            <img src="/src/assets/weather-app.png" alt="logo"
                class="w-20 h-20 absolute top-7 left-7 animate-spin-slow">
            <input type="text"
                class="w-2/4 p-5 border border-white enabled:hover:border-white rounded-3xl absolute top-9 focus:outline-none text-white"
                placeholder="Stadt eingeben..." v-model="query" @keypress.enter="fetchWeather">
            <div
                class="relative bg-transparent max-w-sm w-full h-auto rounded-3xl flex flex-col justify-center items-center shadow-xl p-5 border border-white">
                <img :src="weather.icon || 'https://openweathermap.org/img/wn/01d@2x.png'" alt="Wetter Icon"
                    class="w-25 h-25 sm:w-20 sm:h-20 md:w-28 md:h-28 mb-3 ">
                <h1 class="text-3xl sm:text-2xl md:text-3xl  font-semibold text-amber-50">{{ weather.city || '---' }}
                </h1>
                <p class="text-xl sm:text-xl md:text-2xl font-light text-amber-50 mt-3">{{ weather.temp !== "" ?
                    weather.temp + "°C" : "0" }}
                </p>
            </div>
            <p v-if="error" class="text-white mt-5 flex justify-center absolute bottom-5 left-1/2 transform -translate-x-1/2 ">{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const query = ref('');
const weather = ref({
    city: '',
    temp: '',
    icon: ''
});

const convertWeatherCode = (code) => {
    const mapping = {
        113: "01d", // Klarer Himmel
        116: "02d", // Teilweise bewölkt
        119: "03d", // Bewölkt
        122: "04d", // Sehr bewölkt
        143: "50d", // Nebel
        176: "09d", // Leichter Regen
        200: "11d", // Gewitter
        227: "13d", // Schneeschauer
        248: "50d", // Starker Nebel
        260: "50d", // Sehr dichter Nebel
        293: "10d", // Leichter Regen
        308: "09d", // Starker Regen
        320: "13d", // Schneefall
        389: "11d"  // Gewitter mit Regen
    };
    return mapping[code] || "01d"; // Standard: Klarer Himmel
};
const error = ref('');

// Wetter abrufen
const fetchWeather = async () => {
    if (!query.value) return; // Richtige Bedingung
    const API_key = 'cf3ebfc2a429f064bab28b42087a9bd7'; // Ersetze mit deinem API Key
    const API_URL_Current = `http://api.weatherstack.com/current?access_key=${API_key}&query=${query.value}`;
    try {
        const response = await axios.get(API_URL_Current);
        const data = response.data;
        if (data.success === false) {
            error.value = "Fehler: " + data.error.info;
            return;
        }
        weather.value = {
            city: data.location.name,
            temp: data.current.temperature,
            icon: `https://openweathermap.org/img/wn/${convertWeatherCode(data.current.weather_code)}@2x.png`
        };
        error.value = ""; // Fehler zurücksetzen
    } catch (err) {
        error.value = "Netzwerkfehler oder ungültige API-Antwort";
        console.error("Fehler beim Abrufen der Wetterdaten:", err);
    }
};
</script>

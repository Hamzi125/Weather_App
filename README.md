# Weather App ☀️🌧️

A simple weather app built with Vue 3 and Vite. The app uses the free [Open-Meteo API](https://open-meteo.com) (HTTPS, no API key required) to show current weather, an hourly and a 5-day forecast for any city.

## 🌿Features
✅ City search with autocomplete suggestions (keyboard navigation supported)
✅ Current weather: temperature, feels like, humidity, wind, UV index, sunrise & sunset
✅ Hourly forecast for the next 24 hours and a 5-day forecast
✅ Background changes with the weather and time of day
✅ ⭐ Favorite cities and 📍 weather for your current location
✅ °C / °F toggle
✅ German and Arabic (RTL) interface
✅ Installable as a PWA, last results available offline
✅ Remembers the last city, language and unit
✅ No API key needed – powered by Open-Meteo

## 📂Project Structure

weatherapp/
│-- src/components/ # Vue components (search, current weather, forecasts)
│-- src/api/ # Open-Meteo API calls
│-- src/utils/ # Weather codes, themes, localStorage helpers
│-- src/settings.js # Language (DE/AR), translations and units
│-- public/ # Static assets & PWA icons
│-- package.json # Dependencies & scripts
│-- vite.config.js # Vite configuration

## Installation & Usage

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd weatherapp
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm run dev
    ```

## 🌍 Live Demo
🔗 [View the Weather App on Vercel](https://weather-app-ivory-three-48.vercel.app/)

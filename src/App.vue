<template>
  <WeatherComponent />
</template>

<script setup>
import { inject } from '@vercel/analytics';
import WeatherComponent from './components/WeatherComponent.vue';

inject();
</script>

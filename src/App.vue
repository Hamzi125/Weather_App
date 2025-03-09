<template>
  <WeatherComponent />
</template>

<script setup>
import { defineAsyncComponent }  from 'vue';
const WeatherComponent = defineAsyncComponent(() => import('./components/WeatherComponent.vue'));
import { inject } from '@vercel/analytics'
inject();
</script>

 

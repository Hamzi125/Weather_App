<template>
  <navbar />
</template>

<script setup>
import { defineAsyncComponent }  from 'vue';
const Navbar = defineAsyncComponent(() => import('./components/navbar.vue'));

</script>



<style scoped>
 
</style>

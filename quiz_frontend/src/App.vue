<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100"> 
    <NavBar class="bg-white text-gray-900 shadow-md w-full" /> 
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </div>
  </div>
</template>

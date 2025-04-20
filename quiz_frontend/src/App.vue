<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
    <Toast />
  </v-app>
</template>

<script setup>
import Toast from '@/components/Toast.vue'
import NavBar from './components/NavBar.vue'
</script>
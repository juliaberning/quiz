<template>
  <v-snackbar
    v-model="store.isVisible"
    :color="store.color"
    :timeout="store.timeout"
    location="top"
  >
    {{ store.message }}
  </v-snackbar>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';

const store = useToastStore();
</script>
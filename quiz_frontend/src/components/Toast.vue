<template>
    <div
    v-if="store.isVisible"
    >
    {{ store.message }}
    </div>
</template>

<script setup>
import useToastStore from '@/stores/toast';

const store = useToastStore();

</script>
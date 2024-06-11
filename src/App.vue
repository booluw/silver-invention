<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Toaster as Toast } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster />
  <Toast class="pointer-events-auto" position="top-center" :visibleToasts="1" closeButton />
</template>

<style scoped>
</style>

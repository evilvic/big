<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  lightColor: { type: String, required: true },
  darkColor: { type: String, required: true },
  isDarkMode: { type: Boolean, required: true }
})
</script>

<template>
  <div class="collection-title" :style="{ color: lightColor }">
    {{ title }}
  </div>
</template>

<style scoped>
.collection-title {
  width: 100%;
  height: 100%;
  display: flex;
  font-family: 'Barrio', sans-serif;
  font-size: 2rem;
  line-height: 1.2;
  word-break: break-word;
  box-sizing: border-box;
}
</style>
<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectionsStore } from '@/stores/collectionStore'
import { useThemeStore } from '@/stores/themeStore'
import Slider from '@/components/SliderComponent.vue'

const route = useRoute()
const collectionsStore = useCollectionsStore()
const themeStore = useThemeStore()

const currentCollection = computed(() => collectionsStore.currentCollection)
const cards = computed(() => collectionsStore.currentCollection?.cards || [])
const isDarkMode = computed(() => themeStore.isDarkMode)

onMounted(() => {
  if (!collectionsStore.currentCollection) {
    collectionsStore.setCurrentCollection(parseInt(route.params.id))
  }
})
</script>

<template>
  <div class="container">
    <Slider 
      :cards="cards"
      :collectionLightColor="currentCollection.lightColor"
      :collectionDarkColor="currentCollection.darkColor"
      :isDarkMode="isDarkMode"
    />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>

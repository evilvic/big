<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectionsStore } from '@/stores/collections'
import Carousel from '@/components/Slider.vue'

const route = useRoute()
const store = useCollectionsStore()

const currentCollection = computed(() => store.currentCollection)
const cards = computed(() => store.currentCollection?.cards || [])

onMounted(() => {
  if (!store.currentCollection) {
    store.setCurrentCollection(parseInt(route.params.id))
  }
})
</script>

<template>
  <div class="container">
    <Carousel 
      :cards="cards"
      :collectionFontColor="currentCollection.fontColor"
      :collectionBackgroundColor="currentCollection.backgroundColor"
      :collectionDarkFontColor="currentCollection.darkFontColor"
    />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>

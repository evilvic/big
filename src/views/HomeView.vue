<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectionsStore } from '@/stores/collectionStore'
import Slider from '@/components/SliderComponent.vue'

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
    <Slider 
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

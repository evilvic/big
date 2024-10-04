<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collections'
import { storeToRefs } from 'pinia'
import('@/views/HomeView.vue')

const store = useCollectionsStore()
const router = useRouter()

const { collections } = storeToRefs(store)

const touchTimeout = ref(null)

const navigateToCollection = (collectionId) => {
  router.push({ name: 'collection', params: { id: collectionId } })
}

const prefetchCollection = (collectionId) => {
  store.setCurrentCollection(collectionId)
}

const handleTouchStart = (collectionId) => {
  touchTimeout.value = setTimeout(() => {
    prefetchCollection(collectionId)
  }, 100)
}

const handleTouchEnd = () => {
  if (touchTimeout.value) {
    clearTimeout(touchTimeout.value)
  }
}
</script>

<template>
  <div class="collections-container">
    <h1>Collections</h1>
    <ul class="collections-list">
      <li
        v-for="collection in collections" 
        :key="collection.id" 
        @click="navigateToCollection(collection.id)"
        @mouseover="prefetchCollection(collection.id)"
        @touchstart="handleTouchStart(collection.id)"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
        :style="{
          backgroundColor: collection.backgroundColor,
          color: collection.fontColor
        }"
      >
        <h2 :style="{ color: collection.darkFontColor }">
          {{ collection.title }}
        </h2>
        <p>
          {{ collection.description }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.collections-container {
  padding: 20px;
}

.collections-list {
  list-style-type: none;
  padding: 0;
}

.collections-list li {
  cursor: pointer;
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
}
</style>
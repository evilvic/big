<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collectionStore'
import { storeToRefs } from 'pinia'
import('@/views/HomeView.vue')

const store = useCollectionsStore()
const router = useRouter()

const { collections } = storeToRefs(store)

const touchTimeout = ref(null)
const isDarkMode = ref(false)

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

const getCollectionStyle = (collection) => {
  return {
    backgroundColor: isDarkMode.value ? "#2B2B2B" : collection.lightColor,
    color: isDarkMode.value ? collection.lightColor : collection.darkColor,
  }
}

const updateColorScheme = (e) => {
  isDarkMode.value = e.matches
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  isDarkMode.value = mediaQuery.matches
  mediaQuery.addEventListener('change', updateColorScheme)
})

onUnmounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.removeEventListener('change', updateColorScheme)
})
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
        :style="getCollectionStyle(collection)"
      >
        <h2>
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

h2 {
  color: inherit;
}
</style>
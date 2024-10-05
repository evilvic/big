<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collectionStore'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'
import CollectionTitle from '@/components/ButtonComponent.vue'
import('@/views/HomeView.vue')

const collectionsStore = useCollectionsStore()
const themeStore = useThemeStore()
const router = useRouter()

const { collections } = storeToRefs(collectionsStore)
const { isDarkMode } = storeToRefs(themeStore)

const touchTimeout = ref(null)
const titleRefs = ref([])

const navigateToCollection = (collectionId) => {
  router.push({ name: 'collection', params: { id: collectionId } })
}

const prefetchCollection = (collectionId) => {
  collectionsStore.setCurrentCollection(collectionId)
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
    backgroundColor: collection.darkColor,
    color: collection.lightColor
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
        :style="getCollectionStyle(collection)"
      >
        <CollectionTitle 
          :title="collection.title"
          :lightColor="collection.lightColor"
          :darkColor="collection.darkColor"
          :isDarkMode="isDarkMode"
        />
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.collections-list li {
  cursor: pointer;
  padding: 20px;
  border-radius: 15px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

h2 {
  color: inherit;
  margin: 0;
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
  transition: font-size 0.3s ease;
}
</style>
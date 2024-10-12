<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'
import CollectionTitle from '@/components/ButtonComponent.vue'
import('@/views/SlidesView.vue')

const collectionsStore = useDecksStore()
const themeStore = useThemeStore()
const router = useRouter()

const { collections } = storeToRefs(collectionsStore)
const { isDarkMode } = storeToRefs(themeStore)

const touchTimeout = ref(null)
const longPressDelay = 1000

const navigateToCollection = (collectionId) => {
  router.push({ name: 'slides', params: { id: collectionId } })
}

const navigateToConfig = (collectionId) => {
  router.push({ name: 'collection-config', params: { id: collectionId } })
}

const prefetchCollection = (collectionId) => {
  collectionsStore.setCurrentCollection(collectionId)
}

const handleTouchStart = (collectionId) => {
  touchTimeout.value = setTimeout(() => {
    navigateToConfig(collectionId)
  }, longPressDelay)
}

const handleTouchEnd = (event, collectionId) => {
  if (touchTimeout.value) {
    clearTimeout(touchTimeout.value)
    if (event.type !== 'click') {
      navigateToCollection(collectionId)
    }
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
  <main>
    <div class="collections-container">
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
            :title="collection.name"
            :lightColor="collection.lightColor"
            :darkColor="collection.darkColor"
            :isDarkMode="isDarkMode"
          />
        </li>
      </ul>
      <RouterLink to="/collections/new" class="new">
        + New collection
      </RouterLink>
    </div>
  </main>
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
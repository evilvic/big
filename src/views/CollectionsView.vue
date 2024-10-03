<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const collections = ref([
  {
    id: 1,
    title: "Motivational Quotes",
    cards: [
      { text: "Did you get older doing nothing today?", fontColor: "#FFF2D7", backgroundColor: "#F98866" },
      { text: "Don't you wanna stop complaining?", fontColor: "#FFFFFF", backgroundColor: "#4A4E4D" },
    ]
  },
  {
    id: 2,
    title: "Positive Affirmations",
    cards: [
      { text: "I'm not a bad person, I'm a good person", fontColor: "#2A363B", backgroundColor: "#99B898" },
      { text: "Water your plants", fontColor: "#FF847C", backgroundColor: "#2A363B" },
    ]
  }
])

const navigateToCollection = (collectionId) => {
  router.push({ name: 'collection', params: { id: collectionId } })
}

const preloadHomeView = () => {
  import('@/views/HomeView.vue')
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
        @mouseover="preloadHomeView"
      >
        {{ collection.title }}
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
  padding: 10px;
  margin: 10px 0;
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>
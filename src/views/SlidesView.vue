<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { useCardsStore } from '@/stores/cardsStore'
import Slider from '@/components/SliderComponent.vue'

const route = useRoute()
const router = useRouter()
const decksStore = useDecksStore()
const cardsStore = useCardsStore()

const currentDeck = ref(null)
const isLoading = ref(true)
const error = ref(null)

const cards = computed(() => cardsStore.cards)

onMounted(async () => {
  try {
    const deckId = parseInt(route.params.id)
    currentDeck.value = await decksStore.getDeck(deckId)
    if (!currentDeck.value) {
      throw new Error('Deck not found')
    }
    await cardsStore.fetchCardsByDeckId(deckId)
    isLoading.value = false
  } catch (err) {
    console.error('Error loading deck:', err)
    error.value = 'Failed to load deck. Please try again.'
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      Loading...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="goBackToDecks">Go back to decks</button>
    </div>
    <Slider
      v-else
      :cards="cards"
      :collectionLightColor="currentDeck.lightColor"
      :collectionDarkColor="currentDeck.darkColor"
    />
    <div v-else class="no-cards">
        This deck has no cards yet.
        <button @click="goBackToDecks">Go back to decks</button>
      </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>

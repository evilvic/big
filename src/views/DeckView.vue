<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { useCardsStore } from '@/stores/cardsStore'
import DeckCarouselComponent from '@/components/DeckCarouselComponent.vue'

const route = useRoute()
const router = useRouter()
const decksStore = useDecksStore()
const cardsStore = useCardsStore()

const currentDeck = ref(null)
const isLoading = ref(true)
const error = ref(null)

const cards = computed(() => cardsStore.cards)

const goBackToDecks = () => {
  router.push({ name: 'decks' })
}

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
  <main>
    <div class="container">
      <div v-if="isLoading" class="loading">
        Loading...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="goBackToDecks">Go back to decks</button>
      </div>
      <template v-else>
        <DeckCarouselComponent
          :cards="cards"
          :deckBackgroundColor="currentDeck.backgroundColor"
          :deckColor="currentDeck.color"
          :deckId="currentDeck.id"
        />
      </template>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0;
}
.container {
  width: 100%;
  height: 100%;
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
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
const cardIndex = ref(0)
const carouselRef = ref(null)

const cards = computed(() => cardsStore.cards)

const goBackToDecks = () => {
  router.push({ name: 'home' })
}

onMounted(async () => {
  try {
    const deckId = parseInt(route.params.id)
    currentDeck.value = await decksStore.getDeck(deckId)
    if (!currentDeck.value) {
      throw new Error('Deck not found')
    }
    await cardsStore.fetchCardsByDeckId(deckId)

    if (route.query.cardId) {
      const index = cards.value.findIndex(card => card.id === parseInt(route.query.cardId))
      if (index !== -1) {
        cardIndex.value = index
      }

      await nextTick()
      router.replace({ name: 'deck', params: { id: route.params.id } })
    }

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
          ref="carouselRef"
          :cards="cards"
          :deckBackgroundColor="currentDeck.backgroundColor"
          :deckColor="currentDeck.color"
          :deckId="currentDeck.id"
          :cardIndex="cardIndex"
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

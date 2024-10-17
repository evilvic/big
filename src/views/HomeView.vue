<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { storeToRefs } from 'pinia'
import { LONG_PRESS_DELAY } from '@/data/constants';

import '@/views/DeckView.vue'
import '@/components/DeckCarouselComponent.vue'
import '@/components/CardComponent.vue'
import '@/views/DeckFormView.vue'

const router = useRouter()
const decksStore = useDecksStore()

const { decks } = storeToRefs(decksStore)

const SCROLL_THRESHOLD = 10

const isScrolling = ref(false)
let touchTimer = ref(null)
const isComponentMounted = ref(true)

let touchStartX = 0
let touchStartY = 0

onMounted(() => {
  decksStore.fetchDecks()
})

onUnmounted(() => {
  isComponentMounted.value = false
  if (touchTimer.value) {
    clearTimeout(touchTimer.value)
    touchTimer.value = null
  }
})

const navigateToDeck = (deckId) => {
  if (isComponentMounted.value) {
    router.push({ name: 'deck', params: { id: deckId } })
  }
}

const navigateToDeckEdit = (deckId) => {
  if (isComponentMounted.value) {
    router.push({ name: 'edit-deck', params: { id: deckId } })
  }
}

const handleTouchStart = (event, deckId) => {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
  isScrolling.value = false
  touchTimer.value = setTimeout(() => {
    if (isComponentMounted.value) {
      navigateToDeckEdit(deckId)
    }
  }, LONG_PRESS_DELAY)
}

const handleTouchMove = (event) => {
  if (touchTimer.value) {
    const touchEndX = event.touches[0].clientX
    const touchEndY = event.touches[0].clientY
    const deltaX = Math.abs(touchEndX - touchStartX)
    const deltaY = Math.abs(touchEndY - touchStartY)
  
    if (deltaX > SCROLL_THRESHOLD || deltaY > SCROLL_THRESHOLD) {
      clearTimeout(touchTimer.value)
      touchTimer.value = null
      isScrolling.value = true
    }
  }
}

const handleTouchEnd = (event, deckId) => {
  if (touchTimer.value) {
    clearTimeout(touchTimer.value)
    touchTimer.value = null
  }
  
  if (!isScrolling.value && event.type !== 'touchcancel' && isComponentMounted.value) {
    navigateToDeck(deckId)
  }
  
  isScrolling.value = false
}

const getDeckStyle = (deck) => ({
  backgroundColor: deck.backgroundColor,
  color: deck.color
})
</script>

<template>
  <main>
    <ul
      class="decks-list"
      role="list"
    >
      <li
        v-for="deck in decks" 
        :key="deck.id"
        role="listitem"
        class="deck-item"
        @touchstart="handleTouchStart($event, deck.id)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd($event, deck.id)"
        @touchcancel="handleTouchEnd($event, deck.id)"
        :style="getDeckStyle(deck)"
        tabindex="0"
        :aria-label="`Open deck: ${deck.name}`"
      >
        {{ deck.name }}
      </li>
    </ul>
    <RouterLink to="/decks/new">
      new deck >
    </RouterLink>
  </main>
</template>

<style scoped>
.decks-list {
  width: 100%;
  list-style-type: none;
  padding: 0;
}

.deck-item {
  width: 100%;
  cursor: pointer;
  padding: 16px;
  border-radius: var(--border);
  display: flex;
  align-items: center;
  font-family: 'Barrio', display;
  font-size: 2.5rem;
  line-height: 1;
  word-break: break-word;
  margin-bottom: 16px;
  touch-action: none;
}
</style>
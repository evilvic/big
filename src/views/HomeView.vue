<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { storeToRefs } from 'pinia'

import '@/views/DeckView.vue'
import '@/components/DeckCarouselComponent.vue'
import '@/components/CardComponent.vue'
import '@/views/DeckFormView.vue'

const router = useRouter()
const decksStore = useDecksStore()

const { decks } = storeToRefs(decksStore)

const LONG_PRESS_DELAY = 500
let touchTimer = ref(null)

onMounted(() => {
  decksStore.fetchDecks()
})

onUnmounted(() => {
  if (touchTimer.value) clearTimeout(touchTimer.value)
})

const navigateToDeck = (deckId) => {
  router.push({ name: 'deck', params: { id: deckId } })
}

const navigateToDeckEdit = (deckId) => {
  router.push({ name: 'edit-deck', params: { id: deckId } })
}

const handleTouchStart = (deckId) => {
  touchTimer.value = setTimeout(() => navigateToDeckEdit(deckId), LONG_PRESS_DELAY)
}

const handleTouchEnd = (event, deckId) => {
  if (touchTimer.value) clearTimeout(touchTimer.value)
  if (event.type !== 'touchcancel') {
    navigateToDeck(deckId)
  }
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
        @click="navigateToDeck(deck.id)"
        @touchstart="handleTouchStart(deck.id)"
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
}
</style>
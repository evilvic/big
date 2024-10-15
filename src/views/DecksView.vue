<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { storeToRefs } from 'pinia'

const decksStore = useDecksStore()
const router = useRouter()

const { decks } = storeToRefs(decksStore)

const longPressDelay = 2000
let touchTimer

onMounted(() => {
  decksStore.fetchDecks()
})

const navigateToDeck = (deckId) => {
  router.push({ name: 'deck', params: { id: deckId } })
}

const navigateToDeckEdit = (deckId) => {
  router.push({ name: 'edit-deck', params: { id: deckId } })
}

const handleTouchStart = (deckId) => {
  touchTimer = setTimeout(() => navigateToDeckEdit(deckId), longPressDelay)
}

const handleTouchEnd = (event, deckId) => {
  clearTimeout(touchTimer)
  if (event.type !== 'click') {
    navigateToDeck(deckId)
  }
}

const getDeckStyle = (deck) => {
  return {
    backgroundColor: deck.backgroundColor,
    color: deck.color
  }
}
</script>

<template>
  <main>
    <ul class="decks-list" role="list">
      <li
        v-for="deck in decks" 
        :key="deck.id"
        role="listitem"
      >
        <div
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
        </div>
      </li>
    </ul>
    <RouterLink to="/decks/new" class="new-deck-link">
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
  padding: 20px;
  border-radius: var(--border);
  display: flex;
  align-items: center;
  overflow: hidden;
  font-family: 'Barrio', sans-serif;
  font-size: 2rem;
  line-height: 1.2;
  word-break: break-word;
}

</style>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useDecksStore } from '@/stores/decksStore'
import { storeToRefs } from 'pinia'
import DeckTitle from '@/components/ButtonComponent.vue'
import('@/views/SlidesView.vue')

const decksStore = useDecksStore()
const router = useRouter()

const { decks } = storeToRefs(decksStore)

const touchTimeout = ref(null)
const longPressDelay = 1000

onMounted(() => {
  decksStore.fetchDecks()
})

const navigateToDeck = (deckId) => {
  router.push({ name: 'slides', params: { id: deckId } })
}

const navigateToDeckEdit = (deckId) => {
  router.push({ name: 'edit-deck', params: { id: deckId } })
}

const handleTouchStart = (deckId) => {
  touchTimeout.value = setTimeout(() => {
    navigateToDeckEdit(deckId)
  }, longPressDelay)
}

const handleTouchEnd = (event, deckId) => {
  if (touchTimeout.value) {
    clearTimeout(touchTimeout.value)
    touchTimeout.value = null
    if (event.type !== 'click') {
      navigateToDeck(deckId)
    }
  }
}

const getDeckStyle = (deck) => {
  return {
    backgroundColor: deck.backgroundColor,
  }
}

onUnmounted(() => {
  if (touchTimeout.value) {
    clearTimeout(touchTimeout.value)
  }
})
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
          <DeckTitle 
            :title="deck.name"
            :backgroundColor="deck.backgroundColor"
            :color="deck.color"
          />
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
  justify-content: center;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

</style>
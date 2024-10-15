import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'
import { useCardsStore } from '@/stores/cardsStore'

export const useDecksStore = defineStore('decks', () => {
  const dataController = IndexedDBController.getInstance()
  const decks = ref([])
  const isInitialized = ref(false)

  const initializeStore = async () => {
    if (!isInitialized.value) {
      await fetchDecks()
      isInitialized.value = true
    }
  }

  const fetchDecks = async () => {
    decks.value = await dataController.getAllDecks()
  }

  const createDeck = async (deck) => {
    const { id, ...deckWithoutId } = deck;
    const now = new Date().toISOString()
    const newDeck = {
      ...deckWithoutId,
      createdAt: now,
      updatedAt: now,
    }
    const newId = await dataController.createDeck(newDeck)
    decks.value.push({ ...newDeck, id: newId });
    return newId
  }

  const getDeck = async (id) => {
    return await dataController.getDeck(id)
  }

  const updateDeck = async (deck) => {
    deck.updatedAt = new Date().toISOString()
    await dataController.updateDeck(deck)
    const index = decks.value.findIndex(d => d.id === deck.id)
    if (index !== -1) {
      decks.value[index] = deck
    }
  }

  const deleteDeck = async (id) => {
    const cardsStore = useCardsStore()

    await dataController.deleteCardsForDeck(id)
    await dataController.deleteDeck(id)

    decks.value = decks.value.filter(deck => deck.id !== id)
    cardsStore.deleteCardsForDeck(id)
  }

  const currentDeckId = ref(null)

  const currentDeck = computed(() =>
    decks.value.find(deck => deck.id === currentDeckId.value)
  )

  function setCurrentDeck(id) {
    currentDeckId.value = parseInt(id)
  }

  return {
    decks,
    initializeStore,
    fetchDecks,
    createDeck,
    getDeck,
    updateDeck,
    deleteDeck,
    setCurrentDeck,
    currentDeck,
  }
})
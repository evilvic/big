import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'

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
    const plainDeck = JSON.parse(JSON.stringify(deckWithoutId));
    const newId = await dataController.createDeck(plainDeck)
    decks.value.push({ ...plainDeck, id: newId });
    return newId
  }

  const getDeck = async (id) => {
    return await dataController.getDeck(id)
  }

  const updateDeck = async (deck) => {
    await dataController.updateDeck(deck)
    await fetchDecks()
  }

  const deleteDeck = async (id) => {
    await dataController.deleteDeck(id)
    await fetchDecks()
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
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'

export const useDecksStore = defineStore('decks', () => {
  const dataController = IndexedDBController.getInstance()
  const decks = ref([])

  const initializeStore = async () => {
    await fetchAllDecks()
  }

  const fetchAllDecks = async () => {
    decks.value = await dataController.getAllDecks()
  }

  const createDeck = async (deck) => {
    const plainDeck = JSON.parse(JSON.stringify(deck));
    const id = await dataController.createDeck(plainDeck)
    decks.value.push({ ...plainDeck, id });
    return id
  }

  const getDeck = async (id) => {
    return await dataController.getDeck(id)
  }

  const updateDeck = async (deck) => {
    await dataController.updateDeck(deck)
    await fetchAllDecks()
  }

  const deleteDeck = async (id) => {
    await dataController.deleteDeck(id)
    await fetchAllDecks()
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
    createDeck,
    getDeck,
    updateDeck,
    deleteDeck,
    setCurrentDeck,
    currentDeck,
  }
})
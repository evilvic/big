import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { DataControllerFactory } from '@/data/dataControllerFactory'
import { useCardsStore } from '@/stores/cardsStore'

export const useDecksStore = defineStore('decks', () => {
  const dataController = reactive({})
  const decks = ref([])

  const initializeStore = async () => {
    dataController.value = await DataControllerFactory.getInstance().getController()
  }

  const fetchDecks = async () => {
    await initializeStore()
    decks.value = await dataController.value.getAllDecks()
  }

  const getDeck = async (id) => {
    return await dataController.value.getDeck(id)
  }

  const createDeck = async (deck) => {
    const { id, ...deckWithoutId } = deck;
    const now = new Date().toISOString()
    const newDeck = {
      ...deckWithoutId,
      createdAt: now,
      updatedAt: now,
      order: decks.value.length
    }
    const newId = await dataController.value.createDeck(newDeck)
    decks.value.push({ ...newDeck, id: newId });
    return newId
  }

  const updateDeck = async (deck) => {
    deck.updatedAt = new Date().toISOString()
    await dataController.value.updateDeck(deck)
    const index = decks.value.findIndex(d => d.id === deck.id)
    if (index !== -1) {
      decks.value[index] = deck
    }
  }

  const deleteDeck = async (id) => {
    const cardsStore = useCardsStore()
    await dataController.value.deleteDeck(id)

    decks.value = decks.value.filter(deck => deck.id !== id)
    decks.value.forEach((deck, index) => {
      deck.order = index
      dataController.value.updateDeck(deck)
    });
    cardsStore.deleteCardsForDeck(id)
  }

  const currentDeckId = ref(null)

  const currentDeck = computed(() =>
    decks.value.find(deck => deck.id === currentDeckId.value)
  )

  function setCurrentDeck(id) {
    currentDeckId.value = id
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
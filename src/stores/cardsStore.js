import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'

export const useCardsStore = defineStore('cards', () => {
  const dataController = IndexedDBController.getInstance()
  const cards = ref([])
  const isInitialized = ref(false)

  const fetchCardsByDeckId = async (deckId) => {
    cards.value = await dataController.getCardsByDeckId(deckId)
  }

  const createCard = async (card) => {
    const id = await dataController.createCard(card)
    cards.value.push({ ...card, id })
    return id
  }

  const updateCard = async (card) => {
    await dataController.updateCard(card)
    const index = cards.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      cards.value[index] = card
    }
  }

  const deleteCard = async (id) => {
    await dataController.deleteCard(id)
    cards.value = cards.value.filter(card => card.id !== id)
  }

  return {
    cards,
    fetchCardsByDeckId,
    createCard,
    updateCard,
    deleteCard
  }
})
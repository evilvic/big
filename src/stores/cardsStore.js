import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { DataControllerFactory } from '@/data/dataControllerFactory'

export const useCardsStore = defineStore('cards', () => {
  const dataController = reactive({})
  const cards = ref([])

  const initializeStore = async () => {
    dataController.value = await DataControllerFactory.getInstance().getController()
  }

  const fetchCardsByDeckId = async (deckId) => {
    const fetchedCards = await dataController.value.getCardsByDeckId(deckId)
    cards.value = fetchedCards.cards
  }

  const getCard = async (id) => {
    return await dataController.value.getCard(id)
  }

  const createCard = async (card) => {
    const { id, ...cardWithoutId } = card;
    const now = new Date().toISOString()
    const newCard = {
      ...cardWithoutId,
      createdAt: now,
      updatedAt: now,
      order: cards.value.length
    }
    const newId = await dataController.value.createCard(newCard)
    cards.value.push({ ...newCard, id: newId });
    return newId
  }

  const updateCard = async (card) => {
    card.updatedAt = new Date().toISOString()
    await dataController.value.updateCard(card)
    const index = cards.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      cards.value[index] = card
    }
  }

  const deleteCard = async (id) => {
    await dataController.value.deleteCard(id)
    cards.value = cards.value.filter(card => card.id !== id)
    cards.value.forEach((card, index) => {
      card.order = index
      dataController.value.updateCard(card)
    })
  }

  const deleteCardsForDeck = async (deckId) => {
    cards.value = cards.value.filter(card => card.deckId !== deckId);
  }

  return {
    cards,
    initializeStore,
    fetchCardsByDeckId,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    deleteCardsForDeck,
  }
})
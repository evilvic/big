import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'

export const useCardsStore = defineStore('cards', () => {
  const dataController = IndexedDBController.getInstance()
  const cards = ref([])

  const fetchCardsByDeckId = async (deckId) => {
    cards.value = await dataController.getCardsByDeckId(deckId)
  }

  const getCard = async (id) => {
    return await dataController.getCard(id)
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
    const newId = await dataController.createCard(newCard)
    cards.value.push({ ...newCard, id: newId });
    return newId
  }

  const updateCard = async (card) => {
    card.updatedAt = new Date().toISOString()
    await dataController.updateCard(card)
    const index = cards.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      cards.value[index] = card
    }
  }

  const deleteCard = async (id) => {
    await dataController.deleteCard(id)
    cards.value = cards.value.filter(card => card.id !== id)
    cards.value.forEach((card, index) => {
      card.order = index
      dataController.updateCard(card)
    })
  }

  const deleteCardsForDeck = async (deckId) => {
    cards.value = cards.value.filter(card => card.deckId !== deckId);
  }

  return {
    cards,
    fetchCardsByDeckId,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    deleteCardsForDeck,
  }
})
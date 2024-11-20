import { registerPlugin } from '@capacitor/core'

const SwiftData = registerPlugin('SwiftDataPlugin')

export class SwiftDataController {

  async initializeDB() {
    return await SwiftData.initializeDB()
  }

  async createDeck(deck) {
    const { id } = await SwiftData.createDeck(deck)
    return id
  }

  async getAllDecks() {
    const { decks } = await SwiftData.getAllDecks()
    return decks
  }

  async getDeck(id) {
    console.log('getDeck', id)
    return await SwiftData.getDeck({ id })
  }

  async updateDeck(deck) {
    return await SwiftData.updateDeck(deck)
  }

  async deleteDeck(id) {
    return await SwiftData.deleteDeck({ id })
  }

  async createCard(card) {
    const { id } = await SwiftData.createCard(card)
    return id
  }

  async getCard(id) {
    return await SwiftData.getCard({ id })
  }

  async getCardsByDeckId(deckId) {
    return await SwiftData.getCardsByDeckId({ deckId })
  }

  async updateCard(card) {
    return await SwiftData.updateCard(card)
  }

  async deleteCard(id) {
    return await SwiftData.deleteCard({ id })
  }

}

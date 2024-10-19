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
}
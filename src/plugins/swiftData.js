import { registerPlugin } from '@capacitor/core'

const SwiftData = registerPlugin('SwiftDataPlugin')

export class SwiftDataController {

  async initializeDB() {
    return Promise.resolve()
  }

  async createDeck(deck) {
    return await SwiftData.createDeck(deck)
  }

  async getAllDecks() {
    return await SwiftData.getAllDecks()
  }
}
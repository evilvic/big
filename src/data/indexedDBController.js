export class IndexedDBController {
  static instance = null;

  constructor() {
    if (IndexedDBController.instance) {
      return IndexedDBController.instance;
    }
    this.dbName = 'bigDB'
    this.dbVersion = 1
    this.db = null
    IndexedDBController.instance = this;
  }

  initializeDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event) => {
        reject(event.target.error)
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        this.db = event.target.result
        if (!this.db.objectStoreNames.contains('decks')) {
          const decksStore = this.db.createObjectStore('decks', { keyPath: 'id', autoIncrement: true })
          decksStore.createIndex('order', 'order', { unique: false })
          decksStore.createIndex('createdAt', 'createdAt', { unique: false })
          decksStore.createIndex('updatedAt', 'updatedAt', { unique: false })

        }

        if (!this.db.objectStoreNames.contains('cards')) {
          const cardsStore = this.db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true })
          cardsStore.createIndex('deckId', 'deckId', { unique: false })
          cardsStore.createIndex('order', 'order', { unique: false })
          cardsStore.createIndex('createdAt', 'createdAt', { unique: false })
          cardsStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }

      request.onblocked = (event) => {
        reject(new Error('IndexedDB blocked'));
      };
    })
  }

  createDeck(deck) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['decks'], 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.add(deck);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getAllDecks() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['decks'], 'readonly');
      const store = transaction.objectStore('decks');
      const request = store.getAll();

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getDeck(id) {
    id = parseInt(id)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['decks'], 'readonly');
      const store = transaction.objectStore('decks');
      const request = store.get(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  updateDeck(deck) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['decks'], 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.put(deck);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  deleteDeck(id) {
    id = parseInt(id)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['decks'], 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.delete(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  deleteCardsForDeck(deckId) {
    deckId = parseInt(deckId)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readwrite');
      const store = transaction.objectStore('cards');
      const index = store.index('deckId');
      const request = index.openCursor(IDBKeyRange.only(deckId));

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  getCard(id) {
    id = parseInt(id)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readonly');
      const store = transaction.objectStore('cards');
      const request = store.get(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  createCard(card) {
    card.deckId = parseInt(card.deckId)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.add(card);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getCardsByDeckId(deckId) {
    deckId = parseInt(deckId)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readonly');
      const store = transaction.objectStore('cards');
      const index = store.index('deckId');
      const request = index.getAll(deckId);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  updateCard(card) {
    card.deckId = parseInt(card.deckId)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.put(card);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  deleteCard(id) {
    id = parseInt(id)
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.delete(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  static getInstance() {
    if (!IndexedDBController.instance) {
      IndexedDBController.instance = new IndexedDBController();
    }
    return IndexedDBController.instance;
  }
}
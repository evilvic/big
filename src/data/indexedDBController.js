export class IndexedDBController {
  constructor() {
    this.dbName = 'bigCollectionsDB'
    this.dbVersion = 1
    this.db = null
  }

  initializeDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onupgradeneeded = () => {
        this.db = request.result
        this.db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true })
      }
    })
  }

  createCollection(collection) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readwrite');
      const store = transaction.objectStore('collections');
      const request = store.add(collection);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getCollection(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readonly');
      const store = transaction.objectStore('collections');
      const request = store.get(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getAllCollections() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readonly');
      const store = transaction.objectStore('collections');
      const request = store.getAll();

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  updateCollection(collection) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readwrite');
      const store = transaction.objectStore('collections');
      const request = store.put(collection);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  deleteCollection(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['collections'], 'readwrite');
      const store = transaction.objectStore('collections');
      const request = store.delete(id);

      request.onerror = () => {
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }
}
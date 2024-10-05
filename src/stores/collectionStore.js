// src/stores/collections.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IndexedDBController } from '@/data/indexedDBController'

export const useCollectionsStore = defineStore('collections', () => {
  const dataController = new IndexedDBController()
  const collections = ref([])

  const initializeStore = async () => {
    await dataController.initializeDB()
    await fetchAllCollections()
  }

  const fetchAllCollections = async () => {
    collections.value = await dataController.getAllCollections()
  }

  const createCollection = async (collection) => {
    const id = await dataController.createCollection(collection)
    await fetchAllCollections()
    return id
  }

  const updateCollection = async (collection) => {
    await dataController.updateCollection(collection)
    await fetchAllCollections()
  }

  const deleteCollection = async (id) => {
    await dataController.deleteCollection(id)
    await fetchAllCollections()
  }

  const currentCollectionId = ref(null)

  const currentCollection = computed(() =>
    collections.value.find(collection => collection.id === currentCollectionId.value)
  )

  function setCurrentCollection(id) {
    currentCollectionId.value = parseInt(id)
  }

  return {
    collections,
    initializeStore,
    createCollection,
    updateCollection,
    deleteCollection,
    setCurrentCollection,
    currentCollection,
  }
})
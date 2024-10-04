// src/stores/collections.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollectionsStore = defineStore('collections', () => {
  const collections = ref([
    {
      id: 1,
      title: "Motivational Quotes",
      description: "A collection of motivational quotes to stay motivated and focused.",
      fontColor: "#EDCBD2",
      backgroundColor: "#80C4B7",
      darkFontColor: "#E3856B",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          fontColor: "#FFE4B5",
          backgroundColor: "#4682B4",
          darkFontColor: "#CD853F"
        },
        { text: "Don't you wanna stop complaining?" },
      ]
    },
    {
      id: 2,
      title: "Quotes",
      description: "A collection of inspiring quotes to keep you motivated and focused.",
      fontColor: "#FFE4B5",
      backgroundColor: "#4682B4",
      darkFontColor: "#CD853F",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          fontColor: "#EDCBD2",
          backgroundColor: "#80C4B7",
          darkFontColor: "#E3856B",
        },
        { text: "Don't you wanna stop complaining?" },
      ]
    },
  ])

  const currentCollectionId = ref(null)

  const currentCollection = computed(() =>
    collections.value.find(collection => collection.id === currentCollectionId.value)
  )

  function setCurrentCollection(id) {
    console.log("triggered")
    currentCollectionId.value = parseInt(id)
  }

  return { 
    collections, 
    currentCollection, 
    setCurrentCollection 
  }
})
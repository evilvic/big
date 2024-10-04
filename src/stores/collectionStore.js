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
      lightColor: "#D3C5E5",
      darkColor: "#735DA5",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          fontColor: "#FFE4B5",
          backgroundColor: "#4682B4",
          darkFontColor: "#CD853F",
          lightColor: "#E9E7E0",
          darkColor: "#EB6F46"
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
      lightColor: "#8EC9BC",
      darkColor: "#FBF5AA",
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
    currentCollectionId.value = parseInt(id)
  }

  return { 
    collections, 
    currentCollection, 
    setCurrentCollection 
  }
})
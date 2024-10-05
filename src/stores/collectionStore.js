// src/stores/collections.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCollectionsStore = defineStore('collections', () => {
  const collections = ref([
    {
      id: 1,
      title: "Motivational Quotes",
      description: "A collection of motivational quotes to stay motivated and focused.",
      lightColor: "rgb(160, 220, 255)",
      darkColor: "rgb(80, 115, 255)",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          lightColor: "rgb(255, 160, 165)",
          darkColor: "rgb(250, 50, 60)"
        },
        { text: "Don't you wanna stop complaining?" },
      ]
    },
    {
      id: 2,
      title: "Rules",
      description: "Just follow these rules to stay motivated and focused.",
      lightColor: "rgb(255, 160, 165)",
      darkColor: "rgb(250, 50, 60)",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          lightColor: "rgb(255, 160, 165)",
          darkColor: "rgb(250, 50, 60)"
        },
        { text: "Don't you wanna stop complaining?" },
      ]
    },
    {
      id: 3,
      title: "Quotes",
      description: "A collection of inspiring quotes to keep you motivated and focused.",
      lightColor: "rgb(125, 230, 210)",
      darkColor: "rgb(5, 200, 170)",
      cards: [
        { 
          text: "Stupid is what stupid does",
          lightColor: "rgb(255, 250, 180)",
          darkColor: "rgb(255, 215, 90)",
        },
        { text: "Water your plants" },
      ]
    },
    {
      id: 3,
      title: "Rules",
      description: "Just follow these rules to stay motivated and focused.",
      lightColor: "rgb(255, 250, 180)",
      darkColor: "rgb(255, 215, 90)",
      cards: [
        { 
          text: "Did you get older doing nothing today?",
          lightColor: "rgb(255, 160, 165)",
          darkColor: "rgb(250, 50, 60)"
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
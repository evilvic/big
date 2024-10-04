// src/stores/collections.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollectionsStore = defineStore('collections', () => {
  const collections = ref([
    {
      id: 1,
      title: "Motivational Quotes",
      description: "A collection of motivational quotes to stay motivated and focused.",
      cards: [
        { text: "Did you get older doing nothing today?", fontColor: "#FFF2D7", backgroundColor: "#F98866" },
        { text: "Don't you wanna stop complaining?", fontColor: "#FFFFFF", backgroundColor: "#4A4E4D" },
      ]
    },
    {
      id: 2,
      title: "Positive Affirmations",
      description: "A collection of positive affirmations to help you stay positive and motivated.",
      cards: [
        { text: "I'm not a bad person, I'm a good person", fontColor: "#2A363B", backgroundColor: "#99B898" },
        { text: "Water your plants", fontColor: "#FF847C", backgroundColor: "#2A363B" },
      ]
    }
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
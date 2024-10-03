<script setup>
import { ref, onMounted } from 'vue'
import Carousel from '@/components/Slider.vue'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  }
})

const cards = ref([])

onMounted(() => {
  const allCollections = [
    {
      id: 1,
      cards: [
        { text: "Did you get older doing nothing today?", fontColor: "#FFF2D7", backgroundColor: "#F98866" },
        { text: "Don't you wanna stop complaining?", fontColor: "#FFFFFF", backgroundColor: "#4A4E4D" },
      ]
    },
    {
      id: 2,
      cards: [
        { text: "I'm not a bad person, I'm a good person", fontColor: "#2A363B", backgroundColor: "#99B898" },
        { text: "Water your plants", fontColor: "#FF847C", backgroundColor: "#2A363B" },
      ]
    }
  ]

  const collection = allCollections.find(c => c.id === Number(props.id))
  if (collection) {
    cards.value = collection.cards
  }
})
</script>

<template>
  <div class="container">
    <Carousel :cards="cards" />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>

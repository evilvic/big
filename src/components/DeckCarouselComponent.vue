<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CardComponent from '@/components/CardComponent.vue'

const router = useRouter()

const props = defineProps({
  cards: { type: Array, required: true },
  deckBackgroundColor: { type: String, required: true },
  deckColor: { type: String, required: true },
  deckId: { type: Number, required: true },
  cardIndex: { type: Number },
})

const currentIndex = ref(props.cardIndex || 0)
const showIndicators = ref(false)
const indicatorsTimer = ref(null)
const touchStart = ref(null)
const carouselRef = ref(null)
const direction = ref('next')
const lastAction = ref('next')
const longPressTimer = ref(null)
const isLongPress = ref(false)

const currentCard = computed(() => props.cards[currentIndex.value])

const goToNext = () => {
  if (currentIndex.value < props.cards.length) {
    lastAction.value = 'next'
    direction.value = 'next'
    currentIndex.value += 1
  }
}

const goToPrev = () => {
  if (currentIndex.value > 0) {
    lastAction.value = 'prev'
    direction.value = 'prev'
    currentIndex.value -= 1
  } else {
    router.push({ name: 'decks' })
  }
}

const goToNewCard = () => {
  router.push({ name: 'new-card', params: { id: props.deckId } })
}

const handleTouchStart = (event) => {
  touchStart.value = event.touches[0].clientX
  showIndicatorsTemporary()
  clearTimeout(longPressTimer.value)
  isLongPress.value = false
  
  if (props.cards.length > 0 && currentIndex.value < props.cards.length) {
    longPressTimer.value = setTimeout(() => {
      isLongPress.value = true
      const currentCard = props.cards[currentIndex.value]
      router.push({ 
        name: 'edit-card', 
        params: { id: props.deckId, cardId: currentCard.id },
      })
    }, 2000)
  }
}

const handleTouchMove = (event) => {
  if (!touchStart.value) return
  
  clearTimeout(longPressTimer.value)
  
  const touchEnd = event.touches[0].clientX
  const diff = touchStart.value - touchEnd
  if (Math.abs(diff) > 50 && !isLongPress.value) {
    const cards = document.querySelectorAll('.slider-item')
    const currentCard = cards[currentIndex.value]
    let nextCard

    if (diff > 0) {
      nextCard = cards[currentIndex.value + 1]
      if (nextCard) {
        currentCard.style.transform = 'translate3d(-100%, 0, 0)'
        nextCard.style.transform = 'translate3d(0, 0, 0)'
      }
      goToNext()
    } else {
      nextCard = cards[currentIndex.value - 1]
      if (nextCard) {
        currentCard.style.transform = 'translate3d(100%, 0, 0)'
        nextCard.style.transform = 'translate3d(0, 0, 0)'
      }
      goToPrev()
    }
    touchStart.value = null
  }
}

const resetCardPositions = () => {
  const cards = document.querySelectorAll('.slider-item')
  cards.forEach((card, index) => {
    if (index === currentIndex.value) {
      card.style.transform = 'translate3d(0, 0, 0)'
    } else if (index < currentIndex.value) {
      card.style.transform = 'translate3d(-100%, 0, 0)'
    } else {
      card.style.transform = 'translate3d(100%, 0, 0)'
    }
  })
}

const handleTouchEnd = () => {
  touchStart.value = null
  clearTimeout(longPressTimer.value)
}

const showIndicatorsTemporary = () => {
  if (indicatorsTimer.value) {
    clearTimeout(indicatorsTimer.value)
  }

  showIndicators.value = true
  
  indicatorsTimer.value = setTimeout(() => {
    showIndicators.value = false
    indicatorsTimer.value = null
  }, 2000)
}

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.addEventListener('touchstart', handleTouchStart)
    carouselRef.value.addEventListener('touchmove', handleTouchMove)
    carouselRef.value.addEventListener('touchend', handleTouchEnd)
  }
  resetCardPositions()
})

onUnmounted(() => {
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('touchstart', handleTouchStart)
    carouselRef.value.removeEventListener('touchmove', handleTouchMove)
    carouselRef.value.removeEventListener('touchend', handleTouchEnd)

    if (indicatorsTimer.value) {
      clearTimeout(indicatorsTimer.value)
    }
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
    }
  }
})

watch(currentIndex, () => {
  resetCardPositions()
})

const setCurrentIndex = (index) => {
  if (index !== currentIndex.value) {
    lastAction.value = index > currentIndex.value ? 'next' : 'prev'
    currentIndex.value = index
  }
}

defineExpose({ setCurrentIndex })

watch(() => props.cardIndex, (newIndex) => {
  if (newIndex !== undefined && newIndex !== null) {
    setCurrentIndex(newIndex)
  }
}, { immediate: true })
</script>

<template>
  <div
    class="carousel" 
    ref="carouselRef"
    @click="showIndicatorsTemporary"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="slider-container">
      <CardComponent
        v-for="(card, index) in cards"
        :key="index"
        :text="card.text"
        :cardBackgroundColor="card.backgroundColor"
        :cardColor="card.color"
        :deckBackgroundColor="deckBackgroundColor"
        :deckColor="deckColor"
        class="slider-item"
        :class="{ 'current': index === currentIndex }"
      />
      <CardComponent
        :isNewCardPlaceholder="true"
        :deckBackgroundColor="deckBackgroundColor"
        :deckColor="deckColor"
        class="slider-item new-card"
        :class="{ 'current': currentIndex === cards.length }"
        @click="goToNewCard"
      />
    </div>
    <div
      v-if="cards.length > 0"
      class="indicators"
      :class="{ 'show': showIndicators }"
    >
      <div
        v-for="(card, index) in [...cards, {}]"
        :key="index"
        class="indicator"
        :class="{ 'active': index === currentIndex }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate3d(100%, 0, 0);
  transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
}

.slider-item.current {
  transform: translate3d(0, 0, 0);
}

.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.indicators.show {
  opacity: 1;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 5px;
}

.indicator.active {
  background-color: white;
}
</style>
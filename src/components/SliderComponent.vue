<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Slide from '@/components/SlideComponent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  cards: { type: Array, required: true },
  collectionLightColor: { type: String, required: true },
  collectionDarkColor: { type: String, required: true },
})

const currentIndex = ref(0)
const showIndicators = ref(false)
const touchStart = ref(null)
const containerRef = ref(null)
const direction = ref('next')

const currentCard = computed(() => props.cards[currentIndex.value])

const goToNext = () => {
  if (currentIndex.value < props.cards.length - 1) {
    direction.value = 'next'
    currentIndex.value += 1
  }
}

const goToPrev = () => {
  if (currentIndex.value > 0) {
    direction.value = 'prev'
    currentIndex.value -= 1
  } else {
    router.push({ name: 'decks' })
  }
}

const handleTouchStart = (event) => {
  touchStart.value = event.touches[0].clientX
  showIndicators.value = true
}

const handleTouchMove = (event) => {
  if (!touchStart.value) return
  const touchEnd = event.touches[0].clientX
  const diff = touchStart.value - touchEnd
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      goToNext()
    } else {
      goToPrev()
    }
    touchStart.value = null
  }
}

const handleTouchEnd = () => {
  touchStart.value = null
  setTimeout(() => {
    showIndicators.value = false
  }, 2000)
}

// TODO: Fix, timer reset on every change
const showIndicatorsTemporarily = () => {
  showIndicators.value = true
  setTimeout(() => {
    showIndicators.value = false
  }, 2000)
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('touchstart', handleTouchStart)
    containerRef.value.addEventListener('touchmove', handleTouchMove)
    containerRef.value.addEventListener('touchend', handleTouchEnd)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('touchstart', handleTouchStart)
    containerRef.value.removeEventListener('touchmove', handleTouchMove)
    containerRef.value.removeEventListener('touchend', handleTouchEnd)
  }
})

watch(currentIndex, (newIndex, oldIndex) => {
  const cards = document.querySelectorAll('.slider-item')
  if (newIndex > oldIndex) {
    cards[newIndex].style.transform = 'translate3d(100%, 0, 0)'
    setTimeout(() => {
      cards[newIndex].style.transform = 'translate3d(0, 0, 0)'
      cards[oldIndex].style.transform = 'translate3d(-30%, 0, 0)'
    }, 0)
  } else {
    cards[newIndex].style.transform = 'translate3d(-30%, 0, 0)'
    setTimeout(() => {
      cards[newIndex].style.transform = 'translate3d(0, 0, 0)'
      cards[oldIndex].style.transform = 'translate3d(100%, 0, 0)'
    }, 0)
  }
})
</script>

<template>
  <div class="carousel" ref="containerRef" @click="showIndicatorsTemporarily">
    <div class="slider-container">
      <Slide
        v-for="(card, index) in cards"
        :key="index"
        :text="card.text"
        :lightColor="card.lightColor"
        :darkColor="card.darkColor"
        :collectionLightColor="collectionLightColor"
        :collectionDarkColor="collectionDarkColor"
        class="slider-item"
        :class="{ 'current': index === currentIndex }"
      />
    </div>
    <div class="indicators" :class="{ 'show': showIndicators }">
      <div
        v-for="(card, index) in cards"
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
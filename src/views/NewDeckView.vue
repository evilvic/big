<script setup>
import { ref, computed, toRaw, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';

const router = useRouter();
const decksStore = useDecksStore();

const colorOptions = {
  red: '#FB4A4B',
  yellow: '#FFDE6B',
  blue: '#618DFF',
  green: '#8DE8D7'
};

const newDeck = ref({
  name: "",
  description: "",
  lightColor: "",
  darkColor: "#292929"
});

const nameLength = computed(() => newDeck.value.name.length);
const descriptionLength = computed(() => newDeck.value.description.length);

const isNameValid = computed(() => nameLength.value > 0 && nameLength.value <= 24);
const isDescriptionValid = computed(() => descriptionLength.value <= 64);
const isColorSelected = computed(() => newDeck.value.lightColor !== "");
const isFormValid = computed(() => isNameValid.value && isDescriptionValid.value && isColorSelected.value);

const selectColor = (color) => {
  newDeck.value.lightColor = color;
};

const createNewDeck = async () => {
  if (isFormValid.value) {
    const rawDeck = toRaw(newDeck.value);
    const id = await decksStore.createDeck(rawDeck);
    router.push({ name: 'new-card', params: { id } });
  }
};

let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 300;
  if (touchStartX - touchEndX > swipeThreshold) {
    // Swipe left, do nothing or implement forward functionality if needed
  } else if (touchEndX - touchStartX > swipeThreshold) {
    router.go(-1);
  }
};

onMounted(() => {
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);
});

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart, false);
  document.removeEventListener('touchend', handleTouchEnd, false);
});
</script>

<template>
  <main>
    <form @submit.prevent="createNewDeck">
      <label for="deck-name">
        Name*
      </label>
      <input
        id="deck-name"
        type="text"
        v-model="newDeck.name"
        placeholder="[epic] [deck] [title]"
        :class="{ 'invalid': !isNameValid && nameLength > 0 }"
      >
      <span
        class="chars-limit"
        :class="{ 'error': !isNameValid && nameLength > 0 }"
      >
        {{ nameLength }}/24 chars
      </span>

      <label for="deck-description">
        Deck description
      </label>
      <textarea
        id="deck-description"
        v-model="newDeck.description"
        placeholder="[why] [this] [deck] [rocks]"
        :class="{ 'invalid': !isDescriptionValid && descriptionLength > 0 }"
      />
      <span
        class="chars-limit"
        :class="{ 'error': !isDescriptionValid && descriptionLength > 0 }"
      >
        {{ descriptionLength }}/64 chars
      </span>

      <label id="color-picker">
        Color*
      </label>
      <div
        id="color-picker"
        class="color-picker"
        role="radiogroup"
        aria-labelledby="color-picker"
        tabindex="0"
      >
        <div 
          v-for="(color, name) in colorOptions" 
          :key="name"
          class="color-circle"
          :style="{ backgroundColor: color }"
          @click="selectColor(color)"
          @keydown="handleColorKeydown($event, color)"
          :class="{ 'selected': newDeck.lightColor === color }"
          role="radio"
          :aria-checked="newDeck.lightColor === color"
          :aria-label="`Select ${name} color`"
          tabindex="0"
        ></div>
      </div>

      <button
        type="submit"
        :disabled="!isFormValid"
      >
        Create deck >
      </button>
    </form>
  </main>
</template>

<style scoped>
form {
  margin-top: 40px;
}
button[type="submit"] {
  margin-top: 80px;
}
</style>
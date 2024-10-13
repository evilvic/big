<script setup>
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';

const router = useRouter();
const decksStore = useDecksStore();

const colorOptions = [
  {
    name: "diet-green",
    backgroundColor: "#8DE8D7",
    color: "#595959"
  },
]

const newDeck = ref({
  name: "",
  description: "",
  lightColor: "",
  darkColor: ""
});

const nameLength = computed(() => newDeck.value.name.length);
const descriptionLength = computed(() => newDeck.value.description.length);

const isNameValid = computed(() => nameLength.value > 0 && nameLength.value <= 24);
const isDescriptionValid = computed(() => descriptionLength.value <= 64);
const isColorSelected = computed(() => newDeck.value.lightColor !== "");
const isFormValid = computed(() => isNameValid.value && isDescriptionValid.value && isColorSelected.value);

const selectColor = (backgroundColor, color) => {
  newDeck.value.lightColor = backgroundColor;
  newDeck.value.darkColor = color;
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
        deck name*
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
        deck description
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
        deck color*
      </label>
      <div
        id="color-picker"
        class="color-picker"
        role="radiogroup"
        aria-labelledby="color-picker"
        tabindex="0"
      >
        <div 
          v-for="option in colorOptions" 
          :key="option.name"
          class="color-circle"
          @click="selectColor(option.backgroundColor, option.color)"
          :class="{ 'selected': newDeck.lightColor === option.backgroundColor && newDeck.darkColor === option.color }"
          role="radio"
          :aria-checked="newDeck.lightColor === option.backgroundColor && newDeck.darkColor === option.color"
          :aria-label="`Select ${option.name} color combination`"
          tabindex="0"
        >
        <div class="color-half left" :style="{ backgroundColor: option.backgroundColor }"></div>
        <div class="color-half right" :style="{ backgroundColor: option.textColor }"></div>
        </div>
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
<script setup>
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';
import { COLOR_OPTIONS } from '@/data/constants';

const colorOptions = COLOR_OPTIONS.filter(option => !option.name.includes('inverted'));

const route = useRoute();
const router = useRouter();
const decksStore = useDecksStore();

const deck = ref({
  id: null,
  name: "",
  detail: "",
  backgroundColor: "",
  color: ""
});

const originalDeck = ref(null);
const isEditMode = computed(() => !!route.params.id);

const nameLength = computed(() => deck.value.name.length);
const detailLength = computed(() => deck.value.detail.length);

const isNameValid = computed(() => nameLength.value > 0 && nameLength.value <= 24);
const isDetailValid = computed(() => detailLength.value <= 64);
const isColorSelected = computed(() => deck.value.backgroundColor !== "");
const isFormValid = computed(() => isNameValid.value && isDetailValid.value && isColorSelected.value);

const hasDeckChanged = computed(() => {
  if (!originalDeck.value) return false;
  return (
    deck.value.name !== originalDeck.value.name ||
    deck.value.detail !== originalDeck.value.detail ||
    deck.value.backgroundColor !== originalDeck.value.backgroundColor ||
    deck.value.color !== originalDeck.value.color
  );
});

const selectColor = (backgroundColor, color) => {
  deck.value.backgroundColor = backgroundColor;
  deck.value.color = color;
};

const saveDeck = async () => {
  if (isFormValid.value) {
    const rawDeck = toRaw(deck.value);
    if (isEditMode.value) {
      await decksStore.updateDeck(rawDeck);
      router.push({ name: 'home' });
    } else {
      const id = await decksStore.createDeck(rawDeck);
      router.push({ name: 'new-card', params: { id } });
      return;
    }
  }
};

const deleteDeck = async () => {
  await decksStore.deleteDeck(deck.value.id);
  router.push({ name: 'home' });
};

const goBack = () => {
  router.go(-1);
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
  if (touchEndX - touchStartX > swipeThreshold) {
    goBack();
  }
};

onMounted(async () => {
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);

  if (isEditMode.value) {
    const id = route.params.id;
    const fetchedDeck = await decksStore.getDeck(id);
    if (fetchedDeck) {
      deck.value = { ...fetchedDeck };
      originalDeck.value = { ...fetchedDeck };
    } else {
      console.error('Deck not found');
      router.push({ name: 'home' });
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart, false);
  document.removeEventListener('touchend', handleTouchEnd, false);
})
</script>


<template>
  <main>
    <button class="back-button" @click="goBack">
      {{ '< back' }}
    </button>

    <form @submit.prevent="saveDeck">
      <label for="deck-name">
        deck name*
      </label>
      <input
        id="deck-name"
        type="text"
        v-model="deck.name"
        placeholder="[epic] [deck] [title]"
        :class="{ 'invalid': !isNameValid && nameLength > 0 }"
      >
      <span
        class="chars-limit"
        :class="{ 'error': !isNameValid && nameLength > 0 }"
      >
        {{ nameLength }}/24 chars
      </span>

      <label for="deck-detail">
        deck detail
      </label>
      <textarea
        id="deck-detail"
        v-model="deck.detail"
        placeholder="[why] [this] [deck] [rocks]"
        :class="{ 'invalid': !isDetailValid && detailLength > 0 }"
      />
      <span
        class="chars-limit"
        :class="{ 'error': !isDetailValid && detailLength > 0 }"
      >
        {{ detailLength }}/64 chars
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
          :class="{ 'selected': deck.backgroundColor === option.backgroundColor && deck.color === option.color }"
          role="radio"
          :aria-checked="deck.backgroundColor === option.backgroundColor && deck.color === option.color"
          :aria-label="`Select ${option.name} color combination`"
          tabindex="0"
        >
        <div class="color-half left" :style="{ backgroundColor: option.backgroundColor }"></div>
        <div class="color-half right" :style="{ backgroundColor: option.color }"></div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isEditMode ? (!isFormValid || !hasDeckChanged) : !isFormValid"
      >
        {{ isEditMode ? 'update deck >' : 'create deck >' }}
      </button>
    </form>

    <button v-if="isEditMode" @click="deleteDeck" class="delete-button">
      Delete deck
    </button>
  </main>
</template>
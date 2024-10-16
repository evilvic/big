<script setup>
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';
import { useCardsStore } from '@/stores/cardsStore';

const route = useRoute();
const router = useRouter();
const decksStore = useDecksStore();
const cardsStore = useCardsStore();

const colorOptions = [
  {
    name: "diet-green",
    backgroundColor: "#8DE8D7",
    color: "#595959"
  },
  {
    name: "diet-green-inverted",
    backgroundColor: "#595959",
    color: "#8DE8D7"
  },
]

const deck = ref(null);
const card = ref({
  id: null,
  text: '',
  deckId: null,
  backgroundColor: '',
  color: ''
});

const originalCard = ref(null);
const isEditMode = computed(() => !!route.params.cardId);

const textLength = computed(() => card.value.text.length);

const isTextValid = computed(() => textLength.value > 0 && textLength.value <= 64);
const isColorSelected = computed(() => card.value.backgroundColor !== "" || card.value.color !== "");
const isFormValid = computed(() => isTextValid.value && isColorSelected.value);

const hasCardChanged = computed(() => {
  if (!originalCard.value) return false;
  return (
    card.value.text !== originalCard.value.text ||
    card.value.backgroundColor !== originalCard.value.backgroundColor ||
    card.value.color !== originalCard.value.color
  );
});

onMounted(async () => {
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);

  const deckId = parseInt(route.params.id);
  deck.value = await decksStore.getDeck(deckId);
  card.value.deckId = deckId;

  const deckColorOption = {
    name: "deck-color",
    backgroundColor: deck.value.backgroundColor,
    color: deck.value.color
  };

  const existingOptionIndex = colorOptions.findIndex(
    option => option.backgroundColor === deck.value.backgroundColor && option.color === deck.value.color
  );

  if (existingOptionIndex !== -1) {
    colorOptions.splice(existingOptionIndex, 1);
  }

  colorOptions.unshift(deckColorOption);

  if (isEditMode.value) {
    const cardId = parseInt(route.params.cardId);
    const fetchedCard = await cardsStore.getCard(cardId);
    if (fetchedCard) {
      card.value = { ...fetchedCard };
      originalCard.value = { ...fetchedCard };
    } else {
      console.error('Card not found');
      router.push({ name: 'deck', params: { id: deckId } });
    }
  } else {
    card.value.backgroundColor = deck.value.backgroundColor;
    card.value.color = deck.value.color;
  }

  await cardsStore.fetchCardsByDeckId(deckId);
});

const selectColor = (backgroundColor, color) => {
  card.value.backgroundColor = backgroundColor;
  card.value.color = color;
};

const saveCard = async () => {
  if (isFormValid.value) {
    const rawCard = toRaw(card.value);
    
    if (isEditMode.value) {
      await cardsStore.updateCard(rawCard);
    } else {
      const id = await cardsStore.createCard(rawCard);
      card.value.id = id;
    }
    
    router.push({ 
      name: 'deck', 
      params: { id: card.value.deckId },
      query: { cardId: card.value.id }
    });
  }
};

const deleteCard = async () => {
  await cardsStore.deleteCard(card.value.id);
  router.push({ name: 'deck', params: { id: card.value.deckId } });
};

const goBack = () => {
  const prevRoute = router.options.history.state.back;

  if (prevRoute === '/decks/new') {
    router.push({ name: 'home' });
  } else {
    router.go(-1);
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
  if (touchEndX - touchStartX > swipeThreshold) {
    goBack();
  }
};

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart, false);
  document.removeEventListener('touchend', handleTouchEnd, false);
})
</script>

<template>
  <main v-if="deck">
    <button class="back-button" @click="goBack">
      {{ '< slide back' }}
    </button>

    <form @submit.prevent="saveCard">
      <label for="card-content">
        *Card content
      </label>
      <textarea
        id="card-content"
        v-model="card.text"
        placeholder="Enter card text"
        :class="{ 'invalid': !isTextValid && textLength > 0 }"
      />
      <span
        class="chars-limit"
        :class="{ 'error': !isTextValid && textLength > 0 }"
      >
        {{ textLength }}/64 chars
      </span>

      <label id="color-picker">
        *Card color
      </label>
      <div
        id="color-picker"
        class="color-picker"
        role="radiogroup"
        aria-labelledby="color-picker"
      >
        <div 
          v-for="option in colorOptions" 
          :key="option.name"
          class="color-circle"
          @click="selectColor(option.backgroundColor, option.color)"
          :class="{ 'selected': card.backgroundColor === option.backgroundColor && card.color === option.color }"
          role="radio"
          :aria-checked="card.backgroundColor === option.backgroundColor && card.color === option.color"
          :aria-label="`Select ${option.name} color combination`"
        >
          <div class="color-half left" :style="{ backgroundColor: option.backgroundColor }"></div>
          <div class="color-half right" :style="{ backgroundColor: option.color }"></div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isEditMode ? (!isFormValid || !hasCardChanged) : !isFormValid"
      >
        {{ isEditMode ? 'Update Card' : 'Add Card' }}
      </button>
    </form>

    <button v-if="isEditMode" @click="deleteCard" class="delete-button">
      Delete Card
    </button>
  </main>
</template>
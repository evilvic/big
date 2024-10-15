<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';
import { useCardsStore } from '@/stores/cardsStore';

const route = useRoute();
const router = useRouter()
const decksStore = useDecksStore();
const cardsStore = useCardsStore();

const deck = ref(null);
const newCard = ref({
  text: '',
  deckId: null
});

const textLength = computed(() => newCard.value.text.length);
const isTextValid = computed(() => textLength.value > 0 && textLength.value <= 64);

onMounted(async () => {
  const id = parseInt(route.params.id);
  deck.value = await decksStore.getDeck(id);
  newCard.value.deckId = id;
  await cardsStore.fetchCardsByDeckId(id);
});

const addCard = async () => {
  if (isTextValid.value) {
    const rawCard = toRaw(newCard.value);
    const newCardId = await cardsStore.createCard(rawCard);
    router.push({ 
      name: 'deck', 
      params: { id: newCard.value.deckId },
      query: { cardId: newCardId }
    });
  }
};
</script>

<template>
  <main v-if="deck">
    <form @submit.prevent="addCard">
      <label for="card-content">
        Card content
      </label>
      <textarea
        id="card-content"
        v-model="newCard.text"
        placeholder="Enter card text"
        :class="{ 'invalid': !isTextValid && textLength > 0 }"
      />
      <span
        class="chars-limit"
        :class="{ 'error': !isTextValid && textLength > 0 }"
      >
        {{ textLength }}/64 chars
      </span>
      <button
        type="submit"
        :disabled="!isTextValid"
      >
        Add Card
      </button>
    </form>
  </main>
</template>

<style scoped>

button {
  margin-top: 80px;
}
</style>
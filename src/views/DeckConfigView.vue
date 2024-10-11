<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/deckStore';
import { useCardsStore } from '@/stores/cardsStore';

const route = useRoute();
const router = useRouter();
const deckStore = useDecksStore();
const cardsStore = useCardsStore();

const deck = ref(null);
const newCardText = ref('');

onMounted(async () => {
  const id = parseInt(route.params.id);
  deck.value = await deckStore.getDeck(id);
  await cardsStore.fetchCardsByDeckId(id);
});

const updateDeck = async () => {
  const plainDeck = toRaw(deck.value);
  await deckStore.updateDeck(plainDeck);
  router.push('/');
};

const deleteDeck = async () => {
  await deckStore.deleteDeck(deck.value.id);
  router.push('/');
};

const addCard = async () => {
  if (newCardText.value.trim()) {
    await cardsStore.createCard({
      deckId: deck.value.id,
      text: newCardText.value.trim()
    });
    newCardText.value = '';
  }
};
</script>

<template>
  <main v-if="deck">
    <form @submit.prevent="updateDeck">
      <label for="name">Name</label>
      <input id="name" v-model="deck.name" required>

      <label for="description">Description</label>
      <textarea id="description" v-model="deck.description"></textarea>

      <button type="submit">Update Deck</button>
    </form>

    <button @click="deleteDeck" class="delete-button">Delete Deck</button>

    <div class="cards-section">
      <h2>Cards</h2>
      <ul>
        <li v-for="card in cardsStore.cards" :key="card.id">
          {{ card.text }}
        </li>
      </ul>
      <form @submit.prevent="addCard">
        <input v-model="newCardText" placeholder="Enter card text" required>
        <button type="submit">Add Card</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  font-family: 'Barrio', sans-serif;
  font-size: 1.2rem;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  margin-top: 20px;
  background-color: #f44336;
}
</style>
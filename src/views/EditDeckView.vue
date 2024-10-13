<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';

const route = useRoute();
const router = useRouter();
const decksStore = useDecksStore();

const colorOptions = {
  red: '#FB4A4B',
  yellow: '#FFDE6B',
  blue: '#618DFF',
  green: '#8DE8D7'
};

const deck = ref({
  id: null,
  name: "",
  description: "",
  lightColor: "",
  darkColor: "#292929"
});

const nameLength = computed(() => deck.value.name.length);
const descriptionLength = computed(() => deck.value.description.length);

const isNameValid = computed(() => nameLength.value > 0 && nameLength.value <= 24);
const isDescriptionValid = computed(() => descriptionLength.value <= 64);
const isColorSelected = computed(() => deck.value.lightColor !== "");
const isFormValid = computed(() => isNameValid.value && isDescriptionValid.value && isColorSelected.value);

onMounted(async () => {
  const id = parseInt(route.params.id);
  const fetchedDeck = await decksStore.getDeck(id);
  if (fetchedDeck) {
    deck.value = { ...fetchedDeck };
  } else {
    // Manejar el caso en que el deck no se encuentra
    console.error('Deck not found');
    router.push({ name: 'decks' });
  }
});

const selectColor = (color) => {
  deck.value.lightColor = color;
};

const updateDeck = async () => {
  if (isFormValid.value) {
    await decksStore.updateDeck(deck.value);
    router.push({ name: 'decks' });
  }
};

const deleteDeck = async () => {
  if (confirm('Are you sure you want to delete this deck?')) {
    await decksStore.deleteDeck(deck.value.id);
    router.push({ name: 'decks' });
  }
};
</script>

<template>
  <main>
    <form @submit.prevent="updateDeck">
      <label for="deck-name">
        Name*
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

      <label for="deck-description">
        Deck description
      </label>
      <textarea
        id="deck-description"
        v-model="deck.description"
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
          :class="{ 'selected': deck.lightColor === color }"
          role="radio"
          :aria-checked="deck.lightColor === color"
          :aria-label="`Select ${name} color`"
          tabindex="0"
        ></div>
      </div>

      <button @click="deleteDeck" class="delete-button">
        Delete deck
      </button>

      <button
        type="submit"
        :disabled="!isFormValid"
      >
        Update deck
      </button>
    </form>
  </main>
</template>

<style scoped>
.delete-button {
  margin-top: 40px;
}
button[type="submit"] {
  margin-top: 20px;
}

</style>
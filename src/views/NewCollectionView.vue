<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';

const router = useRouter();
const collectionStore = useDecksStore();
const collections = ref([]);

const newDeck = ref({
  name: "",
  description: "",
  lightColor: "",
  darkColor: "",
});

const nameLength = computed(() => newDeck.value.name.length);
const descriptionLength = computed(() => newDeck.value.description.length);

onMounted(async () => {
  await collectionStore.initializeStore();
  collections.value = collectionStore.collections;
});

const createNewCollection = async () => {
  const plainCollection = toRaw(newDeck.value);
  const id = await collectionStore.createCollection(plainCollection);
  router.push({ name: 'collection-config', params: { id } });
};
</script>

<template>
  <main>
    <form @submit.prevent="createNewCollection">
      <label>
        Name
      </label>
      <input
        type="text"
        v-model="newDeck.name"
        placeholder="[new] [deck] [name] [here]"
      >
      <span class="chars-limit">
        {{ nameLength }}/24 chars
      </span>

      <label>
        Description
      </label>
      <textarea 
        v-model="newDeck.description"
        placeholder="an_awesome_description_here"
      />
      <span class="chars-limit">
        {{ descriptionLength }}/64 chars
      </span>
      <button type="submit">Create deck ></button>
    </form>
  </main>
</template>

<style scoped>
.chars-limit {
  align-self: flex-end;
  font-family: monospace;
  font-size: 1rem;
  line-height: 1;
  color: var(--light-gray);
  margin-bottom: 32px;
}

button {
  margin-top: 80px;
}
</style>
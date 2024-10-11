<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useDecksStore } from '@/stores/decksStore';

const router = useRouter();
const collectionStore = useDecksStore();
const collections = ref([]);

const newCollection = ref({
  name: "Motivational Quotes",
  description: "A collection of motivational quotes to stay motivated and focused.",
  lightColor: "rgb(160, 220, 255)",
  darkColor: "rgb(80, 115, 255)",
});

onMounted(async () => {
  await collectionStore.initializeStore();
  collections.value = collectionStore.collections;
});

const createNewCollection = async () => {
  const plainCollection = toRaw(newCollection.value);
  const id = await collectionStore.createCollection(plainCollection);
  router.push({ name: 'collection-config', params: { id } });
};
</script>

<template>
  <main>
    <div>
      <form @submit.prevent="createNewCollection">
        <label>
          Name
        </label>
        <input v-model="newCollection.name" placeholder="Collection Name" required>
        <label>
          Description
        </label>
        <textarea v-model="newCollection.description" placeholder="Description"></textarea>
        <button type="submit">Create Collection</button>
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
  line-height: 1.2;
  word-break: break-word;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
}

input:focus,
textarea:focus {
  outline: none;
}

button {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>
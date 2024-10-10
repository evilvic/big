<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollectionsStore } from '@/stores/collectionStore';

const route = useRoute();
const router = useRouter();
const collectionStore = useCollectionsStore();

const collection = ref(null);

onMounted(async () => {
  const id = parseInt(route.params.id);
  collection.value = await collectionStore.getCollection(id);
});

const updateCollection = async () => {
  const plainCollection = toRaw(collection.value);
  await collectionStore.updateCollection(plainCollection);
  router.push('/');
};

const deleteCollection = async () => {
  await collectionStore.deleteCollection(collection.value.id);
  router.push('/');
};
</script>

<template>
  <main v-if="collection">
    <h1>Edit Collection</h1>
    <form @submit.prevent="updateCollection">
      <label for="name">Name</label>
      <input id="name" v-model="collection.name" required>

      <label for="description">Description</label>
      <textarea id="description" v-model="collection.description"></textarea>

      <button type="submit">Update Collection</button>
    </form>

    <button @click="deleteCollection" class="delete-button">Delete Collection</button>
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
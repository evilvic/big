<script setup>
import { ref, onMounted } from 'vue';
import { useCollectionsStore } from '@/stores/collectionStore';

const collectionStore = useCollectionsStore();
const collections = ref([]);

const newCollection = ref({
  name: '',
  description: '',
  lightColor: '#ffffff',
  darkColor: '#000000',
});

onMounted(async () => {
  await collectionStore.initializeStore();
  collections.value = collectionStore.collections;
});

const createNewCollection = async () => {
  await collectionStore.createCollection(newCollection.value);
  newCollection.value = {
    name: '',
    description: '',
    lightColor: '#ffffff',
    darkColor: '#000000',
  };
};

const deleteCollection = async (id) => {
  await collectionStore.deleteCollection(id);
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
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSafeAreaInsets } from '@/plugins/safeAreaPlugin'

const route = useRoute()
const transitionName = ref('slide-left')

onMounted(() => {
  getSafeAreaInsets()
})

watch(() => route.path, (newPath, oldPath) => {
  const newDepth = newPath.split('/').length
  const oldDepth = oldPath.split('/').length
  transitionName.value = newDepth < oldDepth ? 'slide-right' : 'slide-left'
})
</script>

<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" appear>
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<style>
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.6s cubic-bezier(.2,.8,.2,1);
}

.slide-left-enter-active,
.slide-right-leave-active {
  z-index: 2;
}

.slide-left-leave-active,
.slide-right-enter-active {
  z-index: 1;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-30%);
}

.slide-right-enter-from {
  transform: translateX(-30%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.6s cubic-bezier(.2,.8,.2,1);
}
</style>

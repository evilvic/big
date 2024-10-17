<template>
  <div class="top-bar"></div>
</template>

<style scoped>
.top-bar {
  width: 100%;
  height: var(--safe-area-inset-top);
  background: rgba(41, 41, 41, 0.75);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  z-index: 1000;
}
</style>
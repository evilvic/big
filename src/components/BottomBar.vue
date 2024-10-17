<template>
  <div class="bottom-bar"></div>
</template>

<style scoped>
.bottom-bar {
  width: 100%;
  height: var(--safe-area-inset-bottom);
  background: rgba(41, 41, 41, 0.75);
  backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  z-index: 1000;
}
</style>
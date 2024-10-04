import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkMode = ref(false);

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem("darkMode", isDarkMode.value);
    applyTheme();
  };

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === "true";
    } else {
      isDarkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme();
  };

  const applyTheme = () => {
    document.documentElement.classList.toggle("dark", isDarkMode.value);
  }

  watch(isDarkMode, () => {
    applyTheme();
  });

  return {
    isDarkMode,
    toggleDarkMode,
    initializeTheme,
  };
});
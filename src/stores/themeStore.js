import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDarkMode = ref(false);

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem("darkMode", isDarkMode.value);
  };

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === "true";
    } else {
      isDarkMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      isDarkMode.value = e.matches;
    });
  };

  watch(isDarkMode, (newValue) => {
    document.documentElement.classList.toggle("dark", newValue);
  });

  return {
    isDarkMode,
    toggleDarkMode,
    initializeTheme,
  };
});
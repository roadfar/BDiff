<script setup lang="ts">
import BiSun from "@/components/icons/BiSun.vue";
import BiMoonStarsFill from "@/components/icons/BiMoonStarsFill.vue";
import { ref } from "vue";
import { getTheme, setTheme } from "@/utils/storages/page.ts";
import { usePageStore } from "@/stores/page.ts";

const pageStore = usePageStore();

const currentTheme = ref<Theme>(getTheme());

function toggleTheme() {
  const targetTheme = currentTheme.value === "light" ? "dark" : "light";
  currentTheme.value = targetTheme;
  setTheme(targetTheme);
  pageStore.theme = targetTheme;
}
</script>

<template>
  <button class="btn p-0" :style="{ lineHeight: 1 }" @click="toggleTheme">
    <bi-sun v-show="currentTheme === 'light'" class="fs-4" />
    <bi-moon-stars-fill v-show="currentTheme === 'dark'" class="fs-4" />
  </button>
</template>

<script setup lang="ts">
import LyChevronDown from "@/components/icons/LyChevronDown.vue";

function handleClick() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-center rounded-circle" @click="handleClick">
    <ly-chevron-down />
  </div>
</template>

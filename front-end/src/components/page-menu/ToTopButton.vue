<script setup lang="ts">
import LyChevronUp from "@/components/icons/LyChevronUp.vue";

function handleClick() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-center rounded-circle" @click="handleClick">
    <ly-chevron-up />
  </div>
</template>

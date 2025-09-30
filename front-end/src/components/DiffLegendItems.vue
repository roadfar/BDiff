<script setup lang="ts">
const DIFF_LEGEND = [
  { key: "delete", label: "diff_legend_delete" },
  { key: "insert", label: "diff_legend_add" },
  { key: "update", label: "diff_legend_update" },
  { key: "split", label: "diff_legend_split" },
  { key: "merge", label: "diff_legend_merge" },
  { key: "move", label: "diff_legend_block_move" },
  { key: "copy", label: "diff_legend_block_copy" },
];
</script>

<template>
  <div v-for="item in DIFF_LEGEND" :key="item.key" class="d-flex align-items-center">
    <span
      :style="{ backgroundColor: `var(--diff-${item.key})`, height: '1em', width: '1.5em' }"
    ></span>
    <span class="ms-2">{{ $t(item.label) }}</span>
  </div>
</template>

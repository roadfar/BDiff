<script setup lang="ts">
import { useDiffStore } from "@/stores/diff.ts";

const diffStore = useDiffStore();
</script>

<template>
  <el-radio-group
    v-model="diffStore.diffAlign"
    @change="diffStore.updateDiffAlign"
    class="ly-switch-group"
  >
    <el-radio-button :value="true">{{ $t("diff_display_aligned") }}</el-radio-button>
    <el-radio-button :value="false">{{ $t("diff_display_compact") }}</el-radio-button>
  </el-radio-group>
</template>

<style>
.ly-switch-group {
  --ly-bg: var(--bs-body-bg);
  --ly-border-radius: var(--bs-border-radius-2xl);

  --el-border: none;
  --el-border-radius-base: var(--ly-border-radius);
  --el-button-font-weight: bold;
  --el-button-text-color: var(--bs-tertiary-color);
  --el-color-primary: var(--bs-tertiary-color);
  --el-font-size-base: 14px;

  background-color: var(--ly-bg);
  border-radius: var(--ly-border-radius);
  padding: 2px;
}

.ly-switch-group .el-radio-button {
  --el-button-bg-color: var(--ly-bg);

  --el-radio-button-checked-bg-color: var(--bs-secondary-bg);
  --el-radio-button-checked-text-color: var(--bs-body-color);
}

.ly-switch-group .el-radio-button.is-active .el-radio-button__inner {
  border-radius: var(--ly-border-radius);
  box-shadow: none !important;
}
</style>

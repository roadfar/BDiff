<script setup lang="ts">
import { inject } from "vue";
import { codeContainerRects } from "@/utils/injection-keys.ts";

const { tlh, lch, lcw } = inject(codeContainerRects)!;

const { activeId, diffDataMap, diffLinesMap, diffLineClick } = defineProps<{
  activeId?: DiffDataId | null;
  diffDataMap: DiffDataMap;
  diffLinesMap: DiffLinesMap;
  diffLineClick?: (id: DiffDataId) => void;
}>();
</script>

<template>
  <svg v-if="lch && lcw" :height="`${lch}px`" :width="`${lcw}px`">
    <g
      v-for="[id, line] in diffLinesMap"
      :key="id"
      :fill="`var(--diff-${line.mode})`"
      :fill-opacity="activeId === id ? 1 : 0.7"
      :data-line-id="id"
      @click="() => diffLineClick && diffLineClick(id)"
    >
      <path
        v-if="activeId === id || !line.mode.endsWith('_update')"
        :d="`M0,${line.as * tlh} L200,${line.bs * tlh} L200,${line.be * tlh} L0,${line.ae * tlh} Z`"
      ></path>
      <title v-if="diffDataMap && diffDataMap.has(id)">
        {{ diffDataMap.get(id)!.edit_action }}
      </title>
    </g>
  </svg>
</template>

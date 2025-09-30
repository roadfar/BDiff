<script setup lang="ts">
import { computed, inject, useTemplateRef } from "vue";
import { codeContainerRects, codeTable2Component } from "@/utils/injection-keys.ts";

const { tcw, tlh, lch, lcw } = inject(codeContainerRects)!;

const col1 = computed(() => 0);
const col2 = computed(() => col1.value + tcw.value);
const col3 = computed(() => col2.value + lcw.value);
const col4 = computed(() => col3.value + tcw.value);

const { diffDataMap, diffLinesMap, activeId } = defineProps<{
  diffDataMap: DiffDataMap;
  diffLinesMap: DiffLinesMap;
  activeId?: DiffDataId | null;
}>();

const diffData = computed(() => diffDataMap.get(activeId as number));
const diffLine = computed(() => diffLinesMap.get(activeId as number));

// 虚线框
const dashD = computed(() => {
  if (!diffLine.value) return;
  const { as, ae, bs, be } = diffLine.value;

  let d = `M${col1.value},${as * tlh.value}`;
  d += ` L${col2.value},${as * tlh.value}`;
  d += ` L${col3.value},${bs * tlh.value}`;
  d += ` L${col4.value},${bs * tlh.value}`;
  if (be === bs) {
    d += ` M${col3.value},${be * tlh.value}`;
  } else {
    d += ` L${col4.value},${be * tlh.value}`;
    d += ` L${col3.value},${be * tlh.value}`;
  }
  d += ` L${col2.value},${ae * tlh.value}`;
  if (ae !== as) {
    d += ` L${col1.value},${ae * tlh.value}`;
    d += ` L${col1.value},${as * tlh.value}`;
  }

  return d;
});

// 凸显在其他连线之上
const overD = computed(() => {
  if (!diffLine.value) return;
  const { as, ae, bs, be } = diffLine.value;
  let d = `M${col2.value},${as * tlh.value}`;
  d += ` L${col3.value},${bs * tlh.value}`;
  d += ` L${col3.value},${be * tlh.value}`;
  d += ` L${col2.value},${ae * tlh.value}`;
  d += ` Z`;
  return d;
});

// 缩进显示
const codeTable2Ref = inject(codeTable2Component);
const indentTextRef = useTemplateRef("indent-text");
const indentBox = computed(() => {
  const left =
    col3.value +
    Number(
      codeTable2Ref?.value?.tableRef?.querySelector("td[data-line-number]")?.clientWidth || 0,
    ) +
    10; // blob-code 左内边距
  const top = (diffLine.value?.bs || 0) * tlh.value - tlh.value;
  const bottom = (diffLine.value?.be || 0) * tlh.value;
  const itw = indentTextRef.value?.getBoundingClientRect().width || 0;

  return { left, top: top < 0 ? 0 : top, bottom, itw }; // top<0 防止溢出到svg之外
});
</script>

<template>
  <svg
    :key="`${activeId}`"
    v-if="diffLine && lch && lcw && tcw"
    :height="`${lch}px`"
    :width="`${tcw * 2 + lcw}px`"
  >
    <!-- 连线凸显 -->
    <g
      :fill="`var(--diff-${diffLine.mode})`"
      :fill-opacity="activeId === activeId ? 1 : 0.7"
      :data-line-id="activeId"
    >
      <path :d="overD"></path>
    </g>

    <!-- 边框凸显 -->
    <g
      fill="transparent"
      :stroke="`var(--diff-${diffLine.mode}-outline)`"
      stroke-dasharray="10"
      :data-line-id="activeId"
    >
      <path :d="dashD"></path>
    </g>

    <!-- 缩进显示 -->
    <template v-if="diffData && diffData.indent_offset && diffData.indent_offset !== 0">
      <!-- 缩进背景色 -->
      <g :fill="`var(--diff-${diffData.mode})`">
        <path
          :d="`M${indentBox.left},${indentBox.top} L${indentBox.left + indentBox.itw},${indentBox.top} L${indentBox.left + indentBox.itw},${indentBox.bottom} L${indentBox.left},${indentBox.bottom} Z`"
        ></path>
      </g>

      <!-- 缩进箭头 -->
      <g :stroke="`var(--diff-${diffData.mode}-outline)`">
        <text
          ref="indent-text"
          :fill="`var(--bs-body-color)`"
          :x="indentBox.left"
          :y="indentBox.top + 14"
          :style="{ fontSize: 'var(--el-font-size-base)', lineHeight: `${tlh}px` }"
        >
          {{ diffData.indent_offset < 0 ? "<" : ""
          }}{{ Array.from({ length: Math.abs(diffData.indent_offset) - 1 }, () => "-").join("")
          }}{{ diffData.indent_offset > 0 ? ">" : "" }}
        </text>
      </g>

      <!-- 缩进位置线 -->
      <g :stroke="`var(--diff-${diffData.mode}-outline)`" stroke-width="2">
        <g :stroke-dasharray="diffData.indent_offset < 0 ? undefined : 5">
          <path
            :d="`M${indentBox.left},${indentBox.top} L${indentBox.left},${indentBox.bottom}`"
          ></path>
        </g>

        <g :stroke-dasharray="diffData.indent_offset < 0 ? 5 : undefined">
          <path
            :d="`M${indentBox.left + indentBox.itw},${indentBox.top} L${indentBox.left + indentBox.itw},${indentBox.bottom}`"
          ></path>
        </g>
      </g>
    </template>
  </svg>
</template>

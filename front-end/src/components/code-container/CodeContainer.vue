<script setup lang="ts">
import CodeTable from "@/components/code-container/CodeTable.vue";
import { computed, nextTick, onMounted, provide, ref, useTemplateRef } from "vue";
import DiffLinesContainer from "@/components/code-container/DiffLinesContainer.vue";
import { useDiffStore } from "@/stores/diff.ts";
import DiffActiveLineContainer from "@/components/code-container/DiffActiveLineContainer.vue";
import { codeContainerRects, codeTable2Component } from "@/utils/injection-keys.ts";

const diffStore = useDiffStore();

/**
 * 固定参数
 */

const TABLE_LINE_HEIGHT_DEFAULT = 20 as const;
const DIFF_LINES_CONTAINER_WIDTH_DEFAULT = 200 as const;

const tcw = ref<number>(0);
const tlh = ref<number>(TABLE_LINE_HEIGHT_DEFAULT);
const lch = ref<number>(0);
const lcw = ref<number>(DIFF_LINES_CONTAINER_WIDTH_DEFAULT);
const t1scroll = ref<number>(0);
const t2scroll = ref<number>(0);

onMounted(() => {
  // nextTick 确保拿到宽度
  nextTick(() => {
    if (!codeContainerRef.value) return;
    tcw.value = (codeContainerRef.value.offsetWidth - lcw.value) / 2;
    lch.value = codeContainerRef.value.offsetHeight;
  });
});

provide(codeContainerRects, { tcw, tlh, lch, lcw });

/**
 * 只显示某个 diff
 */

const { focusId } = defineProps<{ focusId?: DiffDataId }>();
const lines1 = computed(() =>
  focusId
    ? diffStore.f1Lines.filter((line) => line.number !== null && line.ids.includes(focusId)) // delete、insert 没有加入弹窗，这里不进行特殊处理
    : diffStore.f1Lines,
);
const lines2 = computed(() =>
  focusId
    ? diffStore.f2Lines.filter((line) => line.number !== null && line.ids.includes(focusId))
    : diffStore.f2Lines,
);
const diffLinesMap = computed(() =>
  focusId
    ? new Map(
        Array.from(diffStore.diffLinesMap)
          .filter(([id]) => id === focusId)
          .map(([id, line]) => [
            id,
            { mode: line.mode, as: 0, ae: line.ae - line.as, bs: 0, be: line.be - line.bs },
          ]),
      )
    : diffStore.diffLinesMap,
);

/**
 * 横向滚动处理
 */

const codeContainerRef = useTemplateRef("code-container");
const codeTable1Ref = useTemplateRef("code-table1");
const codeTable2Ref = useTemplateRef("code-table2");
const codeTable1ParentRef = useTemplateRef("code-table1-parent");
const codeTable2ParentRef = useTemplateRef("code-table2-parent");

const xScrollInnerWidth = ref<number>(0);

// diff 改变时，父级用 v-if 触发重新渲染
onMounted(() => {
  // nextTick 确保拿到宽度
  nextTick(() => {
    initXScroll();
  });
});

function initXScroll() {
  if (
    !codeContainerRef.value ||
    !codeTable1Ref.value ||
    !codeTable1Ref.value.tableRef ||
    !codeTable2Ref.value ||
    !codeTable2Ref.value.tableRef ||
    !codeTable1ParentRef.value ||
    !codeTable2ParentRef.value
  ) {
    return;
  }
  const t1 = codeTable1Ref.value.tableRef;
  const t2 = codeTable2Ref.value.tableRef;
  t1.style.position = "relative";
  t2.style.position = "relative";
  const t1p = codeTable1ParentRef.value;
  const t2p = codeTable2ParentRef.value;
  const [t1w, t1pw] = [t1.offsetWidth, t1p.offsetWidth];
  const [t2w, t2pw] = [t2.offsetWidth, t2p.offsetWidth];
  const cw = codeContainerRef.value.offsetWidth;

  if (t1w > t1pw || t2w > t2pw) {
    xScrollInnerWidth.value = Math.max(t1w / t1pw, t2w / t2pw) * cw;
  }
}

function handleScroll(event: { scrollLeft: number; scrollTop: number }) {
  if (
    !codeContainerRef.value ||
    !codeTable1Ref.value ||
    !codeTable2Ref.value ||
    !codeTable1Ref.value.tableRef ||
    !codeTable2Ref.value.tableRef ||
    !codeTable1ParentRef.value ||
    !codeTable2ParentRef.value
  ) {
    return;
  }
  const t1 = codeTable1Ref.value.tableRef;
  const t2 = codeTable2Ref.value.tableRef;
  const t1p = codeTable1ParentRef.value;
  const t2p = codeTable2ParentRef.value;
  const [t1w, t1pw] = [t1.offsetWidth, t1p.offsetWidth];
  const [t2w, t2pw] = [t2.offsetWidth, t2p.offsetWidth];
  const cw = codeContainerRef.value.offsetWidth;
  let percent = event.scrollLeft / (xScrollInnerWidth.value - cw);
  if (percent > 1) percent = 1;
  t1scroll.value = (t1w - t1pw) * percent;
  t2scroll.value = (t2w - t2pw) * percent;
}

/**
 * 缩进显示所需参数
 */

provide(codeTable2Component, codeTable2Ref);

/**
 * 外部获取 table
 */

defineExpose({ codeTable1Ref, codeTable2Ref });
</script>

<template>
  <div ref="code-container" class="code-container position-relative">
    <div class="d-flex position-relative">
      <div
        ref="code-table1-parent"
        class="flex-grow-1 flex-shrink-0 d-flex align-items-start overflow-x-hidden"
        :style="{ width: `${tcw}px` }"
      >
        <code-table ref="code-table1" :c-lines="lines1" :x-scroll="t1scroll" class="flex-fill" />
      </div>

      <div class="flex-shrink-0 d-flex" :style="{ width: `${lcw}px` }">
        <diff-lines-container
          :active-id="diffStore.activeDiffId"
          :diff-data-map="diffStore.diffDataMap"
          :diff-lines-map="diffLinesMap"
          :diff-line-click="diffStore.setDialogDiffId"
        />
      </div>

      <div
        ref="code-table2-parent"
        class="flex-grow-1 flex-shrink-0 d-flex align-items-start overflow-x-hidden"
        :style="{ width: `${tcw}px` }"
      >
        <code-table ref="code-table2" :c-lines="lines2" :x-scroll="t2scroll" class="flex-fill" />
      </div>

      <div class="position-absolute top-0 bottom-0 start-0 end-0 pe-none">
        <diff-active-line-container
          :diff-data-map="diffStore.diffDataMap"
          :diff-lines-map="diffLinesMap"
          :active-id="diffStore.activeDiffId"
        />
      </div>
    </div>

    <div v-if="xScrollInnerWidth > 0" class="sticky-bottom">
      <el-scrollbar :always="true" :noresize="true" wrap-class="code-scroll" @scroll="handleScroll">
        <div :style="{ height: '10px', width: `${xScrollInnerWidth}px` }"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style>
.code-scroll {
  height: 14px;
}
.code-scroll + .el-scrollbar__bar.is-horizontal {
  height: 10px;
}
</style>

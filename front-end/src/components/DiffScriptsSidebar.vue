<script setup lang="ts">
import { useDiffSidebarStore } from "@/stores/diff-sidebar.ts";
import { computed, inject, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import { useDiffStore } from "@/stores/diff.ts";
import { mainCodeContainerComponent } from "@/utils/injection-keys.ts";
import BiChevronLeft from "@/components/icons/BiChevronLeft.vue";
import BiChevronRight from "@/components/icons/BiChevronRight.vue";
import { usePageStore } from "@/stores/page.ts";

const diffSidebarStore = useDiffSidebarStore();
const diffStore = useDiffStore();
const pageStore = usePageStore();

const diffDataMap = computed(() => Array.from(diffStore.diffDataMap));

const diffSidebarTop = computed(() => pageStore.headerBottom);

const mainCodeContainer = inject(mainCodeContainerComponent)!;

function handleDiffScriptClick(id: DiffDataId) {
  const tr = mainCodeContainer.value?.codeTable1Ref?.tableRef?.querySelector(`[data-id-${id}]`);
  tr?.scrollIntoView({ block: "center" });
}

/**
 * 跟随 activeId 将对应项置于屏幕中间
 *
 * 鼠标在侧边栏时不要触发这个
 */

const listRef = useTemplateRef("list");
const isMouseOverList = ref<boolean>(false);

onMounted(() => {
  nextTick(() => {
    if (!listRef.value) return;
    listRef.value.addEventListener("mouseenter", () => (isMouseOverList.value = true));
    listRef.value.addEventListener("mouseleave", () => (isMouseOverList.value = false));
  });
});

watch(
  () => diffStore.activeDiffId,
  (id) => {
    if (!id || isMouseOverList.value || listRef.value === null) return;
    const li = listRef.value.querySelector(`[data-line-id="${id}"]`);
    li?.scrollIntoView({ block: "center" });
  },
);

/**
 * 拖拽宽度
 */
const sidebarWidth = ref<number>(400);

function handleDragLineMousedown(mousedownEvent: MouseEvent) {
  const WIDTH_MIN = 200; // px
  const WIDTH_MAX = window.innerWidth / 2;
  const startWidth = sidebarWidth.value;
  const startX = mousedownEvent.clientX;

  function handleMousemove(mousemoveEvent: MouseEvent) {
    const endX = mousemoveEvent.clientX;
    const moveX = startX - endX;
    const endWidth = startWidth - moveX;

    if (endWidth < WIDTH_MIN) {
      sidebarWidth.value = WIDTH_MIN;
    } else if (endWidth > WIDTH_MAX) {
      sidebarWidth.value = WIDTH_MAX;
    } else {
      sidebarWidth.value = endWidth;
    }
  }

  function handleMouseup() {
    window.removeEventListener("mousemove", handleMousemove);
    window.removeEventListener("mouseup", handleMouseup);
  }

  window.addEventListener("mousemove", handleMousemove);
  window.addEventListener("mouseup", handleMouseup);
}
</script>

<template>
  <div
    class="offcanvas offcanvas-start border-0 shadow bg-body-secondary"
    :class="[
      {
        visible: diffDataMap.length !== 0,
        show: diffSidebarStore.drawerVisible,
      },
    ]"
    :style="{
      top: `${diffSidebarTop - 20}px`,
      paddingTop: `20px`,
      width: `${sidebarWidth}px`,
    }"
  >
    <div class="offcanvas-body px-0 text-secondary-emphasis">
      <el-scrollbar class="px-3 overflow-x-auto">
        <ol ref="list" class="ol-double-brackets ps-5">
          <li
            v-for="[id, diff] in diffDataMap"
            :key="id"
            :data-line-id="id"
            :style="{
              backgroundColor:
                diffStore.activeDiffId === id ? `var(--diff-${diff.mode})` : undefined,
            }"
            @click="() => handleDiffScriptClick(id)"
          >
            {{ diff.edit_action }}
          </li>
        </ol>
      </el-scrollbar>
    </div>

    <div @mousedown="handleDragLineMousedown" class="offcanvas-drag-line"></div>

    <div
      class="drawer-toggle-button bg-body-secondary lh-sm text-secondary-emphasis"
      style="box-shadow: 0.125rem 0 0.25rem rgba(var(--bs-body-color-rgb), 0.15) !important"
      @click="diffSidebarStore.setDrawerVisible(!diffSidebarStore.drawerVisible)"
    >
      <div>
        <bi-chevron-left v-if="diffSidebarStore.drawerVisible" />
        <bi-chevron-right v-else />
      </div>
      <div class="mt-1 label-edit-script" style="overflow-wrap: break-word">
        {{ $t("btn_edit_script") }}
      </div>
    </div>
  </div>
</template>

<style>
html[lang="en"] .label-edit-script {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  line-height: 27px;
}

.offcanvas-drag-line {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2px;
  background: transparent;
  cursor: ew-resize;
  user-select: none; /* 避免拖动时选择页面内容 */
}

.drawer-toggle-button {
  position: absolute;
  right: -27px;
  user-select: none;
  width: 27px;
  padding: 16px 0;
  border-radius: 0 12px 12px 0;
  top: 50%;
  transform: translate(0, -50%);
  text-align: center;
  cursor: pointer;
  color: var(--bs-secondary-text);
  overflow-wrap: break-word;
}
</style>

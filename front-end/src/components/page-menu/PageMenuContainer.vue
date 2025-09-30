<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, useTemplateRef, watch } from "vue";
import ToTopButton from "@/components/page-menu/ToTopButton.vue";
import ToBottomButton from "@/components/page-menu/ToBottomButton.vue";
import { usePageStore } from "@/stores/page.ts";

const pageStore = usePageStore();

const pageMenuRef = useTemplateRef("page-menu");

const pageMenuPosition = reactive({
  bottom: getPageMenuBottomDefault(),
  right: getPageMenuRightDefault(),
});

function getPageMenuBottomDefault() {
  const val =
    (window.innerHeight - pageStore.headerBottom - (pageMenuRef.value?.clientHeight || 0)) / 2;
  return val < 30 ? 30 : val;
}

function getPageMenuRightDefault() {
  const val = (window.innerWidth - 1320) / 2 - 60;
  return val < 30 ? 30 : val;
}

function onResize() {
  pageMenuPosition.bottom = getPageMenuBottomDefault();
  pageMenuPosition.right = getPageMenuRightDefault();
}

function onScroll() {
  pageMenuPosition.bottom = getPageMenuBottomDefault();
}

// watch 代替监听 scroll 可以做到页面初始化时也能根据 headerBottom 动态计算位置
// pageStore.headerBottom 的值本来也是 scroll 获取的
watch(
  () => pageStore.headerBottom,
  () => onScroll(),
);

onMounted(() => {
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div
    ref="page-menu"
    class="pm-container d-flex flex-column gap-3"
    :style="{
      position: 'fixed',
      bottom: `${pageMenuPosition.bottom}px`,
      right: `${pageMenuPosition.right}px`,
    }"
  >
    <to-top-button class="pm-button shadow-sm" />
    <to-bottom-button class="pm-button shadow-sm" />
  </div>
</template>

<style>
.pm-container {
  --pm-btn-size: 46px;
  --pm-btn-bg: var(--bs-secondary-bg);
  --pm-btn-color: var(--bs-tertiary-color);
  --pm-btn-fs: 18px;
  --pm-btn-hover-bg: rgb(13, 110, 253);
  --pm-btn-hover-color: rgb(255, 255, 255);
}

.pm-button {
  height: var(--pm-btn-size);
  width: var(--pm-btn-size);
  background-color: var(--pm-btn-bg);
  color: var(--pm-btn-color);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-size: var(--pm-btn-fs);
}
.pm-button:hover {
  background-color: var(--pm-btn-hover-bg);
  color: var(--pm-btn-hover-color);
}
</style>

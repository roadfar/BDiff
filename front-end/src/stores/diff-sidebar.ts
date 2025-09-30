import { defineStore } from "pinia";
import { ref } from "vue";

export const useDiffSidebarStore = defineStore("diffSidebar", () => {
  const drawerVisible = ref<boolean>(false);

  function setDrawerVisible(visible: boolean) {
    drawerVisible.value = visible;
  }

  return {
    drawerVisible,
    setDrawerVisible,
  };
});

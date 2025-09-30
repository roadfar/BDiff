import { defineStore } from "pinia";
import { ref } from "vue";

function initDefaultFile(): StoreFile {
  return {
    content: "",
    name: "",
  };
}

export const useFilesStore = defineStore("files", () => {
  const file1 = ref<StoreFile>(initDefaultFile());
  const file2 = ref<StoreFile>(initDefaultFile());

  function setFile1(file: StoreFile): void {
    file1.value = file;
  }

  function setFile2(file: StoreFile): void {
    file2.value = file;
  }

  function removeFile1(): void {
    file1.value = initDefaultFile();
  }

  function removeFile2(): void {
    file2.value = initDefaultFile();
  }

  return {
    file1,
    file2,
    setFile1,
    setFile2,
    removeFile1,
    removeFile2,
  };
});

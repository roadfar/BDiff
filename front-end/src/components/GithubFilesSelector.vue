<script setup lang="ts">
import { useDiffStore } from "@/stores/diff.ts";
import { onMounted } from "vue";
import { usePageStore } from "@/stores/page.ts";

const diffStore = useDiffStore();
const pageStore = usePageStore();

onMounted(() => {
  pageStore.runGithub();
});

function handleChange(e: Event) {
  pageStore.runGithub((e.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="form-floating">
    <select
      id="github-file-select"
      class="form-select mb-0"
      :style="{ '--bs-form-control-bg': 'white' }"
      @change="handleChange"
    >
      <option
        v-for="file in pageStore.githubFiles"
        :key="file.filename"
        :value="file.filename"
        :disabled="file.status !== 'modified'"
      >
        {{ file.filename }}({{ file.status }})
      </option>
    </select>
    <label for="github-file-select"
      >{{ $t("btn_select_github_file_label")
      }}<span v-if="diffStore.loading" class="spinner-border spinner-border-sm"></span
    ></label>
  </div>
</template>

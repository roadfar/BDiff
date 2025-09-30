import type { InjectionKey, Ref } from "vue";
import type CodeTable from "@/components/code-container/CodeTable.vue";
import type CodeContainer from "@/components/code-container/CodeContainer.vue";

export const codeContainerRects = Symbol() as InjectionKey<{
  tcw: Ref<number>; // tableContainerWidth 代码表格容器宽度
  tlh: Ref<number>; // tableLineHeight 代码表格行高
  lch: Ref<number>; // diffLinesContainerHeight 差异连线容器高度
  lcw: Ref<number>; // diffLinesContainerWidth 差异连线容器宽度
}>;

export const mainCodeContainerComponent = Symbol() as InjectionKey<
  Ref<InstanceType<typeof CodeContainer> | null>
>;

export const codeTable2Component = Symbol() as InjectionKey<
  Ref<InstanceType<typeof CodeTable> | null>
>;

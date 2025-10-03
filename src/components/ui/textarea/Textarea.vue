<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const el = ref<HTMLTextAreaElement | null>(null);

const resize = () => {
  const t = el.value;
  if (!t) return;
  t.style.overflow = "hidden";
  t.style.height = "auto";
  t.style.height = `${t.scrollHeight}px`;
};

const onInput = async () => {
  await nextTick();
  resize();
};

onMounted(() => {
  nextTick(resize);
});

watch(
  modelValue,
  async () => {
    await nextTick();
    resize();
  },
  { immediate: true }
);

defineExpose({ el });
</script>

<template>
  <textarea
    ref="el"
    v-model="modelValue"
    rows="1"
    data-slot="textarea"
    v-bind="$attrs"
    @input="onInput"
    :class="
      cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-0 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow,height] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        props.class
      )
    "
  />
</template>

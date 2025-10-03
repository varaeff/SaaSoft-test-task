<script setup lang="ts">
import { ref } from "vue";
import { useVModel } from "@vueuse/core";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-vue-next";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  modelValue?: string;
  defaultValue?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const value = useVModel(props, "modelValue", emits, {
  defaultValue: props.defaultValue ?? "",
});

const showPassword = ref(true);
</script>

<template>
  <div class="relative w-full">
    <Input
      v-bind="$attrs"
      v-model="value"
      :type="showPassword ? 'password' : 'text'"
      autocomplete="off"
      class="pr-10"
      maxlength="100"
    />
    <div
      class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
      @click="showPassword = !showPassword"
    >
      <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
    </div>
  </div>
</template>

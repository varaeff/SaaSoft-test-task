<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-vue-next";

defineOptions({ inheritAttrs: false });

const showPassword = ref(true);
const password = ref("");
</script>

<template>
  <div class="relative w-full">
    <Input
      v-bind="$attrs"
      v-model="password"
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

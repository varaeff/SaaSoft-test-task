<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Trash2 } from "lucide-vue-next";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PwdInput } from "@/components/ui/pwdInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountStore } from "@/stores/account";

defineProps<{
  addAccount?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:addAccount", val: boolean): void;
}>();

const store = useAccountStore();
const MAX = 50;
const loginInvalid = ref(false);
const pwdInvalid = ref(false);

watch(
  () => store.login,
  (v) => {
    if (v && String(v).trim() !== "") loginInvalid.value = false;
  }
);

watch(
  () => store.password,
  (v) => {
    if (v && String(v).trim() !== "") pwdInvalid.value = false;
  }
);

const validateAndSubmit = () => {
  if (!store.login || String(store.login).trim() === "") {
    loginInvalid.value = true;
  } else {
    loginInvalid.value = false;
  }

  if (
    (!store.password || String(store.password).trim() === "") &&
    store.type !== "ldap"
  ) {
    pwdInvalid.value = true;
  } else {
    pwdInvalid.value = false;
  }

  console.log(store.$state);
};

const labelsText = computed({
  get: () => store.labels.map((l) => l.text).join(";"),
  set: (val: string) => {
    const safe = val.slice(0, MAX);
    const parts = safe
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      store.labels = [];
      return;
    }

    store.labels = parts.map((text) => ({ text }));
  },
});

const cancelAddingRecord = () => {
  loginInvalid.value = false;
  pwdInvalid.value = false;
  store.$reset();
  emit("update:addAccount", false);
};
</script>

<template>
  <form
    class="grid items-center gap-2 mb-3"
    :class="
      store.type !== 'ldap'
        ? 'grid-cols-[7fr_4fr_7fr_7fr_1fr]'
        : 'grid-cols-[7fr_4fr_14fr_1fr]'
    "
  >
    <Textarea
      ref="textareaRef"
      v-model="labelsText"
      class="resize-none transition-[height] duration-200 ease-in-out"
      @blur="validateAndSubmit"
      maxlength="50"
    />
    <Select v-model="store.type" @update:modelValue="validateAndSubmit">
      <SelectTrigger class="w-[4fr]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="local"> Локальная </SelectItem>
          <SelectItem value="ldap"> LDAP </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Input
      v-model="store.login"
      @blur="validateAndSubmit"
      maxlength="100"
      :class="
        loginInvalid
          ? 'border-[var(--destructive)] ring-2 ring-[var(--destructive)]'
          : ''
      "
    />
    <PwdInput
      v-if="store.type !== 'ldap'"
      v-model="store.password"
      @blur="validateAndSubmit"
      :class="
        pwdInvalid
          ? 'border-[var(--destructive)] ring-2 ring-[var(--destructive)]'
          : ''
      "
    />
    <Trash2
      class="cursor-pointer w-6 h-6 text-muted-foreground hover:text-foreground"
      @click="cancelAddingRecord"
    />
  </form>
</template>

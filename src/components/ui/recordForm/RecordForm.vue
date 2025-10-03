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
import type { Account } from "@/types";

const props = withDefaults(
  defineProps<{
    addAccount?: boolean;
    currentId: number;
    account: Account;
    actionAdd: boolean;
  }>(),
  {
    addAccount: false,
  }
);

const emit = defineEmits<{
  (e: "update:addAccount", val: boolean): void;
  (e: "update:currentId", val: number): void;
  (e: "update:account", val: typeof props.account): void;
  (e: "account-deleted", val: number): void;
  (e: "account-updated", val: typeof props.account): void;
}>();

const MAX = 50;
const loginInvalid = ref(false);
const pwdInvalid = ref(false);

watch(
  () => props.account.login,
  (v) => {
    if (v && String(v).trim() !== "") loginInvalid.value = false;
  }
);

watch(
  () => props.account.password,
  (v) => {
    if (v && String(v).trim() !== "") pwdInvalid.value = false;
  }
);

const validateAndSubmit = () => {
  console.log("validateAndSubmit", props.account);
  if (!props.account.login || String(props.account.login).trim() === "") {
    loginInvalid.value = true;
  } else {
    loginInvalid.value = false;
  }

  if (
    (!props.account.password || String(props.account.password).trim() === "") &&
    props.account.type !== "ldap"
  ) {
    pwdInvalid.value = true;
  } else {
    pwdInvalid.value = false;
  }

  if (!props.account.login || String(props.account.login).trim() === "") return;

  if (
    (!props.account.password || String(props.account.password).trim() === "") &&
    props.account.type !== "ldap"
  )
    return;

  if (props.actionAdd) {
    emit("update:account", props.account);
  } else {
    const updatedAccount = { ...props.account };
    emit("account-updated", updatedAccount);
  }
};

const labelsText = computed({
  get: () => props.account.labels.map((l) => l.text).join(";"),
  set: (val: string) => {
    const safe = val.slice(0, MAX);
    const parts = safe
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      props.account.labels = [];
      return;
    }

    props.account.labels = parts.map((text) => ({ text }));
  },
});

const deleteRecord = () => {
  if (props.actionAdd) {
    loginInvalid.value = false;
    pwdInvalid.value = false;
    emit("update:addAccount", false);
  } else {
    emit("account-deleted", props.currentId);
  }
};
</script>

<template>
  <form
    class="grid items-center gap-2 mb-3"
    :class="
      props.account.type !== 'ldap'
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
    <Select v-model="props.account.type" @update:modelValue="validateAndSubmit">
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
      v-model="props.account.login"
      @blur="validateAndSubmit"
      maxlength="100"
      :class="
        loginInvalid
          ? 'border-[var(--destructive)] ring-2 ring-[var(--destructive)]'
          : ''
      "
    />
    <PwdInput
      v-if="props.account.type !== 'ldap'"
      v-model="props.account.password"
      @blur="validateAndSubmit"
      :class="
        pwdInvalid
          ? 'border-[var(--destructive)] ring-2 ring-[var(--destructive)]'
          : ''
      "
    />
    <Trash2
      class="cursor-pointer w-6 h-6 text-muted-foreground hover:text-foreground"
      @click="deleteRecord"
    />
  </form>
</template>

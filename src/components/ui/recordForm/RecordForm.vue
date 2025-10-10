<script setup lang="ts">
import { computed, ref } from "vue";
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
import { ACCOUNT_TYPES } from "@/types";

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

const localAccount = ref<Account>({ ...props.account });

const emit = defineEmits<{
  (e: "update:addAccount", val: boolean): void;
  (e: "update:currentId", val: number): void;
  (e: "account-deleted", val: number): void;
  (e: "account-updated", val: Account): void;
  (e: "focus"): void;
}>();

const MAX = 50;
const loginInvalid = ref(false);
const pwdInvalid = ref(false);

const validateData = () => {
  localAccount.value.login = localAccount.value.login.trim();
  localAccount.value.password = localAccount.value.password.trim();

  if (!localAccount.value.login) {
    loginInvalid.value = true;
  } else {
    loginInvalid.value = false;
  }

  if (
    !localAccount.value.password &&
    localAccount.value.type !== ACCOUNT_TYPES.ldap
  ) {
    pwdInvalid.value = true;
  } else {
    pwdInvalid.value = false;
  }

  if (loginInvalid.value || pwdInvalid.value) return false;

  return true;
};

const submitData = () => {
  if (!validateData()) return;

  emit("account-updated", { ...localAccount.value });
  emit("update:addAccount", false);
};

const labelsText = computed({
  get: () => localAccount.value.labels.map((l) => l.text).join(";"),
  set: (val: string) => {
    const safe = val.slice(0, MAX);
    const parts = safe
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      localAccount.value.labels = [];
      return;
    }

    localAccount.value.labels = parts.map((text) => ({ text }));
  },
});

const onTypeChange = () => {
  submitData();
  emit("focus");
};

const deleteRecord = () => {
  if (props.actionAdd) {
    loginInvalid.value = false;
    pwdInvalid.value = false;
    props.account.labels = [];
    props.account.login = "";
    props.account.password = "";
    props.account.type = ACCOUNT_TYPES.local;
    emit("update:addAccount", false);
  } else {
    emit("account-deleted", props.currentId);
  }
};

const onFocus = () => {
  emit("focus");
};
</script>

<template>
  <form
    class="grid items-center gap-2 mb-3"
    :class="
      localAccount.type !== ACCOUNT_TYPES.ldap
        ? 'grid-cols-[7fr_4fr_7fr_7fr_1fr]'
        : 'grid-cols-[7fr_4fr_14fr_1fr]'
    "
  >
    <Textarea
      ref="textareaRef"
      v-model="labelsText"
      class="resize-none transition-[height] duration-200 ease-in-out"
      @blur="submitData"
      @focus="onFocus"
      maxlength="50"
    />
    <Select v-model="localAccount.type" @update:modelValue="onTypeChange">
      <SelectTrigger class="w-[4fr]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem :value="ACCOUNT_TYPES.local"> Локальная </SelectItem>
          <SelectItem :value="ACCOUNT_TYPES.ldap"> LDAP </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Input
      v-model="localAccount.login"
      @blur="submitData"
      @focus="onFocus"
      maxlength="100"
      :class="
        loginInvalid
          ? 'border-[var(--destructive)] ring-2 ring-[var(--destructive)]'
          : ''
      "
    />
    <PwdInput
      v-if="localAccount.type !== ACCOUNT_TYPES.ldap"
      v-model="localAccount.password"
      @blur="submitData"
      @focus="onFocus"
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

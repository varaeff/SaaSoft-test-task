<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Plus, CircleQuestionMark, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
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

const store = useAccountStore();
const MAX = 50;
const addAccount = ref(false);
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
  addAccount.value = false;
  loginInvalid.value = false;
  pwdInvalid.value = false;
  store.$reset();
};
</script>

<template>
  <div
    class="container max-w-4xl items-center justify-center bg-background p-8 mx-auto min-h-screen"
  >
    <div class="flex items-center mb-4">
      <h1 class="scroll-m-20 text-2xl font-bold tracking-tight mr-4">
        Учетные записи
      </h1>
      <Button
        class="cursor-pointer px-6 py-5"
        variant="outline"
        @click="addAccount = true"
      >
        <plus class="h-4 w-4" />
      </Button>
    </div>

    <div class="flex bg-card rounded-[var(--radius)] px-2 py-1 mb-4">
      <CircleQuestionMark stroke-width="1.25px" />
      <p class="ml-2">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </p>
    </div>

    <div
      class="grid grid-cols-[7fr_4fr_7fr_7fr_1fr] text-muted-foreground gap-2 mb-3"
    >
      <p>Метки</p>
      <p>Тип записи</p>
      <p>Логин</p>
      <p>Пароль</p>
      <p></p>
    </div>

    <form
      v-if="addAccount"
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
  </div>
</template>

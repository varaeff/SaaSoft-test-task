<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Plus, CircleQuestionMark } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { RecordForm } from "./components/ui/recordForm";
import { useNewAccountStore } from "@/stores/newAccount";
import { useAccountsListStore } from "@/stores/accountsList";
import type { Account } from "@/types";

const newAccountStore = useNewAccountStore();
const addAccount = ref(false);

const accountsListStore = useAccountsListStore();

const currentId = ref(
  sessionStorage.getItem("currentId")
    ? Number(sessionStorage.getItem("currentId"))
    : 0
);

const newAccount = computed({
  get: () => ({
    id: currentId.value,
    labels: newAccountStore.labels,
    type: newAccountStore.type,
    login: newAccountStore.login,
    password: newAccountStore.password,
  }),
  set: (val: any) => {
    newAccountStore.id = currentId.value;
    newAccountStore.labels = val?.labels ?? [];
    newAccountStore.type = val?.type ?? "";
    newAccountStore.login = val?.login ?? "";
    newAccountStore.password = val?.password ?? "";
  },
});

watch(addAccount, (val) => {
  if (!val) {
    newAccountStore.$reset();
  }
});

watch(
  newAccount,
  (val) => {
    if (!addAccount.value) return;

    const stored = sessionStorage.getItem("accounts");
    const accounts = stored ? JSON.parse(stored) : {};
    accounts[currentId.value] = val;
    sessionStorage.setItem("accounts", JSON.stringify(accounts));
    currentId.value += 1;
    sessionStorage.setItem("currentId", currentId.value.toString());
    addAccount.value = false;
    accountsListStore.accounts = accounts;
  },
  { deep: true }
);

const handleDelete = (id: number) => {
  const stored = sessionStorage.getItem("accounts");

  if (!stored) return;

  const parsed = JSON.parse(stored);
  delete parsed[id];
  sessionStorage.setItem("accounts", JSON.stringify(parsed));

  accountsListStore.accounts = Object.values(parsed);
};

const handleUpdateAccount = (updatedAccount: Account) => {
  if (updatedAccount.type === "ldap") {
    updatedAccount.password = "";
  }

  const stored = sessionStorage.getItem("accounts");
  const parsed: Record<string, Account> = stored ? JSON.parse(stored) : {};

  parsed[updatedAccount.id] = updatedAccount;
  sessionStorage.setItem("accounts", JSON.stringify(parsed));

  accountsListStore.accounts = Object.values(parsed);
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

    <RecordForm
      v-for="account in accountsListStore.accounts"
      :key="Number(account.id)"
      :currentId="Number(account.id)"
      :account="account"
      :actionAdd="false"
      @account-deleted="handleDelete"
      @account-updated="handleUpdateAccount"
    />

    <RecordForm
      v-if="addAccount"
      v-model:addAccount="addAccount"
      v-model:currentId="currentId"
      v-model:account="newAccount"
      :actionAdd="true"
    />
  </div>
</template>

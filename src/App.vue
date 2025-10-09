<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { HelpBlock } from "./components/ui/helpBlock";
import { RecordForm } from "./components/ui/recordForm";
import { useAccountsListStore } from "@/stores/accountsList";
import type { Account } from "@/types";
import { ACCOUNT_TYPES, STORAGE_TYPES } from "@/types";

const accountsListStore = useAccountsListStore();
const addAccount = ref(false);

const currentId = ref(
  sessionStorage.getItem(STORAGE_TYPES.currentId)
    ? Number(sessionStorage.getItem(STORAGE_TYPES.currentId))
    : 0
);

const newAccount = ref<Account | null>(null);

const startAddAccount = () => {
  newAccount.value = {
    id: currentId.value,
    labels: [],
    type: ACCOUNT_TYPES.local,
    login: "",
    password: "",
  };
  addAccount.value = true;
};

watch(
  newAccount,
  (val) => {
    if (!addAccount.value) return;

    const stored = sessionStorage.getItem(STORAGE_TYPES.accounts);
    const accounts = stored ? JSON.parse(stored) : {};
    accounts[currentId.value] = val;
    sessionStorage.setItem(STORAGE_TYPES.accounts, JSON.stringify(accounts));
    currentId.value += 1;
    sessionStorage.setItem(STORAGE_TYPES.currentId, currentId.value.toString());
    addAccount.value = false;
    accountsListStore.accounts = accounts;
  },
  { deep: true }
);

const handleDelete = (id: number) => {
  const stored = sessionStorage.getItem(STORAGE_TYPES.accounts);

  if (!stored) return;

  const parsed = JSON.parse(stored);
  delete parsed[id];
  sessionStorage.setItem(STORAGE_TYPES.accounts, JSON.stringify(parsed));

  accountsListStore.accounts = Object.values(parsed);
};

const handleUpdateAccount = (updatedAccount: Account) => {
  if (updatedAccount.type === ACCOUNT_TYPES.ldap) {
    updatedAccount.password = "";
  }

  const stored = sessionStorage.getItem(STORAGE_TYPES.accounts);
  const parsed: Record<string, Account> = stored ? JSON.parse(stored) : {};

  parsed[updatedAccount.id] = updatedAccount;
  sessionStorage.setItem(STORAGE_TYPES.accounts, JSON.stringify(parsed));

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
        @click="startAddAccount"
      >
        <plus class="h-4 w-4" />
      </Button>
    </div>

    <HelpBlock />

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
      v-if="addAccount && newAccount"
      v-model:addAccount="addAccount"
      :currentId="currentId"
      :account="newAccount"
      :actionAdd="true"
      @account-updated="handleUpdateAccount"
    />
  </div>
</template>

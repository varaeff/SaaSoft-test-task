<script setup lang="ts">
import { ref } from "vue";
import { Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { HelpBlock } from "./components/ui/helpBlock";
import { RecordForm } from "./components/ui/recordForm";
import { useAccountsListStore } from "@/stores/accountsList";
import type { Account } from "@/types";
import { ACCOUNT_TYPES, STORAGE_TYPES } from "@/types";

const accountsListStore = useAccountsListStore();
accountsListStore.initWatch();
const addAccount = ref(false);
const newAccount = ref<Account | null>(null);

const currentId = ref(
  sessionStorage.getItem(STORAGE_TYPES.currentId)
    ? Number(sessionStorage.getItem(STORAGE_TYPES.currentId))
    : 0
);

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

const handleDelete = (id: number) => {
  console.log("Delete account with id:", id);
  const index = accountsListStore.accounts.findIndex((acc) => acc.id === id);

  if (index === -1) return;

  accountsListStore.accounts.splice(index, 1);
};

const handleUpdateAccount = (account: Account) => {
  if (account.type === ACCOUNT_TYPES.ldap) {
    account.password = "";
  }

  if (addAccount.value) {
    accountsListStore.addAccount(account);
    currentId.value += 1;
    console.log(currentId.value);
    sessionStorage.setItem(STORAGE_TYPES.currentId, currentId.value.toString());
    addAccount.value = false;
  } else {
    const index = accountsListStore.accounts.findIndex(
      (acc) => acc.id === account.id
    );

    if (index !== -1) {
      accountsListStore.accounts[index] = {
        ...accountsListStore.accounts[index],
        ...account,
      };
    }
  }
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
      @focus="addAccount = false"
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

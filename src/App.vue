<script setup lang="ts">
import { ref } from "vue";
import { Plus, CircleQuestionMark } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { RecordForm } from "./components/ui/recordForm";

const addAccount = ref(false);
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

    <RecordForm v-if="addAccount" v-model:addAccount="addAccount" />
  </div>
</template>

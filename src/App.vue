<script setup lang="ts">
import { Plus, CircleQuestionMark, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
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
</script>

<template>
  <div
    class="container max-w-4xl items-center justify-center bg-background p-8 mx-auto min-h-screen"
  >
    <div class="flex items-center mb-4">
      <h1 class="scroll-m-20 text-2xl font-bold tracking-tight mr-4">
        Учетные записи
      </h1>
      <Button class="cursor-pointer px-6 py-5" variant="outline">
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

    <div class="grid grid-cols-[7fr_4fr_7fr_7fr_1fr] items-center gap-2 mb-3">
      <Input />
      <Select>
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
      <Input />
      <PwdInput />
      <Trash2
        class="cursor-pointer w-6 h-6 text-muted-foreground hover:text-foreground"
      />
    </div>
  </div>
</template>

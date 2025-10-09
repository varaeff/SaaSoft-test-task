<script setup lang="ts">
import { CircleQuestionMark } from "lucide-vue-next";
</script>

<template>
  <div class="flex bg-card rounded-[var(--radius)] px-2 py-1 mb-4">
    <CircleQuestionMark stroke-width="1.25px" />
    <p class="ml-2">
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель ;
    </p>
  </div>
</template>

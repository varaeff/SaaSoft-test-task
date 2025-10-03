import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    labels: [] as Array<{ text: string }>,
    type: "local" as string,
    login: "" as string,
    password: "" as string,
  }),
  getters: {},
  actions: {},
});

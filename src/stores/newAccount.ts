import { defineStore } from "pinia";
import type { Account } from "@/types";

export const useNewAccountStore = defineStore("newAccount", {
  state: () =>
    ({
      id: 0,
      labels: [],
      type: "local",
      login: "",
      password: "",
    } as Account),
});

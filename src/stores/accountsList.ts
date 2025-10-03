import { defineStore } from "pinia";
import type { Account } from "@/types";

export const useAccountsListStore = defineStore("accountsList", {
  state: () => {
    let accounts: Account[] = [];

    const raw = sessionStorage.getItem("accounts");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, Account>;
        accounts = Object.keys(parsed)
          .map((k) => ({
            idx: Number(k),
            acc: parsed[k],
          }))
          .map((item) => item.acc)
          .filter((acc): acc is Account => acc !== undefined);
      } catch {
        accounts = [];
      }
    }

    return {
      accounts,
    };
  },
});

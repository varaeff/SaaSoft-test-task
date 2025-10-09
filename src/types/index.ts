export interface Account {
  id: number;
  labels: Array<{ text: string }>;
  type: (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];
  login: string;
  password: string;
}

export const ACCOUNT_TYPES = {
  local: "local" as string,
  ldap: "ldap" as string,
} as const;

export const STORAGE_TYPES = {
  accounts: "accounts" as string,
  currentId: "currentId" as string,
} as const;

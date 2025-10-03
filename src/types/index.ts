export interface Account {
  id: number;
  labels: Array<{ text: string }>;
  type: string;
  login: string;
  password: string;
}

export type Transaction = {
  id: string;
  title: string;
  value: number;
  type: "income" | "expense";
  date: Date;
  description?: string;
};
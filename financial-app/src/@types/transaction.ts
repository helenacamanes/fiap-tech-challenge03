export interface Transaction {
  id: string;
  title: string;
  value: number;
  date: Date;
  type: 'income' | 'expense';
  category?: string;
}
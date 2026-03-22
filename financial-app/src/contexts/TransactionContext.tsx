import React, { createContext, useContext, useState } from "react";
import { Transaction } from "../@types/transaction";

type TransactionContextData = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
};

const TransactionContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      title: "Salário Mensal",
      value: 2500,
      type: "income",
      date: new Date(),
    },
    {
      id: "2",
      title: "Supermercado Continente",
      value: 85.4,
      type: "expense",
      date: new Date(),
    },
    {
      id: "3",
      title: "Ginásio",
      value: 35.0,
      type: "expense",
      date: new Date(),
    },
    {
      id: "4",
      title: "Freelance React",
      value: 450,
      type: "income",
      date: new Date(),
    },
  ]);

  function addTransaction(transaction: Omit<Transaction, "id">) {
    setTransactions((prev) => [
      {
        ...transaction,
        id: Date.now().toString(),
      },
      ...prev,
    ]);
  }

  function removeTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, removeTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
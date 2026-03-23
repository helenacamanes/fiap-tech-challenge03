import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction } from "../@types/transaction";
import {
  createTransaction,
  removeTransactionFromFirestore,
  subscribeToTransactions,
  type CreateTransactionInput,
} from "../services/firestoreService";
import { useAuth } from "./AuthContext";

type TransactionContextData = {
  transactions: Transaction[];
  addTransaction: (transaction: CreateTransactionInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
};

const TransactionContext = createContext<TransactionContextData>(
  {} as TransactionContextData,
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      return;
    }

    const unsubscribe = subscribeToTransactions(setTransactions);

    return () => {
      unsubscribe?.();
    };
  }, [user?.uid]);

  async function addTransaction(transaction: CreateTransactionInput) {
    await createTransaction(transaction);
  }

  async function removeTransaction(id: string) {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    await removeTransactionFromFirestore(transaction);
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

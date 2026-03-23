import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { Transaction } from "../@types/transaction";
import type { UserProfile } from "../@types/finance";

function getCurrentUserId() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("Usuário não autenticado.");
  }

  return uid;
}

function getUserRef(uid: string) {
  return doc(db, "users", uid);
}

function getTransactionsCollection(uid: string) {
  return collection(db, "users", uid, "transactions");
}

export type CreateTransactionInput = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  account?: string;
};

export type UpdateTransactionInput = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  account?: string;
};

async function ensureUserRootDoc(uid: string) {
  await setDoc(
    getUserRef(uid),
    {
      uid,
      email: auth.currentUser?.email ?? "",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function createTransaction(data: CreateTransactionInput) {
  const uid = getCurrentUserId();

  const transactionPayload = {
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description ?? "",
    account: data.account ?? "",
    date: Timestamp.fromDate(data.date),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const profilePayload = {
    updatedAt: serverTimestamp(),
    balance: increment(data.type === "income" ? data.amount : -data.amount),
  };

  try {
    await ensureUserRootDoc(uid);
    await addDoc(getTransactionsCollection(uid), transactionPayload);
    await setDoc(getUserRef(uid), profilePayload, { merge: true });
  } catch (error) {
    console.error("Erro dentro de createTransaction:", error);
    throw error;
  }
}

export async function updateTransactionInFirestore(
  transactionId: string,
  data: UpdateTransactionInput,
  previousTransaction: Transaction,
) {
  const uid = getCurrentUserId();
  const transactionRef = doc(db, "users", uid, "transactions", transactionId);

  const previousSignedValue =
    previousTransaction.type === "income"
      ? previousTransaction.value
      : -previousTransaction.value;

  const newSignedValue = data.type === "income" ? data.amount : -data.amount;

  const balanceDelta = newSignedValue - previousSignedValue;

  await updateDoc(transactionRef, {
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description ?? "",
    account: data.account ?? "",
    date: Timestamp.fromDate(data.date),
    updatedAt: serverTimestamp(),
  });

  await setDoc(
    getUserRef(uid),
    {
      updatedAt: serverTimestamp(),
      balance: increment(balanceDelta),
    },
    { merge: true },
  );
}

export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
) {
  const uid = getCurrentUserId();
  const q = query(getTransactionsCollection(uid), orderBy("date", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions: Transaction[] = snapshot.docs.map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          title: data.category,
          value: data.amount,
          type: data.type,
          date: data.date?.toDate?.() ?? new Date(),
          description: data.description ?? "",
          account: data.account ?? "",
        };
      });

      callback(transactions);
    },
    (error) => {
      console.error("Erro no subscribeToTransactions:", error);
      callback([]);
    },
  );
}

export async function removeTransactionFromFirestore(transaction: Transaction) {
  const uid = getCurrentUserId();

  await deleteDoc(doc(db, "users", uid, "transactions", transaction.id));

  await setDoc(
    getUserRef(uid),
    {
      updatedAt: serverTimestamp(),
      balance: increment(
        transaction.type === "income" ? -transaction.value : transaction.value,
      ),
    },
    { merge: true },
  );
}

export function subscribeToProfile(
  callback: (profile: UserProfile | null) => void,
) {
  const uid = getCurrentUserId();

  return onSnapshot(
    getUserRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(snapshot.data() as UserProfile);
    },
    (error) => {
      console.error("Erro no subscribeToProfile:", error);
      callback(null);
    },
  );
}

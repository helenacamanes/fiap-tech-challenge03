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

export async function testRootWrite() {
  const ref = await addDoc(collection(db, "debugWrites"), {
    uid: auth.currentUser?.uid ?? null,
    email: auth.currentUser?.email ?? "",
    createdAt: serverTimestamp(),
    source: "manual-test",
  });
}

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

  try {
    await ensureUserRootDoc(uid);
    const ref = await addDoc(
      getTransactionsCollection(uid),
      transactionPayload,
    );
    await setDoc(
      getUserRef(uid),
      {
        updatedAt: serverTimestamp(),
        balance: increment(data.type === "income" ? data.amount : -data.amount),
      },
      { merge: true },
    );
  } catch (error) {
    throw error;
  }
}

export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
) {
  const uid = getCurrentUserId();
  const q = query(getTransactionsCollection(uid), orderBy("date", "desc"));

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
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

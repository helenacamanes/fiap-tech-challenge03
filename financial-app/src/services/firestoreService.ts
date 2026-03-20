import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
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
import type {
  Transaction,
  TransactionType,
  UserProfile,
} from "../@types/finance";

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

export async function ensureUserProfile() {
  const uid = getCurrentUserId();
  const userRef = getUserRef(uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

type CreateTransactionInput = {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
};

export async function createTransaction(data: CreateTransactionInput) {
  const uid = getCurrentUserId();

  await ensureUserProfile();

  await addDoc(getTransactionsCollection(uid), {
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description,
    date: Timestamp.fromDate(data.date),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(getUserRef(uid), {
    balance: increment(data.type === "income" ? data.amount : -data.amount),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const uid = getCurrentUserId();
  const snapshot = await getDoc(getUserRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function getTransactions(): Promise<Transaction[]> {
  const uid = getCurrentUserId();
  const q = query(getTransactionsCollection(uid), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => {
    const data = docItem.data();

    return {
      id: docItem.id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date?.toDate?.() ?? new Date(),
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  });
}

export function subscribeToProfile(
  callback: (profile: UserProfile | null) => void,
) {
  const uid = getCurrentUserId();

  return onSnapshot(getUserRef(uid), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.data() as UserProfile);
  });
}

export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
) {
  const uid = getCurrentUserId();
  const q = query(getTransactionsCollection(uid), orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((docItem) => {
      const data = docItem.data();

      return {
        id: docItem.id,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date?.toDate?.() ?? new Date(),
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      };
    });

    callback(transactions);
  });
}

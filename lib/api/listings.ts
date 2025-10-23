import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp, updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export type Listing = {
  id?: string;
  title: string;
  description: string;
  pricePerDay?: number;
  photos?: string[];
  ownerId: string;
  createdAt?: any;

  // optional extras (not strictly typed to stay agile)
  categoryId?: string;
  categoryLabel?: string;
  locationText?: string;
  delivery?: string;
  fees?: { deposit?: number };
  conditionNotes?: string;
  specs?: string;
};


export async function createListing(data: Omit<Listing, "id">) {
  const ref = collection(db, "listings");
  const res = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return res.id;
}

export async function fetchListings(): Promise<Listing[]> {
  const ref = collection(db, "listings");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Listing) }));
}

export async function fetchMyListings(ownerId: string) {
  const ref = collection(db, "listings");
  const q = query(ref, where("ownerId","==", ownerId), orderBy("createdAt","desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Listing) }));
}

export async function fetchListing(id: string) {
  const d = await getDoc(doc(db, "listings", id));
  return d.exists() ? ({ id: d.id, ...(d.data() as Listing) }) : null;
}

export async function updateListing(id: string, patch: Partial<Listing>) {
  await updateDoc(doc(db, "listings", id), patch as any);
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export type Booking = {
  id?: string;
  listingId: string;
  borrowerId: string; // for owner blocks, borrowerId === ownerId
  startDate: Timestamp;
  endDate: Timestamp;
  status: "confirmed" | "cancelled";
  createdAt?: any;
};

export const toTS = (d: string | Date) => {
  const date = (d instanceof Date) ? d : new Date(d);
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0));
  return Timestamp.fromDate(utc);
};

const overlaps = (aStart: Timestamp, aEnd: Timestamp, bStart: Timestamp, bEnd: Timestamp) =>
  aStart.toMillis() <= bEnd.toMillis() && aEnd.toMillis() >= bStart.toMillis();

export async function fetchBookingsForListing(listingId: string): Promise<Booking[]> {
  const ref = collection(db, "bookings");
  const q = query(ref, where("listingId","==", listingId), orderBy("startDate"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export async function fetchBookingsForUser(userId: string) {
  const ref = collection(db, "bookings");
  const q = query(ref, where("borrowerId", "==", userId), orderBy("startDate", "asc"));
  const snap = await getDocs(q);

  const out: any[] = [];
  for (const d of snap.docs) {
    const data = d.data();
    let listingTitle: string | undefined;
    if (data.listingId) {
      const lref = doc(db, "listings", data.listingId);
      const lsnap = await getDoc(lref);
      listingTitle = lsnap.exists() ? (lsnap.data() as any).title : undefined;
    }
    out.push({ id: d.id, listingTitle, ...data });
  }
  return out;
}

export async function fetchUnavailableRanges(listingId: string) {
  const rows = await fetchBookingsForListing(listingId);
  // Treat everything that's not cancelled as unavailable
  return rows
    .filter(r => (r.status ?? "confirmed") !== "cancelled")
    .map(r => ({ start: r.startDate.toDate(), end: r.endDate.toDate(), borrowerId: r.borrowerId }));
}

export function rangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd;
}

export async function isRangeAvailable(listingId: string, start: Date, end: Date) {
  const blocks = await fetchUnavailableRanges(listingId);
  return !blocks.some(b => rangeOverlaps(start, end, b.start, b.end));
}

export async function attemptBookingRange(params: {
  listingId: string; borrowerId: string; startDate: string | Date; endDate: string | Date;
}) {
  const startTS = toTS(params.startDate);
  const endTS   = toTS(params.endDate);
  if (endTS.toMillis() < startTS.toMillis()) throw new Error("End before start");

  const bookingsRef = collection(db, "bookings");

  return runTransaction(db, async (trx) => {
    const snap = await getDocs(query(bookingsRef, where("listingId","==", params.listingId)));
    const existing = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Booking[];

    const conflict = existing.find(b => b.status !== "cancelled" && overlaps(b.startDate, b.endDate, startTS, endTS));
    if (conflict) throw new Error("Dates unavailable");

    const newRef = doc(bookingsRef);
    trx.set(newRef, {
      listingId: params.listingId,
      borrowerId: params.borrowerId,
      startDate: startTS,
      endDate: endTS,
      status: "confirmed",
      createdAt: serverTimestamp(),
    });

    return { ok: true, id: newRef.id };
  });
}

export async function cancelBooking(bookingId: string) {
  await updateDoc(doc(db,"bookings", bookingId), { status: "cancelled" } as any);
}

export async function blockRange(params: { listingId: string; ownerId: string; startDate: string|Date; endDate: string|Date; }) {
  return attemptBookingRange({
    listingId: params.listingId,
    borrowerId: params.ownerId, // owner-block
    startDate: params.startDate,
    endDate: params.endDate,
  });
}

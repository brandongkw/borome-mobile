// app/(tabs)/explore.tsx
import { Stack, useFocusEffect } from "expo-router";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { db } from "../../lib/firebase";

type Booking = {
  id: string;
  listingId: string;
  startDate: number; // ms
  endDate: number;   // ms
  status: "confirmed" | "blocked";
};

type Row = Booking & { listingTitle?: string };

const DEMO_OWNER = "owner-demo-1"; // keep as-is for now

export default function MyBookings() {
  const [rows, setRows] = useState<Row[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setRefreshing(true);
      // get my bookings (simple: borrowerId == DEMO_OWNER)
      const q = query(
        collection(db, "bookings"),
        where("borrowerId", "==", DEMO_OWNER),
        orderBy("startDate", "desc")
      );
      const snap = await getDocs(q);
      const bookings: Booking[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      // fetch listing titles (simple N calls — fine for our scale)
      const withTitle: Row[] = [];
      for (const b of bookings) {
        let listingTitle: string | undefined;
        try {
          const ldoc = await getDoc(doc(db, "listings", b.listingId));
          listingTitle = ldoc.exists() ? (ldoc.data() as any).title : undefined;
        } catch {}
        withTitle.push({ ...b, listingTitle });
      }
      setRows(withTitle);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "My bookings" }} />
      <FlatList
        data={rows}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          const title = item.listingTitle ?? item.listingId; // fallback
          return (
            <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb", padding: 14 }}>
              <Text style={{ fontWeight: "800", fontSize: 18 }}>{title}</Text>
              <Text style={{ marginTop: 4 }}>
                {start.toDateString()} → {end.toDateString()}
              </Text>
              <Text style={{ marginTop: 4, color: "#666" }}>Status: {item.status}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ padding: 16, color: "#666" }}>No bookings yet.</Text>
        }
      />
    </View>
  );
}

// app/listing/[id]/manage.tsx
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams } from "expo-router";
import { Timestamp, addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { db } from "../../../lib/firebase";

type Block = {
  id: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: "blocked";
};

function fmt(d?: Date) {
  return d ? d.toISOString().slice(0, 10) : "";
}
function atUTC(d: Date) {
  // midnight UTC to avoid TZ drift
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
}
function fromISO(iso: string) {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m as number) - 1, day as number, 0, 0, 0));
}

export default function ManageAvailability() {
  const { id: listingId } = useLocalSearchParams<{ id: string }>();

  // selection state
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [editing, setEditing] = useState<"start" | "end">("start");

  // existing reservations/blocks
  const [rows, setRows] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const ref = collection(db, "bookings");
        const qy = query(ref, where("listingId", "==", listingId), orderBy("startDate"));
        const snap = await getDocs(qy);
        if (!isMounted) return;
        const data = snap.docs
          .map(d => ({ id: d.id, ...(d.data() as any) }))
          .filter(r => r.status === "blocked") as Block[];
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [listingId]);

  // calendar marked dates (blocked + selection)
  const marked = useMemo(() => {
    const marks: Record<string, any> = {};

    // existing blocks (light red)
    for (const b of rows) {
      const s = b.startDate.toDate();
      const e = b.endDate.toDate();
      for (
        let d = atUTC(s);
        d <= e;
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))
      ) {
        const key = fmt(d);
        marks[key] = {
          ...(marks[key] ?? {}),
          disabled: true,
          disableTouchEvent: true,
          marked: true,
          dotColor: "#ef4444",
        };
      }
    }

    // selection (solid red period)
    if (start) {
      const a = atUTC(start);
      const b = end ? atUTC(end) : atUTC(start);
      const [lo, hi] = a <= b ? [a, b] : [b, a];

      for (
        let d = lo;
        d <= hi;
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))
      ) {
        const key = fmt(d);
        const isStart = fmt(d) === fmt(lo);
        const isEnd = fmt(d) === fmt(hi);
        marks[key] = {
          ...(marks[key] ?? {}),
          selected: true,
          startingDay: isStart,
          endingDay: isEnd,
          color: "#ef4444",
          textColor: "#fff",
        };
      }
    }

    return marks;
  }, [rows, start, end]);

  // change via calendar
  const onDayPress = (day: DateData) => {
    const picked = fromISO(day.dateString);
    if (editing === "start") {
      let newStart = picked;
      let newEnd = end;
      if (newEnd && newEnd < newStart) {
        // auto-swap to keep range valid
        [newStart, newEnd] = [newEnd, newStart];
      }
      setStart(newStart);
      setEnd(newEnd);
      setEditing("end");
    } else {
      let newStart = start ?? picked;
      let newEnd = picked;
      if (newStart && newEnd < newStart) {
        [newStart, newEnd] = [newEnd, newStart];
      }
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  // native picker helpers
  const openNativePicker = (which: "start" | "end") => {
    const base = which === "start" ? start ?? new Date() : end ?? (start ?? new Date());
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: base,
        mode: "date",
        onChange: (_, d) => {
          if (!d) return;
          const picked = atUTC(d);
          if (which === "start") {
            let ns = picked, ne = end;
            if (ne && ne < ns) [ns, ne] = [ne, ns];
            setStart(ns); setEnd(ne); setEditing("end");
          } else {
            let ns = start ?? picked, ne = picked;
            if (ns && ne < ns) [ns, ne] = [ne, ns];
            setStart(ns); setEnd(ne);
          }
        },
      });
    } else {
      // iOS: simplest path is to rely on the calendar selection; optional modal can be added later.
      Alert.alert("Tip", "Tap the date fields to choose which side to edit, then pick on the calendar.");
    }
  };

  const clearSelection = () => {
    setStart(undefined);
    setEnd(undefined);
    setEditing("start");
  };

  const blockRange = async () => {
    if (!start || !end) {
      Alert.alert("Select a range first");
      return;
    }
    const s = atUTC(start);
    const e = atUTC(end);

    // simple overlap check against existing blocks
    const overlap = rows.some(b => {
      const bs = b.startDate.toDate();
      const be = b.endDate.toDate();
      return !(e < bs || s > be);
    });
    if (overlap) {
      Alert.alert("Overlaps existing block", "Choose a different range.");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      listingId,
      status: "blocked",
      startDate: Timestamp.fromDate(s),
      endDate: Timestamp.fromDate(e),
      createdAt: Timestamp.now(),
      borrowerId: "owner-demo-1", // stays consistent with your demo setup
    });

    Alert.alert("Blocked!");
    setRows(prev => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        status: "blocked",
        startDate: Timestamp.fromDate(s),
        endDate: Timestamp.fromDate(e),
      },
    ]);
    clearSelection();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 24 }}>
      <Stack.Screen options={{ title: "Manage Availability" }} />

      {/* Selector pills */}
      <View style={{ padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 6 }}>Block a date range</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => setEditing("start")}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderWidth: 2,
              borderRadius: 12,
              borderColor: editing === "start" ? "#ef4444" : "#e5e7eb",
              backgroundColor: editing === "start" ? "#fee2e2" : "#fff",
            }}
          >
            <Text style={{ fontSize: 12, color: "#6b7280" }}>Start</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>{start ? fmt(start) : "—"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setEditing("end")}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderWidth: 2,
              borderRadius: 12,
              borderColor: editing === "end" ? "#ef4444" : "#e5e7eb",
              backgroundColor: editing === "end" ? "#fee2e2" : "#fff",
            }}
          >
            <Text style={{ fontSize: 12, color: "#6b7280" }}>End</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>{end ? fmt(end) : "—"}</Text>
          </Pressable>
        </View>

        {/* Shortcuts */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => openNativePicker("start")}
            style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb" }}
          >
            <Text style={{ textAlign: "center", fontWeight: "700" }}>Pick start</Text>
          </Pressable>
          <Pressable
            onPress={() => openNativePicker("end")}
            style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb" }}
          >
            <Text style={{ textAlign: "center", fontWeight: "700" }}>Pick end</Text>
          </Pressable>
          <Pressable
            onPress={clearSelection}
            style={{ padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", minWidth: 84 }}
          >
            <Text style={{ textAlign: "center", fontWeight: "700" }}>Clear</Text>
          </Pressable>
        </View>
      </View>

      {/* Calendar */}
      <Calendar
        markingType="period"
        markedDates={marked}
        onDayPress={onDayPress}
        theme={{
          todayTextColor: "#ef4444",
          selectedDayTextColor: "#fff",
          arrowColor: "#ef4444",
        }}
      />

      {/* Block CTA */}
      <View style={{ padding: 16 }}>
        <Pressable
          onPress={blockRange}
          disabled={!start || !end}
          style={{
            backgroundColor: start && end ? "#ef4444" : "#9ca3af",
            paddingVertical: 14,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 }}>
            Block Range
          </Text>
        </Pressable>
      </View>

      {/* Existing blocks list */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8 }}>
          Existing reservations / blocks
        </Text>
        {loading ? (
          <Text>Loading…</Text>
        ) : rows.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>None</Text>
        ) : (
          rows.map((b) => {
            const s = b.startDate.toDate();
            const e = b.endDate.toDate();
            return (
              <View
                key={b.id}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  marginBottom: 8,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ fontWeight: "700" }}>Blocked</Text>
                <Text>{s.toDateString()} → {e.toDateString()}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

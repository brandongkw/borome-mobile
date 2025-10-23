import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  attemptBookingRange,
  fetchUnavailableRanges,
  rangeOverlaps,
} from "../../../lib/api/bookings";
import { buildSelectedRangeMark, buildUnavailableMarks, mergeMarks } from "../../../lib/calendarMarks";
type CalendarDay = { dateString: string };


const DEMO_BORROWER = "borrower-demo-1";

function toYMD(d: Date) { return d.toISOString().slice(0, 10); }

export default function Book() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date(Date.now() + 86400_000));
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch unavailable ranges for this listing
  const [unavailable, setUnavailable] = useState<{ start: Date; end: Date }[]>([]);
  useEffect(() => {
    (async () => {
      const rows = await fetchUnavailableRanges(id!);
      setUnavailable(rows);
    })();
  }, [id]);

  const hasConflict = unavailable.some(b => rangeOverlaps(start, end, b.start, b.end));

  async function confirm() {
    if (end < start) return Alert.alert("End date is before start date.");
    if (hasConflict) return Alert.alert("Those dates are unavailable.");
    setLoading(true);
    try {
      const res = await attemptBookingRange({ listingId: id!, borrowerId: DEMO_BORROWER, startDate: start, endDate: end });
      setLoading(false);
      if (res?.ok) Alert.alert("Booked!", "", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      setLoading(false);
      Alert.alert("Booking failed", e?.message || "Dates unavailable");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Stack.Screen options={{ title: "Book this item" }} />

      <Text style={{ fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 12 }}>Select your dates</Text>

      <View style={{ gap: 12 }}>
        <View>
          <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>Start</Text>
          <Pressable onPress={() => setShowStart(true)} style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 12 }}>
            <Text style={{ color: "#111" }}>{toYMD(start)}</Text>
          </Pressable>
        </View>
        <View>
          <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>End</Text>
          <Pressable onPress={() => setShowEnd(true)} style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 12 }}>
            <Text style={{ color: "#111" }}>{toYMD(end)}</Text>
          </Pressable>
        </View>

        {showStart && (
          <DateTimePicker
            value={start}
            mode="date"
            display={Platform.select({ ios: "inline", android: "calendar" })}
            onChange={(_, d) => { setShowStart(Platform.OS === "ios"); if (d) setStart(d); }}
          />
        )}
        {showEnd && (
          <DateTimePicker
            value={end}
            mode="date"
            display={Platform.select({ ios: "inline", android: "calendar" })}
            onChange={(_, d) => { setShowEnd(Platform.OS === "ios"); if (d) setEnd(d); }}
          />
        )}

        {/* Show unavailable ranges pulled from Firestore */}
        {/* Visual calendar showing unavailable + selection */}
        <View style={{ marginBottom: 8 }}>
          <Calendar
            markingType="period"
            markedDates={mergeMarks(
              buildUnavailableMarks(unavailable),
              buildSelectedRangeMark(start, end)
            )}
            onDayPress={(day: CalendarDay) => {
              const picked = new Date(`${day.dateString}T00:00:00Z`);
              if (!start || picked <= start) {
                setStart(picked);
                if (end && picked > end) setEnd(picked);
              } else {
                setEnd(picked);
              }
            }}
            theme={{
              selectedDayBackgroundColor: "#ef4444",
              todayTextColor: "#ef4444",
              monthTextColor: "#111",
              textSectionTitleColor: "#6b7280",
              arrowColor: "#ef4444",
            }}
          />
        </View>


        {hasConflict ? (
          <Text style={{ color: "#b91c1c", fontWeight: "600", marginTop: 4 }}>
            Your selected range overlaps with an unavailable period.
          </Text>
        ) : null}
      </View>

      <View style={{ flex: 1 }} />
      <Pressable
        disabled={loading || hasConflict}
        onPress={confirm}
        style={{
          backgroundColor: (loading || hasConflict) ? "#9ca3af" : "#ef4444",
          paddingVertical: 14, borderRadius: 14
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Text>
      </Pressable>
    </View>
  );
}

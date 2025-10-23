// app/create/calendar.tsx
import { Link, Stack } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  buildSelectedRangeMark,
  buildUnavailableMarks,
  mergeMarks
} from "../../lib/calendarMarks";
import { DraftCtx } from "./_layout";

type CalendarDay = { dateString: string };

function toYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseUTC(ymd: string) {
  return new Date(`${ymd}T00:00:00Z`);
}
function normalizeUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// merge overlapping/adjacent blocks
function mergeBlocks(blocks: { start: Date; end: Date }[]) {
  if (!blocks.length) return blocks;
  const sorted = [...blocks]
    .map(b => ({ start: normalizeUTC(b.start), end: normalizeUTC(b.end) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const out: { start: Date; end: Date }[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = out[out.length - 1];
    const cur = sorted[i];
    // if cur.start <= prev.end + 1 day => merge
    if (cur.start.getTime() <= prev.end.getTime() + 86_400_000) {
      prev.end = new Date(Math.max(prev.end.getTime(), cur.end.getTime()));
    } else {
      out.push(cur);
    }
  }
  return out;
}
// check overlap with existing blocks
function overlaps(a: { start: Date; end: Date }, b: { start: Date; end: Date }) {
  return a.start <= b.end && b.start <= a.end;
}

export default function CreateCalendar() {
  const { draft, setDraft } = useContext(DraftCtx);
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();

  const blocks = draft.blocks ?? [];

  const marks = useMemo(() => {
    return mergeMarks(
      buildUnavailableMarks(blocks),        // show existing blocks in soft red
      buildSelectedRangeMark(start, end)    // current selection in strong red
    );
  }, [blocks, start, end]);

  function onDayPress(day: CalendarDay) {
    const picked = parseUTC(day.dateString);
    if (!start || picked <= start) {
      setStart(picked);
      if (end && picked > end) setEnd(picked);
    } else {
      setEnd(picked);
    }
  }

  function addBlock() {
    if (!start || !end) {
      Alert.alert("Select a range", "Tap a start day, then an end day.");
      return;
    }
    const s = normalizeUTC(start);
    const e = normalizeUTC(end);
    if (e < s) {
      Alert.alert("Invalid range", "End date must be on or after start.");
      return;
    }
    // client-side guard against overlapping existing blocks
    const newBlock = { start: s, end: e };
    for (const b of blocks) {
      if (overlaps(newBlock, { start: normalizeUTC(b.start), end: normalizeUTC(b.end) })) {
        Alert.alert("Overlaps existing", "Pick a range that doesn't overlap.");
        return;
      }
    }
    const next = mergeBlocks([...blocks, newBlock]);
    setDraft(d => ({ ...d, blocks: next }));
    setStart(undefined);
    setEnd(undefined);
    Alert.alert("Blocked!", `${toYMD(s)} → ${toYMD(e)} added.`);
  }

  function removeBlock(idx: number) {
    const next = blocks.filter((_, i) => i !== idx);
    setDraft(d => ({ ...d, blocks: next }));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Booking Calendar" }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 12 }}>
          Select a range to block
        </Text>

        <Calendar
          markingType="period"
          markedDates={marks}
          onDayPress={onDayPress}
          theme={{
            selectedDayBackgroundColor: "#ef4444",
            todayTextColor: "#ef4444",
            monthTextColor: "#111",
            textSectionTitleColor: "#6b7280",
            arrowColor: "#ef4444",
          }}
        />

        {/* Action */}
        <Pressable
          onPress={addBlock}
          style={{
            marginTop: 14,
            backgroundColor: "#ef4444",
            paddingVertical: 14,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
            Add Block {start && end ? `(${toYMD(start)} → ${toYMD(end)})` : ""}
          </Text>
        </Pressable>

        {/* Existing blocks list */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "800", color: "#111", marginBottom: 8 }}>
            Existing blocks
          </Text>
          {blocks.length === 0 ? (
            <Text style={{ color: "#6b7280" }}>None yet</Text>
          ) : (
            blocks.map((b, idx) => (
              <View
                key={idx}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#111" }}>
                  {new Date(b.start).toDateString()} → {new Date(b.end).toDateString()}
                </Text>
                <Pressable
                  onPress={() =>
                    Alert.alert("Remove block", "Delete this block?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Remove", style: "destructive", onPress: () => removeBlock(idx) },
                    ])
                  }
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    backgroundColor: "#fee2e2",
                  }}
                >
                  <Text style={{ color: "#991b1b", fontWeight: "700" }}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Nav actions */}
        <View style={{ height: 14 }} />
        <Link href="/create/condition" asChild>
          <Pressable
            style={{
              backgroundColor: "#111827",
              paddingVertical: 14,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
              Continue
            </Text>
          </Pressable>
        </Link>
        <View style={{ height: 10 }} />
        <Link href="/create/pricing" asChild>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ color: "#111", textAlign: "center", fontWeight: "700" }}>
              Back
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

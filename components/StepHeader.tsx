import React from "react";
import { Text, View } from "react-native";

type Props = { title: string; current: number; total: number };

export default function StepHeader({ title, current, total }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#111", marginBottom: 10 }}>
        {title}
      </Text>
      <View style={{ height: 8, backgroundColor: "#f3f4f6", borderRadius: 999 }}>
        <View style={{ width: `${pct}%`, height: 8, backgroundColor: "#ef4444", borderRadius: 999 }} />
      </View>
      <Text style={{ color: "#6b7280", marginTop: 6 }}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreateDelivery() {
  const { draft, setDraft } = useContext(DraftCtx);
  const router = useRouter();
  const [choice, setChoice] = useState<"pickup" | "delivery" | "courier">("pickup");

  function next() {
    setDraft(d => ({ ...d, delivery: choice }));
    router.push("/create/pricing");
  }

  function Opt({ id, label }: { id: "pickup" | "delivery" | "courier"; label: string }) {
    const active = choice === id;
    return (
      <Pressable
        onPress={() => setChoice(id)}
        style={{
          padding: 16,
          borderWidth: 2,
          borderColor: active ? "#ef4444" : "#e5e7eb",
          borderRadius: 14,
          backgroundColor: "#fff"
        }}
      >
        <Text style={{ fontWeight: "800", color: "#111" }}>{label}</Text>
        <Text style={{ color: active ? "#ef4444" : "#6b7280", marginTop: 6 }}>
          {active ? "Selected" : "Tap to select"}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor:"#fff", padding:16, gap:12 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Delivery options" current={6} total={TOTAL_STEPS} />
      <Opt id="pickup" label="Pickup only" />
      <Opt id="delivery" label="Delivery available" />
      <Opt id="courier" label="Courier / Postage" />

      <View style={{ height: 8 }} />
      <Pressable onPress={next} style={{ backgroundColor:"#ef4444", paddingVertical:14, borderRadius:14 }}>
        <Text style={{ textAlign:"center", color:"#fff", fontWeight:"700" }}>Next</Text>
      </Pressable>
    </View>
  );
}

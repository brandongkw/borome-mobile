import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreatePricing() {
  const { draft, setDraft } = useContext(DraftCtx);
  const router = useRouter();
  const [deposit, setDeposit] = useState(String(draft.fees?.deposit ?? ""));

  function next() {
    const val = Number(deposit || 0);
    setDraft(d => ({ ...d, fees: { ...(d.fees||{}), deposit: isNaN(val) ? 0 : val } }));
    router.push("/create/optional");
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Pricing & fees" current={7} total={TOTAL_STEPS} />

      <Text style={{ color:"#6b7280", marginBottom:10 }}>
        Optionally set a refundable deposit to protect against damage.
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>Security deposit ($)</Text>
      <TextInput
        value={deposit}
        onChangeText={setDeposit}
        keyboardType="numeric"
        placeholder="e.g., 100"
        placeholderTextColor="#9ca3af"
        style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111" }}
      />

      <View style={{ height: 16 }} />
      <Pressable onPress={next} style={{ backgroundColor:"#ef4444", paddingVertical:14, borderRadius:14 }}>
        <Text style={{ textAlign:"center", color:"#fff", fontWeight:"700" }}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

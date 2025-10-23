import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreateOptional() {
  const { draft, setDraft } = useContext(DraftCtx);
  const router = useRouter();
  const [condition, setCondition] = useState((draft as any).conditionNotes || "");
  const [specs, setSpecs] = useState((draft as any).specs || "");

  function next() {
    setDraft(d => ({ ...d, conditionNotes: condition, specs }));
    router.push("/create/preview");
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Condition & optional details" current={9} total={TOTAL_STEPS} />

      <Text style={{ fontWeight:"600", marginBottom:6, color:"#111" }}>Condition Notes</Text>
      <TextInput
        value={condition}
        onChangeText={setCondition}
        placeholder="e.g., Minor scratches; lens cap included."
        placeholderTextColor="#9ca3af"
        multiline numberOfLines={3}
        style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111", textAlignVertical:"top" }}
      />

      <View style={{ height:12 }} />
      <Text style={{ fontWeight:"600", marginBottom:6, color:"#111" }}>Specifications / Notes</Text>
      <TextInput
        value={specs}
        onChangeText={setSpecs}
        placeholder="Dimensions, manual links, accessories list…"
        placeholderTextColor="#9ca3af"
        multiline numberOfLines={3}
        style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111", textAlignVertical:"top" }}
      />

      <View style={{ height:16 }} />
      <Pressable onPress={next} style={{ backgroundColor:"#ef4444", paddingVertical:14, borderRadius:14 }}>
        <Text style={{ textAlign:"center", color:"#fff", fontWeight:"700" }}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

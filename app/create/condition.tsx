import { Stack, useRouter } from "expo-router";
import React, { useContext, useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

const GRADES = [
  { id: "new", label: "New" },
  { id: "like-new", label: "Like new" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
  { id: "used", label: "Well used" },
] as const;

export default function CreateCondition() {
  const router = useRouter();
  const { draft, setDraft } = useContext(DraftCtx);

  const selected = (draft as any).conditionGrade as string | undefined;
  const notes = (draft as any).conditionNotes as string | undefined;

  function choose(id: typeof GRADES[number]["id"]) {
    setDraft((d) => ({ ...d, conditionGrade: id }));
  }

  function saveAndNext() {
    router.push("/create/pricing"); // next step in your flow
  }

  const canContinue = useMemo(() => !!selected, [selected]);

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Condition" current={6} total={TOTAL_STEPS} />

      <Text style={{ fontSize:18, fontWeight:"800", color:"#111", marginBottom:12 }}>
        Select item condition
      </Text>

      <View style={{ gap:10 }}>
        {GRADES.map((g) => {
          const active = selected === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => choose(g.id)}
              style={{
                padding:14,
                borderRadius:14,
                borderWidth:1,
                borderColor: active ? "#ef4444" : "#e5e7eb",
                backgroundColor: active ? "#fee2e2" : "#fff",
              }}
            >
              <Text style={{ fontWeight:"700", color:"#111" }}>{g.label}</Text>
              {active ? (
                <Text style={{ color:"#ef4444", marginTop:4 }}>Selected</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={{ height:16 }} />

      <Text style={{ fontSize:16, fontWeight:"700", color:"#111", marginBottom:8 }}>
        Notes (optional)
      </Text>
      <TextInput
        value={notes || ""}
        onChangeText={(t) => setDraft((d) => ({ ...d, conditionNotes: t }))}
        placeholder="Mention scratches, wear, missing parts, etc."
        placeholderTextColor="#9ca3af"
        multiline
        style={{
          minHeight:100,
          padding:12,
          borderWidth:1,
          borderColor:"#e5e7eb",
          borderRadius:14,
          color:"#111",
          textAlignVertical:"top",
        }}
      />

      <View style={{ height:16 }} />

      <Pressable
        disabled={!canContinue}
        onPress={saveAndNext}
        style={{
          backgroundColor: canContinue ? "#ef4444" : "#9ca3af",
          paddingVertical:14,
          borderRadius:14,
        }}
      >
        <Text style={{ color:"#fff", textAlign:"center", fontWeight:"700" }}>
          Continue
        </Text>
      </Pressable>

      <View style={{ height:10 }} />

      <Pressable
        onPress={() => router.back()}
        style={{ paddingVertical:14, borderRadius:14, borderWidth:1, borderColor:"#e5e7eb", backgroundColor:"#fff" }}
      >
        <Text style={{ color:"#111", textAlign:"center", fontWeight:"700" }}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

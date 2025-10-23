import { Stack, useRouter } from "expo-router";
import React, { useContext, useMemo } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreateIndex() {
  const router = useRouter();
  const { draft, setDraft } = useContext(DraftCtx);

  const selected = draft?.type; // 'personal' | 'business'
  const canContinue = useMemo(() => !!selected, [selected]);

  function chooseType(type: "personal" | "business") {
    setDraft((d) => ({ ...d, type }));
  }

  function saveAndNext() {
    router.push("/create/category");
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Listing Type" current={1} total={TOTAL_STEPS} />

      <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 12 }}>
        Choose listing type
      </Text>

      {/* PERSONAL CARD */}
      <Pressable
        onPress={() => chooseType("personal")}
        style={{
          borderWidth: 2,
          borderColor:
            selected === "personal" ? "#ef4444" : "#e5e7eb",
          backgroundColor:
            selected === "personal" ? "#fee2e2" : "#fff",
          borderRadius: 16,
          padding: 18,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111",
            marginBottom: 6,
          }}
        >
          Personal Listing
        </Text>
        <Text style={{ color: "#555" }}>
          Lend out your own items to others in your community.
        </Text>
      </Pressable>

      {/* BUSINESS CARD */}
      <Pressable
        onPress={() => chooseType("business")}
        style={{
          borderWidth: 2,
          borderColor:
            selected === "business" ? "#ef4444" : "#e5e7eb",
          backgroundColor:
            selected === "business" ? "#fee2e2" : "#fff",
          borderRadius: 16,
          padding: 18,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111",
            marginBottom: 6,
          }}
        >
          Business Listing
        </Text>
        <Text style={{ color: "#555" }}>
          List items as a business for rental or promotion.
        </Text>
      </Pressable>

      {/* Continue Button */}
      <Pressable
        disabled={!canContinue}
        onPress={saveAndNext}
        style={{
          backgroundColor: canContinue ? "#ef4444" : "#9ca3af",
          paddingVertical: 14,
          borderRadius: 14,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}

import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const CATEGORIES = [
  { id: "transport", label: "All Transport" },
  { id: "electronics", label: "Electronics" },
  { id: "babies_kids", label: "Babies & Kids" },
  { id: "fashion", label: "Fashion" },
  { id: "tools", label: "Tools" },
  { id: "outdoors", label: "Outdoors" },
];

export default function CategoryStep() {
  const { draft, setDraft } = useContext(DraftCtx);
  const [selected, setSelected] = useState<string | undefined>(draft.categoryId);
  const router = useRouter();

  function choose(catId: string, label: string) {
    setSelected(catId);
    setDraft((d) => ({ ...d, categoryId: catId, categoryLabel: label }));
  }

  function next() {
    if (!selected) return;
    router.push("/create/details");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Select a category" current={2} total={10} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const active = item.id === selected;
          return (
            <Pressable
              onPress={() => choose(item.id, item.label)}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 14,
                borderWidth: 2,
                backgroundColor: "#fff",
                borderColor: active ? "#ef4444" : "#e5e7eb",
              }}
            >
              <Text style={{ fontWeight: "800", color: "#111" }}>{item.label}</Text>
              <Text style={{ color: active ? "#ef4444" : "#6b7280", marginTop: 6 }}>
                {active ? "Selected" : "Tap to select"}
              </Text>
            </Pressable>
          );
        }}
      />

      <View style={{ height: 18 }} />
      <Pressable
        onPress={next}
        disabled={!selected}
        style={{
          backgroundColor: selected ? "#ef4444" : "#9ca3af",
          paddingVertical: 14,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Next</Text>
      </Pressable>
    </View>
  );
}

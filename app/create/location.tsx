import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreateLocation() {
  const { draft, setDraft } = useContext(DraftCtx);
  const router = useRouter();
  const [address, setAddress] = useState(draft.locationText || "");

  function next() {
    if (!address.trim()) return Alert.alert("Add a pickup location (you can keep it general).");
    setDraft(d => ({ ...d, locationText: address }));
    router.push("/create/delivery");
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Location" current={5} total={TOTAL_STEPS} />

      <Text style={{ color:"#6b7280", marginBottom:10 }}>
        Enter the pickup location (street/suburb or general area).
      </Text>

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="e.g., South Brisbane, QLD"
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

import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { createListing } from "../../lib/api/listings";
import { DraftCtx } from "./_layout";

const DEMO_OWNER = "owner-demo-1";

export default function CreateDetails() {
  const { draft, setDraft } = useContext(DraftCtx);
  const [title, setTitle] = useState(draft.title || "");
  const [desc, setDesc] = useState(draft.description || "");
  const [price, setPrice] = useState(draft.pricePerDay || "");
  const router = useRouter();

  async function next() {
    if (!title.trim()) return Alert.alert("Please add a title");
    // Save to draft and move to next step (images)
    setDraft((d) => ({ ...d, title, description: desc, pricePerDay: price }));
    router.push("/create/images");
  }

  // For quick testing we keep the Publish shortcut too:
  async function publishNow() {
    if (!title.trim()) return Alert.alert("Please add a title");
    const id = await createListing({
      title,
      description: desc,
      pricePerDay: Number(price || 0),
      ownerId: DEMO_OWNER,
      photos: [],
    });
    Alert.alert("Published!", "", [{ text: "OK", onPress: () => router.replace(`/listing/${id}`) }]);
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Details" current={3} total={10} />

      <Text style={{ color:"#6b7280", marginBottom: 10 }}>
        {draft.categoryLabel ? `Category: ${draft.categoryLabel}` : "No category chosen"}
      </Text>

      <View style={{ gap: 14 }}>
        <View>
          <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., DJI Mini 3 Pro"
            placeholderTextColor="#9ca3af"
            style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111" }}
          />
        </View>

        <View>
          <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="What is it, condition, accessories..."
            placeholderTextColor="#9ca3af"
            multiline numberOfLines={4}
            style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111", textAlignVertical:"top" }}
          />
        </View>

        <View>
          <Text style={{ fontWeight: "600", marginBottom: 6, color: "#111" }}>Price per day ($)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="e.g., 15"
            placeholderTextColor="#9ca3af"
            style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, backgroundColor:"#fff", color:"#111" }}
          />
        </View>
      </View>

      <View style={{ height: 24 }} />
      <Pressable onPress={next} style={{ backgroundColor: "#ef4444", paddingVertical: 14, borderRadius: 14 }}>
        <Text style={{ textAlign: "center", color: "#fff", fontWeight: "700", fontSize: 16 }}>Next</Text>
      </Pressable>

      <View style={{ height: 10 }} />
      <Pressable onPress={publishNow} style={{ backgroundColor: "#fff", paddingVertical: 14, borderRadius: 14, borderWidth:1, borderColor:"#e5e7eb" }}>
        <Text style={{ textAlign: "center", color: "#111", fontWeight: "700", fontSize: 16 }}>Publish (shortcut)</Text>
      </Pressable>
    </ScrollView>
  );
}

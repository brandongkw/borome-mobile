import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;

export default function CreateImages() {
  const { draft, setDraft } = useContext(DraftCtx);
  const router = useRouter();
  const [picking, setPicking] = useState(false);

  async function addPhoto() {
    try {
      setPicking(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photos to add images.");
        setPicking(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      setPicking(false);
      if (result.canceled) return;

      const uris = (result.assets || []).map(a => a.uri);
      setDraft(d => ({ ...d, photos: [...(d.photos || []), ...uris] }));
    } catch (e: any) {
      setPicking(false);
      Alert.alert("Image error", e?.message || "Could not pick image.");
    }
  }

  function next() {
    if (!draft.photos || draft.photos.length === 0) {
      Alert.alert("Add at least one photo for a quality listing.");
      return;
    }
    router.push("/create/location");
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:"#fff" }} contentContainerStyle={{ padding:16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Images" current={4} total={TOTAL_STEPS} />

      <Text style={{ color:"#6b7280", marginBottom: 10 }}>
        Add clear photos that show the item from multiple angles.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        {(draft.photos || []).map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={{ width: 110, height: 110, borderRadius: 10, borderWidth:1, borderColor:"#e5e7eb" }}
          />
        ))}
      </View>

      <Pressable
        onPress={addPhoto}
        disabled={picking}
        style={{ backgroundColor:"#fff", borderWidth:1, borderColor:"#e5e7eb", paddingVertical:12, borderRadius:12 }}
      >
        <Text style={{ textAlign:"center", color:"#111", fontWeight:"700" }}>
          {picking ? "Opening gallery…" : "Add photos"}
        </Text>
      </Pressable>

      <View style={{ height: 12 }} />

      <Pressable
        onPress={next}
        style={{ backgroundColor:"#ef4444", paddingVertical:14, borderRadius:14 }}
      >
        <Text style={{ textAlign:"center", color:"#fff", fontWeight:"700" }}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

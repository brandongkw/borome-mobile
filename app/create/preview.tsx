import { Stack, useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import StepHeader from "../../components/StepHeader";
import { blockRange } from "../../lib/api/bookings";
import { createListing } from "../../lib/api/listings";
import { storage } from "../../lib/firebase";
import { uploadImageAsync } from "../../lib/storage";
import { DraftCtx } from "./_layout";

const TOTAL_STEPS = 10;
const DEMO_OWNER = "owner-demo-1";

async function uriToBlob(uri: string): Promise<Blob> {
  // fetch works in Expo to read file:// and content://
  const res = await fetch(uri);
  if (!res.ok) {
    throw new Error(`Failed to fetch local file: ${uri}`);
  }
  return await res.blob();
}

async function uploadPhoto(listingId: string, uri: string, index: number) {
  const blob = await uriToBlob(uri);
  const path = `listings/${listingId}/${index}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: blob.type || "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  return url;
}

export default function CreatePreview() {
  const { draft } = useContext(DraftCtx);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function publish() {
    try {
      if (!draft.title || !draft.categoryId) {
        return Alert.alert("Missing info", "Please complete category and details.");
      }
      setLoading(true);

      // 1) Upload photos if any
      const photos = draft.photos || [];
      // in preview.tsx, inside publish()
      const uploaded: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        try {
          const uri = photos[i];
          const url = await uploadImageAsync(uri, `listings/${DEMO_OWNER}/${Date.now()}_${i}.jpg`);
          uploaded.push(url);
        } catch (err: any) {
          console.warn("Upload failed for photo", i, err?.message || err);
          Alert.alert("Photo upload failed", `Photo ${i + 1}: ${err?.message || "Unknown error"}`);
          // You can return here if you want to abort publish on a failed image.
        }
      }

      // 2) Create listing doc (include all draft fields we care about)
      const listingId = await createListing({
        title: draft.title!,
        description: draft.description || "",
        pricePerDay: Number(draft.pricePerDay || 0),
        ownerId: DEMO_OWNER,
        photos: uploaded,
        // extra fields we might store directly on the listing:
        // @ts-ignore store some extra fields alongside
        categoryId: draft.categoryId,
        categoryLabel: draft.categoryLabel,
        locationText: draft.locationText || "",
        delivery: (draft as any).delivery || "pickup",
        fees: draft.fees || {},
        conditionNotes: (draft as any).conditionNotes || "",
        specs: (draft as any).specs || "",
      } as any);

      // 3) Apply owner blocks
      const blocks: { start: Date; end: Date }[] = (draft as any).blocks || [];
      for (const b of blocks) {
        await blockRange({ listingId, ownerId: DEMO_OWNER, startDate: b.start, endDate: b.end });
      }

      setLoading(false);
      Alert.alert("Published!", "", [{ text: "OK", onPress: () => router.replace(`/listing/${listingId}`) }]);
    } catch (e: any) {
      setLoading(false);
      Alert.alert("Publish failed", e?.message || "Please try again.");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: "Create Listing" }} />
      <StepHeader title="Preview & publish" current={10} total={TOTAL_STEPS} />

      <Text style={{ fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 }}>{draft.title || "(No title)"}</Text>
      <Text style={{ color: "#6b7280" }}>
        {draft.categoryLabel || "(No category)"} · ${draft.pricePerDay || 0}/day
      </Text>

      <View style={{ height: 12 }} />
      <Text style={{ color: "#111" }}>{draft.description || "(No description)"}</Text>

      {draft.photos?.length ? (
        <>
          <View style={{ height: 12 }} />
          <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
            {draft.photos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={{ width: 140, height: 100, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb" }} />
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={{ height: 12 }} />
      <Text style={{ color: "#111" }}>Pickup area: {draft.locationText || "(not set)"} </Text>
      <Text style={{ color: "#111" }}>Delivery: {(draft as any).delivery || "pickup"}</Text>
      <Text style={{ color: "#111" }}>Deposit: ${draft.fees?.deposit ?? 0}</Text>

      {(draft as any).conditionNotes ? (
        <>
          <View style={{ height: 8 }} />
          <Text style={{ color: "#111" }}>Condition: {(draft as any).conditionNotes}</Text>
        </>
      ) : null}

      {(draft as any).specs ? (
        <>
          <View style={{ height: 8 }} />
          <Text style={{ color: "#111" }}>Specs: {(draft as any).specs}</Text>
        </>
      ) : null}

      <View style={{ height: 18 }} />
      <Pressable
        disabled={loading}
        onPress={publish}
        style={{ backgroundColor: loading ? "#9ca3af" : "#ef4444", paddingVertical: 14, borderRadius: 14 }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontWeight: "700" }}>
          {loading ? "Publishing…" : "Publish"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

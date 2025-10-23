import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchListings } from "../../lib/api/listings";

export default function BrowseTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchListings();
    setItems(data);
  }, []);

  useEffect(() => { (async () => setItems(await fetchListings()))(); }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: insets.top + 8, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8, color: "#111" }}>Browse</Text>

      <FlatList
        data={items || []}
        keyExtractor={(it) => it.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Link href={`/listing/${item.id}`} asChild>
            <Pressable style={{ padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, marginBottom: 10, backgroundColor: "#fff" }}>
              <Text style={{ fontWeight: "700", color: "#111" }}>{item.title}</Text>
              <Text numberOfLines={2} style={{ color: "#444" }}>{item.description}</Text>
              {item.pricePerDay ? <Text style={{ color: "#111" }}>${item.pricePerDay}/day</Text> : null}
            </Pressable>
          </Link>
        )}
      />

      {/* BoroMe pinkish-red */}
      <Link href="/create" asChild>
        <Pressable
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: "#ef4444",
            borderRadius: 30,
            paddingHorizontal: 20,
            paddingVertical: 14,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Create Listing</Text>
        </Pressable>
      </Link>
    </View>
  );
}

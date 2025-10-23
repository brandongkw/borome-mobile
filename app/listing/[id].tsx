import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { fetchBookingsForListing } from "../../lib/api/bookings";
import { fetchListing } from "../../lib/api/listings";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      setListing(await fetchListing(id!));
      setBookings(await fetchBookingsForListing(id!));
    })();
  }, [id]);

  if (!listing) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>{listing.title}</Text>
      {listing.pricePerDay ? <Text style={{ marginTop: 6 }}>${listing.pricePerDay}/day</Text> : null}
      <Text style={{ color: "#444", marginTop: 8 }}>{listing.description}</Text>

      {Array.isArray(listing.photos) && listing.photos.length > 0 && (
        <>
          <View style={{ height: 12 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {listing.photos.map((u: string, i: number) => (
              <Image key={i} source={{ uri: u }} style={{ width: 260, height: 180, borderRadius: 12 }} />
            ))}
          </ScrollView>
        </>
      )}
      <View style={{ height: 12 }} />
      <Text style={{ color: "#6b7280" }}>
        {listing.locationText ? `📍 ${listing.locationText}  ·  ` : ""}{listing.delivery || "pickup"}
        {listing.fees?.deposit ? `  ·  deposit $${listing.fees.deposit}` : ""}
      </Text>


      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "600" }}>Upcoming bookings:</Text>
        {!bookings ? <ActivityIndicator style={{ marginTop: 6 }} /> :
          bookings.length === 0 ? <Text style={{ color: "#666" }}>None</Text> :
            bookings.map(b => (
              <Text key={b.id} style={{ marginTop: 4 }}>
                {b.status === "cancelled" ? "❌" : "📅"} {b.startDate.toDate().toDateString()} → {b.endDate.toDate().toDateString()}
              </Text>
            ))
        }
      </View>

      <View style={{ flex: 1 }} />
      <Link href={`/listing/${id}/book`} asChild>
        <Pressable style={{ backgroundColor: "#ef4444", padding: 14, borderRadius: 10 }}>
          <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Book this item</Text>
        </Pressable>
      </Link>


      <View style={{ height: 12 }} />
      <Link href={`/listing/${id}/manage`} asChild>
        <Pressable style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 14, borderRadius: 10 }}>
          <Text style={{ textAlign: "center", color: "#111", fontWeight: "600" }}>Manage Availability (owner)</Text>
        </Pressable>
      </Link>
    </View>

  );
}

// app/create-listing.tsx
import { Redirect } from "expo-router";

export default function CreateListingRedirect() {
  // When someone goes to /create-listing,
  // automatically take them to the new multi-step /create flow
  return <Redirect href="/create" />;
}

import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,          // hides the "(tabs)" header
        tabBarActiveTintColor: "#ef4444",
      }}
    >
      <Tabs.Screen name="index"   options={{ title: "Browse" }} />
      <Tabs.Screen name="explore" options={{ title: "My Bookings" }} />
    </Tabs>
  );
}

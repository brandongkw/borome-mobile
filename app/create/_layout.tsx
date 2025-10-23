import { Stack } from "expo-router";
import React, { createContext, useMemo, useState } from "react";

export type Draft = {
  type?: "personal" | "business";
  categoryId?: string;
  categoryLabel?: string;

  // details
  title?: string;
  description?: string;
  pricePerDay?: string;

  // images (local URIs during draft, URLs after publish)
  photos?: string[];

  // location & delivery
  locationText?: string;
  delivery?: "pickup" | "delivery" | "courier";

  // fees
  fees?: { deposit?: number };

  // booking calendar (owner blocks collected during wizard)
  blocks?: { start: Date; end: Date }[];

  // optional + condition
  conditionGrade?: "new" | "like-new" | "good" | "fair" | "used";
  conditionNotes?: string;
  specs?: string;
};

export const DraftCtx = createContext<{
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
}>({ draft: {}, setDraft: () => {} });

export default function CreateLayout() {
  const [draft, setDraft] = useState<Draft>({});
  const value = useMemo(() => ({ draft, setDraft }), [draft]);

  return (
    <DraftCtx.Provider value={value}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800" },
          headerTintColor: "#111",
        }}
      />
    </DraftCtx.Provider>
  );
}

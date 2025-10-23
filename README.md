# BoroMe Mobile (Expo + Firebase)

A cross-platform React Native (Expo) prototype for the BoroMe MVP redesign.  
This app demonstrates the complete **listing creation** and **booking** experience, using **Firebase** for auth, Firestore, and storage.

## Key Features
- **Account split:** Personal vs Business onboarding (sign-up flow).
- **Listing creation:** Details → Category/Subcategory → Condition → Pricing & Fees → Delivery/Pickup → Availability (date-range + blockouts) → Summary.
- **Booking flow:** Create and view bookings with live updates.
- **Browse & My Bookings:** Real-time Firestore reads with pull-to-refresh and optimistic UI.
- **MVP-aligned styling:** Updated components to match partner branding & UX.
- **Map view scaffold:** Layout prepared for `expo-maps` (optional key required).

## Tech Stack
- **React Native** (Expo)
- **TypeScript**
- **Firebase** (Auth, Firestore, Storage)
- **Expo Router** or React Navigation
- **Zustand/Context** for lightweight state
- **ESLint + Prettier**

## Repository Structure
```
borome-mobile/
  app/ or src/
    screens/
    components/
    navigation/
    hooks/
    services/
      firebase.ts
      listings.ts
      bookings.ts
    state/
  assets/
  app.json / app.config.ts
  package.json
  README.md
```

## Environment Setup

1) **Install prerequisites**
- Node LTS (v18+), Yarn or npm  
- Expo CLI: `npm i -g expo`

2) **Create `.env`**
```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

3) **Install deps**
```bash
npm install
# or
yarn
```

## Run & Test

### Option A — Expo Go
```bash
npm start
# or
expo start
```
- Scan QR with **Expo Go** on iOS/Android.

### Option B — Emulator
- Android Studio → `expo start --android`
- macOS/iOS → `expo start --ios`

## First-Run Flow
1. **Sign-Up / Login**
2. **Create Listing**
3. **Booking**
4. **Refresh/Sync**

## Data Model (Firestore)
- `users/{uid}`
- `listings/{listingId}`
- `bookings/{bookingId}`
- `availability/{listingId}/blocks/{blockId}`

## User Testing (SUS)
Run through **listing creation**, **browse**, and **booking**; record time-to-task, errors, and SUS scores.

## 🗺️ Maps (optional)
Enable `expo-maps` with a Google Maps key if desired.

## Scripts
```bash
npm start
npm run lint
npx expo prebuild
```

## Troubleshooting
- Clear cache: `expo start -c`
- Check Firebase rules if Firestore fails.
- Verify ProjectID if no data appears.

## Build
```bash
npm install -g eas-cli
eas login
eas build -p android
```

## Licence
Internal academic prototype for the BoroMe Capstone.

---

## Zip command

### Windows PowerShell
```powershell
Compress-Archive -Path ".\borome-mobile\*" -DestinationPath ".\artefact\borome-mobile_2025-10-22.zip" -Force
```

### macOS/Linux
```bash
zip -r ./artefact/borome-mobile_2025-10-22.zip ./borome-mobile -x "*/node_modules/*" "*/.git/*" "*/.expo/*"
```

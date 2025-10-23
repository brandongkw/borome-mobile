# Mobile Listing & Booking Prototype (Expo + Firebase)

A cross-platform mobile prototype demonstrating a **full listing creation** and **booking** experience.  
Built with **Expo (React Native)** and **Firebase** (Auth, Firestore, Storage). Designed for rapid iteration, user testing, and MVP-style delivery.

## Overview
This project showcases my experience in **mobile app development**, focusing on:
- Turning user research and feedback into UI/UX improvements.
- Implementing real-time, data-driven features using Firebase.
- Applying usability testing methodologies such as **System Usability Scale (SUS)**.
- Structuring a full cross-platform mobile app lifecycle from design → implementation → evaluation.

## Features
- **Account Split:** Personal and Business onboarding with distinct sign-up flows.
- **Listing Creation:** Details → Category → Condition → Pricing → Delivery/Pickup → Availability → Summary → Publish.
- **Booking Flow:** Create and view bookings with live updates via Firestore.
- **Browse & My Bookings:** Real-time reads with pull-to-refresh and user-specific listings.
- **Maps-Ready Layout:** Scaffold for `expo-maps` integration.
- **SUS Testing Support:** Designed for user evaluation and feedback collection.

## Tech Stack
- **React Native (Expo)**
- **Firebase** (Auth, Firestore, Storage)
- **React Navigation / Expo Router**
- **State Management:** Context / Zustand
- **ESLint + Prettier**
- **(Optional)** TypeScript

## Folder Structure
```
src/
  screens/        # Feature screens
  components/     # Reusable UI components
  services/       # Firebase + data logic
  state/          # Global state management
  navigation/     # Navigation setup
docs/
  listing-flow.png
  booking.png
```

## Setup

### 1. Install dependencies
```bash
npm install -g expo
npm install
```

### 2. Environment configuration
Create `.env` (not committed) from the provided example:
```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### 3. Run the app
```bash
npm start
# or
expo start
```
Then scan the QR code with **Expo Go** or run:
- **Android:** `expo start --android`
- **iOS (macOS):** `expo start --ios`

## Usage Guide
1. **Sign Up / Login** — Choose account type (Personal or Business).
2. **Create a Listing** — Follow guided steps through all listing pages.
3. **Browse** — View published listings.
4. **Book** — Select available dates and confirm booking.
5. **My Bookings** — Manage created bookings, view status, and cancel if necessary.

## Data Model (Firestore)
- `users/{uid}` — account details & type
- `listings/{listingId}` — listing info & availability
- `bookings/{bookingId}` — booking data linked to listings

## What I Learned
- Building complete **mobile MVPs** with rapid iteration loops.
- Integrating Firebase for seamless data synchronization.
- Applying **usability testing** (SUS) and interpreting results to inform design.
- Balancing **performance, usability, and development speed** using Expo.

## Screenshots
Include images in `docs/`:
```
docs/listing-flow.png
docs/booking.png
```

## Testing & Evaluation
This prototype was evaluated using user testing with a **System Usability Scale** (SUS) approach. The tests focused on flow comprehension, navigation speed, and satisfaction metrics.

## Scripts
```bash
npm start       # start the Expo dev server
npm run lint    # run ESLint checks
npx expo prebuild  # prepare native builds if required
```

## Optional Maps Integration
Enable `expo-maps` and add your API key to integrate geolocation-based listing views.

## License
This project is released under the [MIT License](./LICENSE).

---

> This repository represents an educational and portfolio project built to demonstrate technical proficiency in mobile development, UI/UX design, and Firebase integration. Not intended for production use without security and scalability review.

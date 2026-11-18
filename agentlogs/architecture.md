# Architecture & Data Flow

## Overview
This project is a WhatsApp clone mobile application built using React Native and the Expo ecosystem. It uses Expo Router for file-based navigation, NativeWind (Tailwind CSS) for cross-platform styling, and TypeScript for static typing.

```
whatsapp-clone/
├── agentlogs/             # Living project documentation
│   ├── architecture.md
│   ├── changelog.md
│   └── files.md
├── src/
│   ├── app/               # Expo Router file-based screens and routes
│   │   ├── _layout.tsx    # Root layout & splash handler
│   │   ├── (auth)/        # Authentication routes group
│   │   └── (main)/        # Authenticated app routes group
│   ├── assets/            # Static assets (images, fonts)
│   │   ├── fonts/
│   │   └── images/        # App icons, splash, and welcome graphics
│   ├── components/        # Reusable UI components
│   │   ├── atoms/         # Primitive components (Button)
│   │   ├── molecules/     # Compound UI components (CountryPickerModal)
│   │   └── SplashScreen.tsx
│   ├── constants/         # Asset maps, country lists, and global constants
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Style utilities
│   ├── translations/      # Localization files
│   └── utils/             # Helper functions
├── app.json               # Expo project configuration
├── babel.config.js        # Babel preset and NativeWind config
├── metro.config.js        # Metro bundler with NativeWind
├── tailwind.config.js     # Tailwind theme and WhatsApp colors
└── tsconfig.json          # TypeScript config and path aliases
```

---

## Navigation and Routing

Navigation is handled by `expo-router` using filesystem-based route groups:

1. **Root (`src/app/_layout.tsx`)**:
   - Holds the primary `<Stack>` navigator with `headerShown: false` and `animation: 'none'` (delegating all gesture handling and animations to group navigators).
   - Declares screens `(auth)` and `(main)`.
   - On initial mount, keeps the app on the splash screen for 2500ms using local state `isAppReady`.
   - Once ready, conditionally redirects based on `isLogin`:
     - If `isLogin === true`: redirects to `/(main)`.
     - If `isLogin === false`: redirects to `/(auth)`.

2. **Auth Stack (`src/app/(auth)/_layout.tsx`)**:
   - Defines a `<Stack>` containing `index`, `terms_agree`, `login`, and `verify_otp` with `animation: 'slide_from_right'`, `animationDuration: 220`, `gestureEnabled: true`, `gestureDirection: 'horizontal'`, `animationMatchesGesture: true`, and `fullScreenGestureEnabled: true` configured across all screens and screenOptions.
   - Screen `index.tsx` directly exports the `TermsAgree` component, ensuring the Terms screen is the true root route (index 0) of the Auth stack without any runtime `<Redirect>` replacement.
   - Screen `terms_agree.tsx` presents the WhatsApp terms and welcome screen. Tapping "Agree and continue" calls `router.push('/(auth)/login')`.
   - Screen `login.tsx` is the phone number login screen with an interactive back button `←` calling `router.back()` (popping back to `TermsAgree` with authentic `slide_from_right` reverse slide transition). Selecting country opens `CountryPickerModal`. Submitting a valid number opens a confirmation dialog, which routes to `/(auth)/verify_otp` with `{ phone }` params.
   - Screen `verify_otp.tsx` is the OTP verification screen featuring 4-digit code entry with `@codsod/react-native-otp-input`, masked phone number display, resend countdown timer (56s), error badge handling (`Invalid password` on `7387`), verifying loader modal overlay, and navigation to `/(main)` upon successful verification.

3. **Main Stack (`src/app/(main)/_layout.tsx`)**:
   - Entry container for logged-in user experience (renders `<Slot />` for `(main)/index.tsx`).
   - Screen `(main)/index.tsx` is the home screen placeholder.

---

## Data Flow

### 1. App Startup & Splash
```
App Launch
  -> ExpoSplashScreen.preventAutoHideAsync() in src/app/_layout.tsx
  -> RootLayout mounts
  -> useEffect calls ExpoSplashScreen.hideAsync() to dismiss native OS splash
  -> RootLayout renders <SplashScreen /> (src/components/SplashScreen.tsx)
  -> 2500ms timer completes -> setIsAppReady(true)
  -> RootLayout renders Stack with <Redirect href="/(auth)" />
  -> Navigates directly to src/app/(auth)/index.tsx (TermsAgree screen at stack index 0)
```

### 2. Terms Agreement to Login
```
User on TermsAgree (src/app/(auth)/terms_agree.tsx)
  -> User taps "Agree and continue"
  -> handleAgreeAndContinue() fires
  -> router.push('/(auth)/login') is executed
  -> Login screen (src/app/(auth)/login.tsx) mounts
```

### 3. Phone Number Entry & Country Selection
```
User on Login (src/app/(auth)/login.tsx)
  -> Taps Country Dropdown:
     -> setIsPickerVisible(true) opens CountryPickerModal (src/components/molecules/CountryPickerModal.tsx)
     -> User searches / selects country from COUNTRIES (src/constants/countries.ts)
     -> handleCountrySelect(country) updates selectedCountry and callingCode
  -> Or edits Calling Code directly:
     -> handleCallingCodeChange() searches COUNTRIES matching dialCode and synchronizes selectedCountry
  -> User enters local phone number into TextInput
  -> User taps "NEXT" -> handleNext():
     -> Validates callingCode and phone number length
     -> Displays confirmation Alert dialog: "You entered the phone number: +XX XXXXX XXXXX..."
     -> User taps "OK"
     -> router.push({ pathname: '/(auth)/verify_otp', params: { phone } })
```

### 4. OTP Verification Flow
```
User on VerifyOtp (src/app/(auth)/verify_otp.tsx)
  -> Reads phone from route params; renders "Code has been send to <maskedPhone>"
  -> User inputs 4-digit code into OTPInput (@codsod/react-native-otp-input)
  -> 56s countdown ticks down for "Resend Code in X s"; becomes clickable "Resend Code" on expiry
  -> User taps "Verify":
     -> If code === "7387": shows error badge "Invalid password" below inputs
     -> If code !== "7387": shows dim overlay with ActivityIndicator, then router.replace('/(main)')
  -> User taps Back (←): calls router.back() with reverse slide animation to login
```

### 5. Legal Links External Navigation
```
User taps "Privacy Policy" or "Terms of Service" in src/app/(auth)/terms_agree.tsx
  -> openPrivacyPolicy() or openTerms() is called
  -> Linking.openURL('https://www.whatsapp.com/legal/...')
  -> Operating system opens the browser with the requested URL
```

---

## State Management

Current state is localized to components using React hooks (`useState`):

- **`RootLayout` (`src/app/_layout.tsx`)**:
  - `isAppReady` (boolean): Tracks whether the initial 2.5s splash animation has finished. Read by `RootLayout`; updated by a `setTimeout` callback.
  - `isLogin` (boolean): Hardcoded mock auth state (currently `false`). Read by `RootLayout` to choose between `/(main)` and `/(auth)`.
- **`Login` (`src/app/(auth)/login.tsx`)**:
  - `selectedCountry` (Country): Currently selected country object (`name`, `code`, `dialCode`, `flag`). Default is India (`+91`).
  - `callingCode` (string): Dial code digits entered or selected.
  - `phoneNumber` (string): Local subscriber phone number string.
  - `isPickerVisible` (boolean): Controls visibility of `CountryPickerModal`.
- **`CountryPickerModal` (`src/components/molecules/CountryPickerModal.tsx`)**:
  - `searchQuery` (string): Text filter applied against country names, codes, and dial codes.
- **System Theme**:
  - `useColorScheme()` from `react-native`: Read across screens and modals to dynamically adapt between light and dark modes.

---

## External Dependencies

- `expo` (`~58.0.26`): Expo managed workflow runtime core.
- `expo-router` (`~58.0.32`): File-based routing for React Native.
- `expo-splash-screen` (`~58.0.14`): Native splash screen display and auto-hide control.
- `expo-status-bar` (`~58.0.5`): Adaptive status bar styling.
- `expo-linking` (`~58.0.17`): Deep linking and outbound web URL handling.
- `@codsod/react-native-otp-input` (`^1.0.7`): 4-digit numeric OTP input component with auto-focus and backspace support.
- `prop-types` (`^15.8.1`): Runtime prop type checking library required by `@codsod/react-native-otp-input`.
- `react-native` (`0.88.1`) & `react` (`19.3.0`): Core mobile framework and React runtime.
- `nativewind` (`^4.2.7`) & `tailwindcss` (`^3.4.19`): Tailwind utility class compilation for React Native components.
- `react-native-safe-area-context` (`~5.11.1`): Screen boundary insets handling for devices with notches and gesture bars.
- `react-native-screens` (`~4.30.1`) & `react-native-reanimated` (`4.7.1`): Native screen container management and animation support.

---

## Config and Assets

- **TypeScript Config (`tsconfig.json`)**: Configured with path aliases:
  - `@/*` -> `./src/*`
  - `@/assets/*` -> `./src/assets/*`
- **Tailwind Config (`tailwind.config.js`)**: Defines brand palette colors:
  - `whatsapp.green` (`#008069`)
  - `whatsapp.lightGreen` (`#00A884`)
  - `whatsapp.teal` (`#128C7E`)
  - `whatsapp.darkTeal` (`#075E54`)
  - `whatsapp.blue` (`#34B7F1`)
  - `whatsapp.light` (`#25D366`)
  - `whatsapp.darkBackground` (`#0B141A`)
  - `whatsapp.darkHeader` (`#1F2C34`)
- **Assets (`src/constants/imagePath.ts`)**:
  - Centralizes requires for `splash-icon.png`, `welcome.png`, and `welcome_dark.png` located in `src/assets/images/`.
- **Countries Dataset (`src/constants/countries.ts`)**:
  - Provides country metadata list (`Country` interface) with dial codes, ISO codes, and flags.

---

## Main Flow Diagram

```mermaid
flowchart TD
    A[App Launch] --> B[src/app/_layout.tsx]
    B --> C{isAppReady ?}
    C -- No --> D[src/components/SplashScreen.tsx]
    D --> E[Wait 2500ms]
    E --> B
    C -- Yes --> F{isLogin ?}
    F -- Yes --> G[src/app/(main)/index.tsx]
    F -- No --> H[src/app/(auth)/index.tsx]
    H --> I[src/app/(auth)/terms_agree.tsx]
    I -->|Tap Agree and continue| J[src/app/(auth)/login.tsx]
    I -->|Tap Privacy/Terms link| K[External Browser]
    J -->|Tap Country Dropdown| M[src/components/molecules/CountryPickerModal.tsx]
    M -->|Select Country| J
    J -->|Tap NEXT & Confirm OK| L[src/app/(auth)/verify_otp.tsx]
```

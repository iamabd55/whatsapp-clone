# Changelog

## 2026-11-19 00:05: resolve prop-types peer dependency for @codsod/react-native-otp-input
- What changed: Installed `prop-types` package (`^15.8.1`) required by `@codsod/react-native-otp-input/src/index.jsx`.
- Why: User encountered Metro bundler error `Unable to resolve "prop-types" from "node_modules/@codsod/react-native-otp-input/src/index.jsx"` because the library imports `prop-types` without declaring it in its package dependencies.
- Impact: Resolves Metro bundling failure on Android and other platforms, allowing the OTP verification screen to bundle and render cleanly.
- Known issues / TODO: None.

## 2026-11-18 23:54: implement OTP verification screen with @codsod/react-native-otp-input
- What changed: Installed `@codsod/react-native-otp-input`; completely implemented `src/app/(auth)/verify_otp.tsx` according to UI reference design including header back navigation, masked phone notification, 4-digit rounded OTP input boxes, 56-second resend countdown timer with clickable resend trigger, error badge display (`Invalid password` on demo code `7387`), full-screen verifying spinner overlay, and navigation to `/(main)` on success. Updated `src/app/(main)/_layout.tsx` to render `<Slot />`.
- Why: User requested implementing the OTP verification UI and functionality using `@codsod/react-native-otp-input` matching the provided UI flow without backend/DB work.
- Impact: Completes the full authentication onboarding flow from Splash -> Terms -> Login -> OTP Verification -> Main Home Screen.
- Known issues / TODO: Real SMS delivery and database authentication backend will be integrated later.

## 2026-11-18 23:29: fix reverse slide animation from login to terms page
- What changed: In `src/app/(auth)/index.tsx`, replaced `<Redirect href="/(auth)/terms_agree" />` with direct export of `TermsAgree` so the Terms screen is the authentic root route (index 0) of the Auth stack. In `src/app/_layout.tsx`, set `animation: 'none'` on the root stack (preventing outer-stack native controller conflicts) and set root redirect to `/(auth)`. In `src/app/(auth)/login.tsx`, ensured the back arrow `←` is always present and calls `router.back()` to trigger native pop reverse transition.
- Why: User reported that the reverse animation from login page back to terms page was still not animating properly due to runtime redirect screen replacement destroying the native stack history.
- Impact: Restores genuine push/pop stack hierarchy so popping back from Login to Terms runs the exact native horizontal reverse slide (`slide_from_right`) without instant snapping.
- Known issues / TODO: SMS auto-detect input logic in `src/app/(auth)/verify_otp.tsx` is pending full implementation.

## 2026-11-18 23:22: synchronize reverse slide transition and back navigation
- What changed: In `src/app/(auth)/_layout.tsx`, configured `animation: 'slide_from_right'` explicitly on every screen (`index`, `terms_agree`, `login`, `verify_otp`), added `unstable_settings` with `initialRouteName: 'terms_agree'`, enabled `animationMatchesGesture: true` and `fullScreenGestureEnabled: true`. In `src/app/_layout.tsx`, updated redirect to `/(auth)/terms_agree` and added gesture matching. In `src/app/(auth)/login.tsx` and `src/app/(auth)/verify_otp.tsx`, added interactive back buttons (`←`) when `router.canGoBack()` is true to trigger consistent `slide_from_right` pop transitions.
- Why: User requested that navigating back to previous screens uses the same slide animation as the forward navigation.
- Impact: Solves the issue where popping screens lost the slide transition or snapped instantly due to `index`'s prior `animation: 'none'` option; pop and push transitions now mirror each other smoothly across the flow.
- Known issues / TODO: SMS auto-detect input logic in `src/app/(auth)/verify_otp.tsx` is pending full implementation.

## 2026-11-18 23:10: configure snappy WhatsApp slide page transitions
- What changed: Configured `animation: 'slide_from_right'`, `animationDuration: 220`, and `gestureEnabled: true` in `src/app/(auth)/_layout.tsx` and `src/app/_layout.tsx`, with `animation: 'none'` on the initial index redirect.
- Why: User requested authentic WhatsApp-like smooth, snappy screen transition animations.
- Impact: Screen navigations (such as Terms Agree -> Login -> Verify OTP) now slide smoothly and rapidly horizontally with gesture swipe support.
- Known issues / TODO: None.

## 2026-11-18 23:05: implement phone login screen and country picker modal
- What changed: Created `src/constants/countries.ts` and `src/components/molecules/CountryPickerModal.tsx`; implemented full phone login UI with synchronized country code/picker inputs, WhatsApp green underlines, confirmation dialog, and OTP route transitions in `src/app/(auth)/login.tsx`.
- Why: User requested implementing the WhatsApp phone login screen based on UI reference design with full country selection support.
- Impact: Unblocks the primary phone authentication step in the onboarding flow; forwards valid formatted numbers to `/(auth)/verify_otp`.
- Known issues / TODO: `src/app/(auth)/verify_otp.tsx` is still a placeholder screen awaiting SMS OTP input implementation.

## 2026-11-18 23:01: initialize living documentation in agentlogs
- What changed: Generated `agentlogs/architecture.md`, `agentlogs/files.md`, and `agentlogs/changelog.md` documenting current Expo Router setup, splash screen, authentication routes, styling, file index, and project architecture.
- Why: Fulfill mandatory documentation requirements specified in `AGENTS.md` and user request to initialize agent logs.
- Impact: Establishes a reliable baseline for system architecture and codebase tracking. No app runtime code was modified.
- Known issues / TODO: `src/app/(auth)/login.tsx`, `src/app/(auth)/verify_otp.tsx`, and `src/app/(main)/_layout.tsx` remain placeholder implementations requiring full feature development.

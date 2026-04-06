# Scroli — Remaining MVP Features

**Status:** Core loop is working end-to-end (auth → onboarding → screen time tracking → stats → impact flow).
**Goal:** Ship the remaining features needed for a real, payable, usable product.

---

## How to Use This Plan

- Each feature is **self-contained** — one person owns it soup to nuts
- Features are ordered by priority (top = most blocking)
- If two features are in the same section, they can be worked in **parallel**
- Avoid touching each other's files until a feature is merged

---

## Feature 1 — Stripe Payments (Backend)
**Owner: Co-Founder** | Files: `supabase/functions/`, `src/services/PaymentService.ts`

The financial core of the app. Without this, no money moves.

### Tasks
- [ ] Create Supabase Edge Function `create-payment-intent`
  - Accepts `{ userId, amountCents }`, creates Stripe PaymentIntent, returns `clientSecret`
  - Uses Stripe secret key (stored as Supabase secret, never in client)
- [ ] Create Supabase Edge Function `save-payment-method`
  - Stores Stripe `customerId` and `paymentMethodId` on the profile
- [ ] Update `profiles` table: add `stripe_customer_id text`, `payment_method_id text`
  - Run in SQL Editor: `ALTER TABLE profiles ADD COLUMN stripe_customer_id text, ADD COLUMN payment_method_id text;`
- [ ] Replace stubbed `PaymentService.ts` with real Stripe calls via Edge Functions
- [ ] Wire `TrackingService.evaluateDayResult` → on `'failure'` → call `PaymentService.confirmCharge`

### Notes
- Use `@stripe/stripe-react-native` for the card UI (re-add when ready)
- Edge Function docs: https://supabase.com/docs/guides/functions
- Stripe test mode keys only until app store submission

---

## Feature 2 — Payment Setup Screen (Frontend)
**Owner: Justin** | Files: `src/screens/onboarding/PaymentStep.tsx`, `src/navigation/`

Users need to add a card before their stake means anything.

### Tasks
- [ ] Create `src/screens/onboarding/PaymentStep.tsx`
  - Stripe `CardField` component for card entry
  - "Your card is never charged unless you miss your goal" copy
  - Calls `PaymentService.createPaymentMethod()` on submit
- [ ] Add `PaymentStep` as Step 4 in `OnboardingScreen.tsx` (after StakeStep)
- [ ] Add `PaymentMethod` item in Settings → navigates to a re-add card screen
- [ ] Show a "No payment method" warning banner on Dashboard if card not set up

### Notes
- Requires Feature 1 (Edge Functions) to be merged first before testing end-to-end
- Card UI: use `@stripe/stripe-react-native`'s `CardField` — it handles all validation

---

## Feature 3 — Charity Selection (Frontend)
**Owner: Justin** | Files: `src/screens/onboarding/CharityStep.tsx`, `src/screens/settings/CharityScreen.tsx`

Users should choose where their money goes. It's a core emotional hook.

### Tasks
- [x] Create `src/screens/onboarding/CharityStep.tsx`
- [x] `onboardingStore` updated with `charityId` / `setCharityId`
- [x] Create `src/screens/settings/CharityScreen.tsx`
- [x] `navigation/types.ts` updated with `CharitySettings` route
- [x] Add `CharityStep` as Step 4 in `OnboardingScreen.tsx` (after StakeStep; move after PaymentStep once Feature 2 lands)
- [x] Save `charity_id` to user's profile on onboarding completion
- [x] Wire Settings → "Charity" → `CharitySettings`
- [x] Register `CharitySettings` in `RootNavigator.tsx`
- [ ] SQL: `ALTER TABLE profiles ADD COLUMN default_charity_id uuid references charities(id);`
- [ ] Wire `TrackingService.logTransaction` to use user's `default_charity_id`

### SQL to run first
```sql
ALTER TABLE profiles ADD COLUMN default_charity_id uuid references charities(id);
```

---

## Feature 4 — Functional Settings (Frontend)
**Owner: Justin** | Files: `src/screens/settings/` (new sub-screens)

The settings screen exists but every item is a dead end.

### Tasks
- [x] `GoalScreen.tsx` — +/- picker, saves via `TrackingService.saveGoal`
- [x] `StakeScreen.tsx` — same stake picker as onboarding, updates `onboardingStore`
- [x] `MascotScreen.tsx` — grid of 4 mascots, calls `useUiStore.setCurrentMascot`
- [x] `navigation/types.ts` updated with `GoalSettings`, `StakeSettings`, `MascotSettings` routes
- [x] Wire all into `SettingsScreen.tsx` with `navigation.navigate()`
- [x] Register all 3 in `RootNavigator.tsx`
- [ ] SQL: `ALTER TABLE profiles ADD COLUMN mascot_type text DEFAULT 'original';`
  (until then, mascot choice resets on app reload)

### SQL to run
```sql
ALTER TABLE profiles ADD COLUMN mascot_type text DEFAULT 'original';
```

---

## Feature 5 — Push Notifications (Backend + Config)
**Owner: Co-Founder** | Files: `src/services/NotificationService.ts`, `app.json`

Daily reminders and end-of-day alerts keep users engaged.

### Tasks
- [ ] Install: `npx expo install expo-notifications`
- [ ] Create `src/services/NotificationService.ts`
  - `requestPermission()` — ask user for notification permission
  - `scheduleDailyReminder(hour, minute)` — "Don't forget your screen time goal today"
  - `scheduleEndOfDay()` — 9pm nightly: "Time to check in. How did today go?"
  - `cancelAll()` — for when user disables notifications
- [ ] Add notification permission request to onboarding (after CharityStep)
- [ ] Wire Settings → "Notifications" toggle → `NotificationService.cancelAll()` / reschedule
- [ ] Add `notifications_enabled boolean` to profiles table

### SQL to run
```sql
ALTER TABLE profiles ADD COLUMN notifications_enabled boolean DEFAULT true;
```

---

## Feature 6 — Dashboard Real Streak + Calendar (Frontend)
**Owner: Justin** | Files: `src/screens/dashboard/DashboardScreen.tsx`, `src/components/WeekCalendar.tsx`

The streak counter and week calendar still show hardcoded mock data.

### Tasks
- [x] Fetch last 14 `daily_records` for current user on Dashboard mount
- [x] Replace `MOCK.weekHistory` with real `['check', 'miss', 'future']` array built from records
- [x] Replace `MOCK.currentStreak` with real streak count
- [x] Add `refetch` on app foreground via `AppState` listener

---

## Feature 7 — End-of-Day Evaluation Trigger (Backend)
**Owner: Co-Founder** | Files: `supabase/functions/evaluate-day/`

Right now `evaluateDayResult` only runs when the user opens the Impact Flow. It should run automatically at midnight.

### Tasks
- [ ] Create Supabase Edge Function `evaluate-day`
  - Loops all users with a `pending` record for yesterday
  - Calls same logic as `TrackingService.evaluateDayResult`
  - Charges failures, logs transactions, sends push notification
- [ ] Schedule it via Supabase cron (pg_cron): runs daily at 00:05
  ```sql
  select cron.schedule('evaluate-daily', '5 0 * * *', 'select net.http_post(...)');
  ```
- [ ] Test manually by calling the function from Supabase dashboard

---

## Non-Blocking Polish (Do Last)
**Either person, after features above are merged**

| Item | File | Notes |
|------|------|-------|
| Help/About screen | `src/screens/settings/AboutScreen.tsx` | Static text, 30 min |
| Sign In/Up use Poppins font | `SignInScreen.tsx`, `SignUpScreen.tsx` | Add `fontFamily` to styles |
| Top Offenders real data | `TopOffendersCard.tsx` | Needs ScreenTime per-app API, skip for MVP |
| Onboarding uses Poppins | All step files | Add `fontFamily` to Text styles |
| Error boundaries | `App.tsx` | Wrap navigators in ErrorBoundary |
| Loading skeletons | Dashboard, Stats | Replace `LoadingView` spinner with skeleton UI |

---

## Merge Strategy

```
main
├── feature/stripe-backend        (Co-Founder — Feature 1)
├── feature/payment-screen        (Justin — Feature 2, depends on Feature 1)
├── feature/charity-selection     (Justin — Feature 3, parallel)
├── feature/settings-screens      (Justin — Feature 4, parallel)
├── feature/notifications         (Co-Founder — Feature 5, parallel)
├── feature/dashboard-real-data   (Justin — Feature 6, parallel)
└── feature/evaluate-day-cron     (Co-Founder — Feature 7, parallel)
```

**Rule:** Each feature branch only touches its own screen files + one service file. No two branches touch the same file except `navigation/types.ts` and `RootNavigator.tsx` — coordinate those additions before branching.

---

## Current State Summary

| Layer | Status |
|-------|--------|
| Auth (sign in/up/out) | ✅ Done |
| Onboarding (3 steps) | ✅ Done |
| Dashboard UI + screen time | ✅ Done |
| Stats + Profile (real data) | ✅ Done |
| Impact Flow (real data) | ✅ Done |
| TrackingService | ✅ Done |
| Supabase schema (6 tables) | ✅ Done |
| Branding (coral, Poppins, wave logo) | ✅ Done |
| Stripe backend | ❌ Feature 1 |
| Payment setup screen | ❌ Feature 2 |
| Charity selection | ✅ Feature 3 (SQL migration pending) |
| Functional settings | ✅ Feature 4 (SQL migration pending) |
| Push notifications | ❌ Feature 5 |
| Dashboard real streak/calendar | ✅ Feature 6 |
| End-of-day cron | ❌ Feature 7 |

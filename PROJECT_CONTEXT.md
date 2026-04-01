Scroly - Project Context for Development
What is Scroly?
A mobile app helping college students reduce screen time through financial stakes. When users miss their daily goal, money goes to charity. When they succeed, they build streaks and keep their money.

Core Philosophy: Skin in the game. Fail-forward. Impact transparency.

Tech Stack
Frontend:

React Native 0.73+ with Expo (TypeScript)
Navigation: React Navigation (Bottom Tabs + Stack)
State: Zustand (global) + React Query (server)
Animations: react-native-reanimated
UI: Custom components (no UI library)
Backend:

Supabase (PostgreSQL + Edge Functions + Auth + Storage)
Real-time subscriptions for balance updates
External Services:

Stripe (payments via React Native SDK)
Expo Notifications (push notifications)
Charityvest/Daffy (charity donations via DAF)
Native Modules:

iOS: ScreenTime API (DeviceActivity framework via Swift bridge)
Android: UsageStatsManager (later)
Design System (Brainrot-Inspired)
Colors:

typescript
background: '#F5F1E8'  // Warm beige
primary: '#7C3AED'     // Purple
primaryLight: '#DDD6FE'
success: '#10B981'     // Green
warning: '#F59E0B'     // Orange
error: '#EF4444'       // Red
textPrimary: '#1F2937'
textSecondary: '#6B7280'
Typography:

Display numbers: 48-72pt bold, rounded
Headings: 22-28pt bold
Body: 15-17pt regular
Fonts: System default (SF Pro on iOS, Roboto on Android)
Spacing: 8pt grid (8, 16, 24, 32, 48)

Components:

Corner radius: 16-20pt (very rounded)
Card shadows: Subtle (0, 2, 8, rgba(0,0,0,0.04))
Button height: 56pt
Cards: White background, 20pt padding
MVP Scope (Week 1)
MUST HAVE:
✅ Onboarding (6 screens): Welcome → Goal → Wallet → Charity → Payment → Complete
✅ Dashboard: Mascot, progress, balance, stake, streak, week calendar
✅ Goal system: Daily total only (e.g., "Under 3 hours/day")
✅ Wallet: Prepaid deposits ($20-100), Apple Pay, show balance
✅ Screen time tracking: iOS ScreenTime API via native module
✅ Charity donations: When goal missed, deduct from wallet
✅ Impact flow: 3 screens showing donation impact
✅ Streaks: Count, display, reset on failure
✅ Notifications: Morning reminder, 75%/90% warnings
✅ Profile: Balance, settings, basic info
✅ Auth: Sign up, sign in, session management
SKIP FOR NOW:
❌ App-specific limits (just daily total)
❌ No-phone windows
❌ Full stats screen (show basics on Profile)
❌ Badges system
❌ Weekly summaries
❌ Streak freezes
❌ Grace passes
❌ Android build
❌ Automatic midnight resolution (manual for beta)
Database Schema (Supabase)
Key Tables:

sql
profiles: id, email, current_streak, longest_streak, total_donated, total_saved

goals: id, user_id, type, target_value (minutes), stake_amount, charity_id, is_active

wallet_balances: user_id, balance, updated_at

daily_records: id, user_id, date, screen_time_minutes, goal_met, donation_amount

transactions: id, user_id, type (deposit/donation/refund), amount, charity_id

charities: id, name, slug, impact_unit, impact_multiplier, logo_url
All tables have Row Level Security (RLS) enabled.

Key User Flows
Onboarding:
Welcome → How It Works → Goal Selection (3 options) → 
Stake Slider ($2-10) → Charity Selection (5 options) → 
Add Money ($20/$30/$50) → Payment (Apple Pay) → You're Set!
Daily Loop:
9am: Morning reminder notification
Throughout day: Track usage, show progress
75% usage: Warning notification
90% usage: Urgent warning
Midnight: Check goal
  → Success: Increment streak, show celebration
  → Failure: Deduct $, show impact flow (3 screens), reset streak
Impact Flow (When Failed):
Screen 1: Reality (goal vs actual, $ deducted)
Screen 2: Impact (charity icon, "You protected 2 children...")
Screen 3: Reset ("Tomorrow is new day", show longest streak)
Coding Conventions
File Structure:

src/
├── screens/           # Full-screen views
├── components/        # Reusable UI (Button, Card, etc.)
├── services/          # API clients (Supabase, Stripe, ScreenTime)
├── hooks/             # Custom hooks (useAuth, useGoal, useWallet)
├── theme/             # Colors, typography, spacing
├── types/             # TypeScript interfaces
├── navigation/        # Navigation setup
└── utils/             # Helpers, formatters
Naming:

Components: PascalCase (Button.tsx, DashboardScreen.tsx)
Hooks: camelCase with 'use' prefix (useAuth.ts)
Services: camelCase (supabaseClient.ts)
Constants: SCREAMING_SNAKE_CASE
All exports: named exports (no default exports)
TypeScript:

Strict mode enabled
Explicit types for all props
No any types
Interface for data models
Git Commits:

Convention: feat: add dashboard screen or fix: stripe payment flow
Commit frequently (every feature completion)
Key Product Decisions
Charity Focus:

We take 0% of donated money (build trust)
Platform fee: 5% on wallet deposits only
Show exact impact: "$5 = 2 children protected"
Transparency is critical to brand
Fail-Forward Design:

Never eject users for repeated failures
Prompt to adjust after 3 failures
Impact visualization makes failure meaningful
Always a path back to success
Target User:

College students (18-24)
iPhone users (iOS first)
Limited budget ($50-200/mo)
Values-driven (social causes matter)
Casual tone (friend, not parent)
Copy Tone:

Supportive, never preachy
"You've got this" not "You failed"
Honest but kind
Minimal emojis (not try-hard)
API Endpoints & Services
Supabase Edge Functions:

POST /functions/v1/create-payment-intent
  → Returns Stripe clientSecret for deposits

POST /functions/v1/process-donation
  → Deducts from wallet, donates to charity via DAF

POST /functions/v1/midnight-resolution
  → Checks all users, processes results (cron: 5 0 * * *)
Native Modules:

ScreenTimeModule.requestPermission() → Promise<boolean>
ScreenTimeModule.getScreenTime(date: string) → Promise<number>
Common Patterns
Data Fetching:

typescript
// Always use React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['goal', userId],
  queryFn: () => supabase.from('goals').select().eq('user_id', userId)
});
Error Handling:

typescript
try {
  await doSomething();
} catch (error) {
  console.error('[Context]:', error);
  Alert.alert('Error', 'User-friendly message');
}
Loading States:

typescript
if (isLoading) return <LoadingView />;
if (error) return <ErrorView error={error} onRetry={refetch} />;
return <Content data={data} />;
Testing Strategy (Week 1)
Manual Testing Priority:

Onboarding flow (can user complete it?)
Dashboard shows real screen time
Payment works (Apple Pay test mode)
Impact flow appears after failure
Notifications deliver
App doesn't crash
Skip for MVP:

Unit tests (add week 2)
E2E tests (add week 2)
Performance optimization
Deployment Checklist
Day 7:

 Configure app.json (name, bundle ID, version)
 Add app icon (1024×1024)
 Add splash screen
 Set up EAS Build
 Build for iOS: eas build --platform ios
 Upload to TestFlight
 Invite beta testers
 Send onboarding instructions
When to Ask for Help
Good questions for Claude Code:

"How do I implement [specific feature]?"
"Debug this error: [error message + code]"
"What's the React Native equivalent of [web concept]?"
"Review this code for performance issues"
Bad questions:

"Build the entire app" (too vague)
"Make it better" (not specific)
"Fix it" (no context)
Always provide:

What you're trying to achieve
What's not working (errors, unexpected behavior)
Relevant code
What you've already tried
Critical Paths to Success
Day 3 must-complete:

ScreenTime native module working (even if basic)
If blocked: Switch to manual input, move on
Day 4 must-complete:

Stripe payment works (even if test mode only)
If blocked: Use fake wallet, move on
Day 5 must-complete:

Impact flow looks beautiful
If blocked: Simplify to 1 screen, move on
Philosophy: Ship something that works > ship something perfect

Remember
This PRD is your north star for WHAT to build
Claude Code helps you figure out HOW to build it
When in doubt: ship the simpler version
Week 1 goal: Working product in users' hands
Week 2 goal: Make it better based on feedback
# Smart Loan Tracker Backend – Phased Action Plan
(Updated for Firebase)

## Architecture Principles (Scalability First)
- Embrace domain-driven modular boundaries (auth, loans, messaging, analytics) with dependency-inverted service layers.
- Design for horizontal scale: stateless HTTP layer.
- Use Firebase features (Firestore, Auth, Cloud Messaging) for core services.
- Observability-first mindset.

## Phase 0 – Project Foundation & Tooling (✅ Done)
- [x] Verify Bun + Elysia bootstrap.
- [x] Establish shared config (env schema, logger, AppError).
- [x] Add core middleware scaffold (CORS, JSON parsing, error handler).
- [x] Initialize Firebase Admin SDK.

### Recommended Feature Folder Structure
```
src/
  modules/
    auth/
      router.ts       // registers Elysia routes
      service.ts      // Firebase Auth verification
    user/
      router.ts
      controller.ts
      service.ts
      repository.ts   // Firestore access
      model.ts
    ...
  core/
    db/
      firebase.ts     // Firebase Admin Init
```

## Phase 1 – Auth Integration & User Profiles (✅ Done)
- [x] Integrate Firebase Auth (Verify ID Token middleware).
- [x] Create `users` collection in Firestore.
- [x] Build signup callback + profile CRUD + device token endpoints.
- [x] Track `lastLogin`, `profilePicture`, `deviceTokens` updates.

## Phase 2 – Loan Management Core (✅ Done)
- [x] Define `loans` and `payments` collections in Firestore.
- [x] Implement CRUD routes for loans.
- [x] Build payments endpoints + balance updates.
- [x] Add filters for role/status.

## Phase 3 – Messaging + Notifications (✅ Done)
- [x] Model `messages` + `notifications` in Firestore.
- [x] Implement chat endpoints.
- [x] Build notification service + Firebase Cloud Messaging (FCM) integration.

## Phase 4 – Analytics & Reporting
- Implement analytics services + endpoints.
- Use Firestore aggregations or scheduled functions for heavy lifting.

## Phase 5 – Realtime + Automation
- Use Firestore real-time listeners or WebSockets for updates.
- Schedule cron jobs for due dates.

## Phase 6 – Observability, QA, & Docs
- Add logging hooks.
- Expand Swagger docs.
- Implement integration tests.

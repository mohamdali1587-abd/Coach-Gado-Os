# Coach Gado Fitness Hub — Engineering Audit
Date: 10 November 2026

## Changes delivered in this pass
- Added a coach-facing Automation tab with master enable, WhatsApp auto-reply enable, and editable Arabic replies for greeting, pricing, training, nutrition, and human handoff.
- Deployed `whatsapp-cloud` Edge Function v4. It verifies Meta webhook signatures, normalizes Egyptian phone numbers, requires explicit WhatsApp opt-in and an active coach-client relationship, deduplicates inbound Meta message IDs, routes inbound messages into the in-app conversation, and sends configurable keyword-based replies.
- Added Arabic numeric menu routing (1 training, 2 nutrition, 3 pricing, 4 human handoff).
- Set the Graph API default to v26.0 (current as of 10 Nov 2026); keep the version configurable through `WHATSAPP_API_VERSION`.
- Added idempotent payment-proof review via `review_payment_proof` and a unique `payments.source_payment_proof_id`, preventing duplicate ledger entries on repeated approval attempts.
- Added RLS-protected `coach_automation_settings`; RLS enabled for all new sensitive tables.
- Updated README and WhatsApp setup guide.

## Verification performed
- Fetched the latest `index.html` from GitHub after commits and parsed its complete inline JavaScript with the JavaScript parser: OK.
- Confirmed Supabase Edge Function `whatsapp-cloud` is ACTIVE at version 4.
- Confirmed RLS is enabled on `payment_proofs`, `whatsapp_contacts`, `conversations`, `messages`, `notifications`, and `client_subscriptions`.
- Confirmed private storage buckets for chat files and payment proofs in the prior implementation pass.
- Confirmed database migration for payment-proof idempotency and automation settings succeeded.

## Remaining before production sign-off
1. Meta Business onboarding, production phone registration, permanent system-user token, app secret, verify token, and webhook subscription are still owner-provided setup items. No real Meta message can be sent until secrets are configured.
2. Browser end-to-end tests using a real Coach account and a separate Client account have not been run in this environment. Required scenarios: login, role isolation, chat send/receive, file upload/download, payment proof upload, approve/reject, notification read, webhook verification, opt-in and auto-reply.
3. Vercel deployment history could not be verified because the connected Vercel API returned HTTP 403. GitHub source is committed; the live URL is not certified as serving the latest commit.
4. Scheduled reminders for missing check-ins, incomplete onboarding and subscription expiry are not yet activated. They require a scheduled runner (Supabase Cron or an n8n instance) plus server-side secrets. The current Automation tab controls inbound WhatsApp auto-replies, not a full visual scheduler.
5. Existing Supabase Advisor warnings remain: the two invite-redemption SECURITY DEFINER RPCs and disabled leaked-password protection. The invite RPCs were not modified because their privileged behavior may be intentional; review their internals and enable leaked-password protection in Auth settings.
6. Offline queue remains limited to previously cached workout flows; chat, payment upload and WhatsApp require connectivity.

## Recommended next production phase
- Complete Meta credentials and test-number verification.
- Verify Vercel deployment and run authenticated coach/client E2E tests.
- Add scheduled reminder runner with deduplication and timezone-aware quiet hours.
- Add WhatsApp delivery/read status callbacks, media download/preview, and audit logs for automation actions.
- Add backups/restore drill, monitoring/error alerting, rate limits, and admin audit trail.

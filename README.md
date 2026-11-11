# Coach Gado Fitness Hub

Arabic RTL online fitness coaching workspace for Coach Gado.

## Stack
- Static responsive PWA frontend hosted on Vercel
- Chart.js 4.6.1 for interactive progress charts (vendored locally for offline use)
- Lucide 1.72.0 SVG icons for navigation (selected SVG assets only)
- Supabase Auth, Postgres, Storage and Realtime
- Row Level Security for coach/client data isolation
- Supabase Edge Functions for official WhatsApp Cloud API integration
- Supabase project: `glvkkbqtgwfezurkbmek`

## Main modules
- Coach/client accounts, invitations and assignments
- Workout and nutrition program builder
- Exercise and food libraries
- Workout logging, set tracking and progression
- Measurements, check-ins, progress charts and printable reports
- Subscriptions, payments and private payment-proof uploads
- Coach/client messaging with private file attachments
- In-app notifications for messages, workouts, check-ins and payment review
- WhatsApp direct links and official Cloud API integration
- Configurable Arabic WhatsApp auto-replies (keyword-based, coach-controlled)
- Daily in-app reminders for missing check-ins and subscriptions expiring within 3 days, scheduled through Supabase Cron and deduplicated

## Automation
The coach can enable/disable auto-replies and reminders, and edit the greeting, pricing, training, nutrition and human-handoff messages from the **الأتمتة** tab. Daily in-app reminders run at 07:00 UTC (09:00 Cairo standard time; local clock shifts during daylight-saving time) for missing daily check-ins and subscriptions ending within 3 days. Reminders are idempotent and only run when the coach enables both automation and reminders. Incoming WhatsApp messages are accepted only after Meta webhook signature verification, matched to an opted-in client with an active coach relationship, and deduplicated by Meta message ID. The auto-reply engine uses deterministic keyword routing; it does not make up prices, medical advice, or training prescriptions.

For more complex visual workflows (scheduled reminders, CRM routing, lead qualification and multi-step integrations), n8n can be connected as an optional automation orchestrator. A separate n8n server and credentials are required; n8n is not bundled into this static Vercel app. Use official Meta WhatsApp Cloud API nodes/HTTP requests only. Do not use unofficial QR-session gateways for a production business number.

## WhatsApp Cloud API setup
See [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md). Required server-side Supabase Edge Function secrets:
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_API_VERSION`

Never place the Meta access token or Supabase service-role key in frontend code or GitHub.

## Security
- The browser uses only the Supabase publishable key.
- Private Storage buckets are used for chat attachments and payment receipts.
- RLS policies protect coach/client relationships and private records.
- Payment-proof approval uses an idempotent database function so repeated clicks cannot create duplicate payment rows.
- WhatsApp sending requires an authenticated coach, an active coach-client relationship, explicit client opt-in and compliance with Meta's 24-hour customer-service window/template requirements.
- Do not disable or bypass RLS to troubleshoot client data.

## Offline and testing
- The app shell and workout drafts/offline session queue have offline support where previously cached data is available.
- Messaging, payment uploads, WhatsApp and server-side automation require an internet connection.
- JavaScript syntax was checked after the current changes. A full browser-based end-to-end test with real coach/client accounts and live Meta credentials is still required before production sign-off.

## Deployment
- Vercel project: `coach-gado-fitness-hub-app`
- Deploy from `main` after CI/build verification.
- Live app: https://coach-gado-fitness-hub-app.vercel.app

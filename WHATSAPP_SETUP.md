# Coach Gado Fitness Hub — WhatsApp Cloud API setup

The app now includes:
- A direct WhatsApp link (wa.me) when a participant has a phone number.
- A server-side Supabase Edge Function named `whatsapp-cloud` for Meta WhatsApp Cloud API.
- A client opt-in record in `public.whatsapp_contacts`.
- Incoming Meta text messages are routed into the existing coach-client conversation when the client opted in and has an active coach link.
- Outbound free-form text is allowed only inside the 24-hour customer-service window. Outside it, the function requires a Meta-approved template.

## Configure secrets in Supabase

Open Supabase Dashboard → Project Settings → Edge Functions → Secrets (or the Edge Functions secrets screen) and add:

- `WHATSAPP_VERIFY_TOKEN`: a long random string you create and keep private.
- `WHATSAPP_APP_SECRET`: App Secret from Meta for Developers.
- `WHATSAPP_PHONE_NUMBER_ID`: the Phone Number ID shown in WhatsApp API Setup.
- `WHATSAPP_ACCESS_TOKEN`: a production System User access token with `whatsapp_business_messaging` permission.
- `WHATSAPP_API_VERSION`: a currently supported Graph API version, e.g. `v23.0` only while Meta still supports it.

Do not put these values in `index.html`, GitHub, client-side settings, or screenshots.

## Meta webhook

Use this callback URL:

`https://glvkkbqtgwfezurkbmek.supabase.co/functions/v1/whatsapp-cloud`

Set the Verify Token to the exact `WHATSAPP_VERIFY_TOKEN` secret and subscribe to the WhatsApp `messages` webhook field. Meta webhook POST requests are checked using `X-Hub-Signature-256` and `WHATSAPP_APP_SECRET`.

## Operational requirements

1. Complete Meta Business / WhatsApp Business Account onboarding and register the business phone number.
2. Get explicit client consent in the app before sending proactive WhatsApp messages.
3. Submit and receive approval for templates before using them outside the 24-hour service window.
4. Configure the secrets above before sending/receiving API messages.
5. Use the app's direct WhatsApp link as a fallback while the Cloud API credentials are not configured.

The Edge Function is deployed, but live Meta messaging is not active until these business credentials and webhook settings are configured. Meta messaging charges and template policies apply.

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Haven waitlist API. Four server-side API files were touched. A new shared PostHog client module (`api/_posthog.js`) was created using `posthog-node` v5.30.4, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in Vercel's serverless environment. Events are tracked on every meaningful user action: new signups (with full user identification), referral-driven signups, returning visitor checks, and status page loads. Server errors are now automatically captured as PostHog exceptions via `captureException`.

| Event | Description | File |
|---|---|---|
| `waitlist_signed_up` | A new user successfully joins the Haven waitlist. Core conversion event. | `api/signup.js` |
| `waitlist_signup_duplicate` | A returning visitor submits the signup form but is already on the waitlist. | `api/signup.js` |
| `referral_link_used` | A signup occurred via a referral link. Tracks viral loop performance. | `api/signup.js` |
| `waitlist_status_checked` | A user checks their waitlist standing via the status endpoint. | `api/status.js` |

User identification (`posthog.identify`) is called at signup, setting `email`, `ref_code`, `waitlist_position`, `waitlist_referrals`, `referred_by`, and `waitlist_signed_up_at` on the person profile.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/167453/dashboard/645806
- **Waitlist signups over time** (line chart, last 30 days): https://eu.posthog.com/project/167453/insights/vwZEAYjy
- **Total waitlist signups** (bold number, last 90 days): https://eu.posthog.com/project/167453/insights/kcAS0BLG
- **Referral-driven signups over time** (line chart, last 30 days): https://eu.posthog.com/project/167453/insights/a7hQyDeW
- **Signup to invite-page engagement funnel** (14-day window): https://eu.posthog.com/project/167453/insights/UvPqLMtV
- **Returning visitors / duplicate signup attempts** (bar chart, last 30 days): https://eu.posthog.com/project/167453/insights/MKUVIv3G

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

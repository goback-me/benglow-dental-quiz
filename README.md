# Bangalow Dental — Smile Fit Quiz

## Structure
```
quiz.html            The quiz itself (embeddable, transparent background, auto-resize)
api/submit.js         Vercel serverless function -> forwards submissions to your webhook
embed-snippet.html    Paste into the parent page (GHL/Webflow/WP) to embed the quiz via iframe
```

## Deploy
1. Push this folder to a new Vercel project (or drag-and-drop deploy).
2. In Vercel -> Project -> Settings -> Environment Variables, add:
   - `WEBHOOK_URL` (required) — where leads get forwarded (GHL/Zapier/n8n/your tracker)
   - `ALLOWED_ORIGIN` (optional) — lock CORS to your parent site's domain
   - `WEBHOOK_SECRET` (optional) — sent as `X-Webhook-Secret` header to your webhook
3. Redeploy after adding env vars.

## Embed it
1. Open `embed-snippet.html`, replace `QUIZ_URL` with your deployed quiz URL
   (e.g. `https://your-project.vercel.app/quiz.html`).
2. Paste the snippet into the parent page's custom HTML block.
3. It auto-resizes the iframe height as the user moves through quiz steps,
   and forwards UTM params from the parent URL into the quiz.

## Notes
- If this becomes a full Next.js app later, `api/submit.js` has a commented
  App Router version (`/app/api/submit/route.js`) at the bottom of the file.
- Lock down the `postMessage` origin checks in both `quiz.html` and
  `embed-snippet.html` once the production domains are fixed.

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

  // CORS — needed since the quiz iframe/page and this API may be on different origins
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrls = (process.env.WEBHOOK_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
  if (webhookUrls.length === 0) {
    console.error('Missing WEBHOOK_URL env var');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  let body = req.body;
  // Body may arrive as a string depending on runtime/config — normalize it
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Minimal validation — adjust required fields to match your quiz
  if (!body.email && !body.phone) {
    return res.status(400).json({ error: 'Missing contact details' });
  }

  const payload = {
    ...body,
    submitted_at: new Date().toISOString(),
    source: 'bangalow-dental-quiz',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
    user_agent: req.headers['user-agent'] || null,
  };

  await Promise.all(
    webhookUrls.map(async (webhookUrl) => {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.WEBHOOK_SECRET ? { 'X-Webhook-Secret': process.env.WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!webhookRes.ok) {
          const text = await webhookRes.text().catch(() => '');
          console.error('Webhook responded with error', webhookUrl, webhookRes.status, text);
        }
      } catch (err) {
        console.error('Failed to reach webhook', webhookUrl, err);
      }
    })
  );

  return res.status(200).json({ ok: true });
}
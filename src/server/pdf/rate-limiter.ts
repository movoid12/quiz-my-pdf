import type { NextApiRequest, NextApiResponse } from 'next';

type Entry = {
  minuteCount: number;
  minuteReset: number; // epoch seconds
  hourCount: number;
  hourReset: number; // epoch seconds
};

const store = new Map<string, Entry>();

const MINUTE_WINDOW = 60; // seconds
const HOUR_WINDOW = 60 * 60; // seconds
//* Requests limits
const MAX_PER_MINUTE = 1;
const MAX_PER_HOUR = 5;

export function getIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();

  if (Array.isArray(forwarded) && forwarded.length > 0) return forwarded[0];

  // fallback to connection remote address

  return req.socket.remoteAddress ?? 'unknown';
}

export function checkRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
): boolean {
  const ip = getIP(req);

  const now = Math.floor(Date.now() / 1000);

  let entry = store.get(ip);

  if (!entry) {
    entry = {
      minuteCount: 0,
      minuteReset: now + MINUTE_WINDOW,
      hourCount: 0,
      hourReset: now + HOUR_WINDOW,
    };

    store.set(ip, entry);
  }

  // reset windows if needed

  if (now >= entry.minuteReset) {
    entry.minuteCount = 0;
    
    entry.minuteReset = now + MINUTE_WINDOW;
  }

  if (now >= entry.hourReset) {
    entry.hourCount = 0;

    entry.hourReset = now + HOUR_WINDOW;
  }

  // check limits

  if (entry.minuteCount + 1 > MAX_PER_MINUTE) {
    const retryAfter = Math.max(0, entry.minuteReset - now);

    res.setHeader('Retry-After', String(retryAfter));

    res
      .status(429)
      .json({ error: 'Rate limit exceeded (per-minute). Try again later.' });

    return false;
  }

  if (entry.hourCount + 1 > MAX_PER_HOUR) {
    const retryAfter = Math.max(0, entry.hourReset - now);

    res.setHeader('Retry-After', String(retryAfter));

    res
      .status(429)
      .json({ error: 'Rate limit exceeded (per-hour). Try again later.' });

    return false;
  }

  // allow and increment

  entry.minuteCount += 1;

  entry.hourCount += 1;

  return true;
}

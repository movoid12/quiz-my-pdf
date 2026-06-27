type Entry = {
  minuteCount: number;
  minuteReset: number; // epoch seconds
  hourCount: number;
  hourReset: number; // epoch seconds
};

type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
};

const store = new Map<string, Entry>();

const MINUTE_WINDOW = 60; // seconds
const HOUR_WINDOW = 60 * 60; // seconds
//* Requests limits
const MAX_PER_MINUTE = 1;
const MAX_PER_HOUR = 5;

export function getIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Since Request objects don't have direct access to socket information,
  // we'll need to fall back to a default value
  return 'unknown';
}

export function checkRateLimit(req: Request): RateLimitResult {
  const ip = getIp(req);
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

  // check minute limit
  if (entry.minuteCount + 1 > MAX_PER_MINUTE) {
    const retryAfter = Math.max(0, entry.minuteReset - now);
    return { allowed: false, retryAfter };
  }

  // check hour limit
  if (entry.hourCount + 1 > MAX_PER_HOUR) {
    const retryAfter = Math.max(0, entry.hourReset - now);
    return { allowed: false, retryAfter };
  }

  entry.minuteCount += 1;
  entry.hourCount += 1;

  return { allowed: true };
}

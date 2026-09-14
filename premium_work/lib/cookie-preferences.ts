export const STORAGE_KEY = "pw_cookie_preferences";
export const COOKIE_VERSION = "2026-09-10.1";
export const PREFERENCE_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type PreferenceChoice = "accept" | "reject" | "custom";
export type CookiePreference = { version: string; choice: PreferenceChoice; necessary: true; savedAt: number; expiresAt: number };

// No optional services exist in this release. These choices never authorize future trackers.
export function createPreference(choice: PreferenceChoice, now = Date.now()): CookiePreference {
  return { version: COOKIE_VERSION, choice, necessary: true, savedAt: now, expiresAt: now + PREFERENCE_MAX_AGE };
}
export function parsePreference(raw: string | null, now = Date.now()): CookiePreference | null {
  try {
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== COOKIE_VERSION || !["accept", "reject", "custom"].includes(data.choice) || data.necessary !== true || !Number.isFinite(data.savedAt) || !Number.isFinite(data.expiresAt) || data.savedAt > now || data.expiresAt <= now || data.expiresAt - data.savedAt !== PREFERENCE_MAX_AGE) return null;
    return data;
  } catch { return null; }
}

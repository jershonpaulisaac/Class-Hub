export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SCHOOL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function formatTime(time: string | null): string {
  if (!time) return '--';
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

export function formatDate(date: string | null): string {
  if (!date) return '--';
  const d = new Date(date + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatFullDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function todayDow(): number {
  return new Date().getDay();
}

export function nowHHMM(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export function sanitizePhone(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/[^0-9]/g, '');
}

export function whatsappLink(phone: string | null, name: string | null): string | null {
  const clean = sanitizePhone(phone);
  if (!clean) return null;
  const safeName = encodeURIComponent(name ?? 'Professor');
  return `https://wa.me/${clean}?text=Hello%20${safeName},%20I%20am%20a%20student%20from%20the%20class...`;
}

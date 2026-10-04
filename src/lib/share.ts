import { WORKSHOP_CONFIG as cfg } from "@/config";

export function inviteUrl(code: string) {
  return `${cfg.siteUrl}/r/${code}`;
}

export function shareMessage(code: string) {
  return (
    `I just grabbed a free seat for "${cfg.title}" 🚀\n` +
    `You build + deploy a real AI app and get a live link for your resume, before placements.\n` +
    `Free for final-year engineering students. Seats are limited:\n` +
    inviteUrl(code)
  );
}

export function waShareUrl(code: string) {
  return `https://wa.me/?text=${encodeURIComponent(shareMessage(code))}`;
}

function stamp(iso: string, addMinutes = 0) {
  const d = new Date(new Date(iso).getTime() + addMinutes * 60000);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function sessionStart(session: number) {
  return session === 2 ? cfg.session2Date : cfg.sessionDate;
}

export function calendarUrl(session: number) {
  const start = sessionStart(session);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: cfg.title,
    dates: `${stamp(start)}/${stamp(start, 60)}`,
    details: "Free live workshop. Bring a laptop, internet and a Google account.",
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function icsFile(session: number) {
  const start = sessionStart(session);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Workshop Growth OS//EN",
    "BEGIN:VEVENT",
    `UID:session${session}@workshop-growth-os`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(start, 60)}`,
    `SUMMARY:${cfg.title}`,
    "DESCRIPTION:Free live workshop. Bring a laptop and a Google account.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

import { format } from 'date-fns';
import type { Session, Booking, Family, Child } from '@shared/types';
// This is a CLIENT-SIDE fallback helper for previews. It does not handle timezones.
// The primary .ics generation happens on the server in `worker/ics.ts`.
export function generateIcsContent(
  booking: Booking,
  session: Session,
  family: Family,
  child: Child
): string {
  const formatDateForICS = (date: Date) => {
    // Format to UTC string (e.g., "20231027T140000Z")
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CommunityBrickyard//FrictionlessFamily//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@communitybrickyard.com`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    `DTSTART:${formatDateForICS(new Date(session.startTs))}`,
    `DTEND:${formatDateForICS(new Date(session.endTs))}`,
    `SUMMARY:Lego Club: ${session.title} for ${child.name}`,
    `DESCRIPTION:Session for ${child.name} (${family.name} Family). Session Type: ${session.type}. Tags: ${session.tags.join(', ')}. Notes: ${session.notes}`,
    `LOCATION:${session.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return icsContent;
}
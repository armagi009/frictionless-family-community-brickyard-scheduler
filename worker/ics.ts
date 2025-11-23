import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import type { Session, Booking, Family, Child } from '@shared/types';
// This is a server-side helper that correctly handles timezones.
export function generateIcsContent(
  booking: Booking,
  session: Session,
  family: Family,
  child: Child
): string {
  const timeZone = 'America/New_York'; // A real app might store this per-user or club
  const startDate = new Date(session.startTs);
  const endDate = new Date(session.endTs);
  // Format dates for ICS, ensuring they are in the correct timezone format
  const formatDateForICS = (date: Date) => {
    return format(utcToZonedTime(date, timeZone), "yyyyMMdd'T'HHmmss");
  };
  const now = new Date();
  const formatUTC = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CommunityBrickyard//FrictionlessFamily//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@communitybrickyard.com`,
    `DTSTAMP:${formatUTC(now)}`,
    `DTSTART;TZID=${timeZone}:${formatDateForICS(startDate)}`,
    `DTEND;TZID=${timeZone}:${formatDateForICS(endDate)}`,
    `SUMMARY:Lego Club: ${session.title} for ${child.name}`,
    `DESCRIPTION:Session for ${child.name} (${family.name} Family).\\nSession Type: ${session.type}.\\nTags: ${session.tags.join(', ')}.\\nNotes: ${session.notes}`,
    `LOCATION:${session.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return icsContent;
}
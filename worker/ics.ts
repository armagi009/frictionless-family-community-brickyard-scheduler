import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
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
  const formatDateForICS = (date: Date) => {
    try {
      const zonedDate = toZonedTime(date, timeZone);
      return format(zonedDate, "yyyyMMdd'T'HHmmss");
    } catch (error) {
      console.error(`Failed to convert date to timezone ${timeZone}:`, error);
      // Fallback to UTC if timezone conversion fails
      return format(date, "yyyyMMdd'T'HHmmss'Z'");
    }
  };
  const now = new Date();
  const formatUTC = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
  const isAllDay = false; // Placeholder for future logic if needed
  const dtStart = formatDateForICS(startDate);
  const dtEnd = formatDateForICS(endDate);
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CommunityBrickyard//FrictionlessFamily//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@communitybrickyard.com`,
    `DTSTAMP:${formatUTC(now)}`,
    `DTSTART${isAllDay ? ';VALUE=DATE' : `;TZID=${timeZone}`}:${dtStart}`,
    `DTEND${isAllDay ? ';VALUE=DATE' : `;TZID=${timeZone}`}:${dtEnd}`,
    `SUMMARY:Lego Club: ${session.title} for ${child.name}`,
    `DESCRIPTION:Session for ${child.name} (${family.name} Family).\\nSession Type: ${session.type}.\\nTags: ${session.tags.join(', ')}.\\nNotes: ${session.notes || 'N/A'}`,
    `LOCATION:${session.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return icsContent;
}
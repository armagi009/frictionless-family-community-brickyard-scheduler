import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import type { Session, Booking, Family, Child } from '@shared/types';
// This is a server-side helper. A client-side version could exist for previews.
export function generateIcsContent(
  booking: Booking,
  session: Session,
  family: Family,
  child: Child
): string {
  const timeZone = 'America/New_York'; // Example timezone, should be configurable
  const startDate = utcToZonedTime(new Date(session.startTs), timeZone);
  const endDate = utcToZonedTime(new Date(session.endTs), timeZone);
  const formatDateForICS = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CommunityBrickyard//FrictionlessFamily//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@communitybrickyard.com`,
    `DTSTAMP:${formatDateForICS(new Date())}Z`,
    `DTSTART;TZID=${timeZone}:${formatDateForICS(startDate)}`,
    `DTEND;TZID=${timeZone}:${formatDateForICS(endDate)}`,
    `SUMMARY:Lego Club: ${session.title} for ${child.name}`,
    `DESCRIPTION:Session for ${child.name} (${family.name} Family). Session Type: ${session.type}. Tags: ${session.tags.join(', ')}. Notes: ${session.notes}`,
    `LOCATION:${session.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return icsContent;
}
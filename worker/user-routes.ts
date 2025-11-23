import { Hono } from "hono";
import type { Env } from './core-utils';
import { SessionEntity, FamilyEntity, BookingEntity, LegoSetEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { generateIcsContent } from '../src/lib/ics';
import type { Booking, Session, Family, Child } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure all data is seeded on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      SessionEntity.ensureSeed(c.env),
      FamilyEntity.ensureSeed(c.env),
      BookingEntity.ensureSeed(c.env),
      LegoSetEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // SESSIONS
  app.get('/api/sessions', async (c) => {
    const { items } = await SessionEntity.list(c.env);
    return ok(c, items.sort((a, b) => a.startTs - b.startTs));
  });
  // FAMILIES
  app.get('/api/families/:id', async (c) => {
    const family = new FamilyEntity(c.env, c.req.param('id'));
    if (!await family.exists()) return notFound(c, 'family not found');
    return ok(c, await family.getState());
  });
  app.post('/api/families', async (c) => {
    const body = await c.req.json<Partial<Family>>();
    if (!body.name || !body.parentName || !body.parentEmail || !body.children) {
      return bad(c, 'Missing required family data');
    }
    const newFamily: Family = {
      id: body.id || crypto.randomUUID(),
      name: body.name,
      parentName: body.parentName,
      parentEmail: body.parentEmail,
      children: body.children,
    };
    await FamilyEntity.create(c.env, newFamily);
    return ok(c, newFamily);
  });
  // BOOKINGS
  app.get('/api/bookings', async (c) => {
    const familyId = c.req.query('familyId');
    if (!familyId) return bad(c, 'familyId is required');
    const { items: allBookings } = await BookingEntity.list(c.env);
    const familyBookings = allBookings.filter(b => b.familyId === familyId);
    // Enrich with session and child info
    const enrichedBookings = await Promise.all(familyBookings.map(async (booking) => {
        const session = new SessionEntity(c.env, booking.sessionId);
        const family = new FamilyEntity(c.env, booking.familyId);
        const sessionData = await session.getState();
        const familyData = await family.getState();
        const childData = familyData.children.find(c => c.id === booking.childId);
        return { ...booking, session: sessionData, child: childData };
    }));
    return ok(c, enrichedBookings);
  });
  app.post('/api/bookings', async (c) => {
    const { sessionId, familyId, childId, notes } = await c.req.json<{ sessionId: string, familyId: string, childId: string, notes?: string }>();
    if (!sessionId || !familyId || !childId) return bad(c, 'sessionId, familyId, and childId are required');
    const newBooking: Booking = {
      id: `book_${crypto.randomUUID()}`,
      sessionId,
      familyId,
      childId,
      status: 'pending',
      approvalToken: crypto.randomUUID(),
      createdTs: Date.now(),
      notes,
    };
    await BookingEntity.create(c.env, newBooking);
    return ok(c, newBooking);
  });
  app.post('/api/bookings/:id/approve', async (c) => {
    const bookingId = c.req.param('id');
    const token = c.req.query('token');
    if (!token) return bad(c, 'Approval token is required');
    const bookingEntity = new BookingEntity(c.env, bookingId);
    if (!await bookingEntity.exists()) return notFound(c, 'Booking not found');
    const booking = await bookingEntity.getState();
    if (booking.approvalToken !== token) return bad(c, 'Invalid approval token');
    if (booking.status !== 'pending') return bad(c, 'Booking is not pending approval');
    await bookingEntity.patch({ status: 'confirmed' });
    return ok(c, { ...booking, status: 'confirmed' });
  });
  // .ICS Download
  app.get('/api/bookings/:id/ics', async (c) => {
    const bookingId = c.req.param('id');
    const bookingEntity = new BookingEntity(c.env, bookingId);
    if (!await bookingEntity.exists()) return notFound(c, 'Booking not found');
    const booking = await bookingEntity.getState();
    if (booking.status !== 'confirmed') return bad(c, 'Booking not confirmed');
    const sessionEntity = new SessionEntity(c.env, booking.sessionId);
    const familyEntity = new FamilyEntity(c.env, booking.familyId);
    if (!await sessionEntity.exists() || !await familyEntity.exists()) {
      return notFound(c, 'Session or Family not found');
    }
    const session = await sessionEntity.getState();
    const family = await familyEntity.getState();
    const child = family.children.find(ch => ch.id === booking.childId);
    if (!child) return notFound(c, 'Child not found in family');
    const icsContent = generateIcsContent(booking, session, family, child);
    return new Response(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="booking-${booking.id}.ics"`,
      },
    });
  });
}
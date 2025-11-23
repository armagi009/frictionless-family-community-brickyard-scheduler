import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { api } from '@/lib/api-client';
import { useFamilyStore } from '@/hooks/use-family-store';
import type { Booking, Session, Child } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Check, X, Clock, Calendar, User, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
type EnrichedBooking = Booking & {
  session: Session;
  child: Child;
};
export function ApprovalsPage() {
  const family = useFamilyStore(s => s.family);
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState<EnrichedBooking | null>(null);
  useEffect(() => {
    if (family) {
      setIsLoading(true);
      api<EnrichedBooking[]>(`/api/bookings?familyId=${family.id}`)
        .then(data => setBookings(data.sort((a, b) => b.createdTs - a.createdTs)))
        .catch(err => toast.error('Failed to load bookings', { description: err.message }))
        .finally(() => setIsLoading(false));
    }
  }, [family]);
  const handleApprove = async (booking: EnrichedBooking) => {
    try {
      const approvedBooking = await api<Booking>(`/api/bookings/${booking.id}/approve?token=${booking.approvalToken}`, {
        method: 'POST',
      });
      setBookings(prev => prev.map(b => b.id === approvedBooking.id ? { ...b, status: 'confirmed' } : b));
      setShowEmailPreview({ ...booking, status: 'confirmed' });
      toast.success('Booking Approved!', {
        description: `Showing confirmation preview for ${booking.session.title}.`,
      });
    } catch (error) {
      toast.error('Approval failed', { description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700',
    confirmed: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
    cancelled: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700',
  };
  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    confirmed: <Check className="w-4 h-4" />,
    cancelled: <X className="w-4 h-4" />,
  };
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">Approvals & Bookings</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Review pending requests and see all your family's confirmed sessions.
              </p>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.session.title}</CardTitle>
                          <CardDescription>Requested on {format(new Date(booking.createdTs), 'MMM d, yyyy')}</CardDescription>
                        </div>
                        <Badge variant="outline" className={`capitalize flex items-center gap-2 ${statusStyles[booking.status]}`}>
                          {statusIcons[booking.status]} {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span>For: <strong>{booking.child.name}</strong></span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>{format(new Date(booking.session.startTs), 'EEE, MMM d @ p')}</span></div>
                      </div>
                      {booking.notes && <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">"{booking.notes}"</p>}
                      {booking.status === 'pending' && (
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm"><X className="w-4 h-4 mr-2" /> Decline</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(booking)}><Check className="w-4 h-4 mr-2" /> Approve</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No bookings yet!</h3>
                <p className="text-muted-foreground mt-2">When you request a session, it will appear here for approval.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Sheet open={!!showEmailPreview} onOpenChange={() => setShowEmailPreview(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Confirmation Preview</SheetTitle>
            <SheetDescription>This is a mock-up of the confirmation email.</SheetDescription>
          </SheetHeader>
          {showEmailPreview && (
            <div className="mt-4 p-4 border rounded-lg bg-background">
              <h3 className="font-bold text-lg">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground">Your spot for {showEmailPreview.child.name} is confirmed.</p>
              <div className="my-4 border-t pt-4 space-y-2 text-sm">
                <p><strong>Session:</strong> {showEmailPreview.session.title}</p>
                <p><strong>When:</strong> {format(new Date(showEmailPreview.session.startTs), 'eeee, MMMM d, yyyy @ p')}</p>
                <p><strong>Where:</strong> {showEmailPreview.session.location}</p>
              </div>
              <Button className="w-full" onClick={() => window.location.href = `/api/bookings/${showEmailPreview.id}/ics`}>
                <Download className="w-4 h-4 mr-2" /> Add to Calendar (.ics)
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
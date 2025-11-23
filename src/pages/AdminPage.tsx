import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Booking, Session, Child } from '@shared/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
type EnrichedBooking = Booking & { session: Session; child: Child };
const mockChartData = [
  { date: 'Mon', bookings: 4 },
  { date: 'Tue', bookings: 3 },
  { date: 'Wed', bookings: 5 },
  { date: 'Thu', bookings: 7 },
  { date: 'Fri', bookings: 6 },
  { date: 'Sat', bookings: 10 },
  { date: 'Sun', bookings: 8 },
];
export function AdminPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await api<EnrichedBooking[]>('/api/bookings');
      setBookings(data.sort((a, b) => b.createdTs - a.createdTs));
    } catch (error) {
      toast.error("Failed to load bookings", { description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  const handleAddSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }
    try {
      await api('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          notes: data.notes,
          startTs: startDate.getTime(),
          endTs: endDate.getTime(),
          ageMin: Number(data.ageMin),
          ageMax: Number(data.ageMax),
          capacity: Number(data.capacity),
          tags: (data.tags as string).split(',').map(t => t.trim()),
        }),
      });
      toast.success("Session created successfully!");
      e.currentTarget.reset();
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      toast.error("Failed to create session", { description: error instanceof Error ? error.message : "Unknown error" });
    }
  };
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api(`/api/bookings/${bookingId}?admin=1`, { method: 'DELETE' });
      toast.success("Booking cancelled successfully!");
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (error) {
      toast.error("Failed to cancel booking", { description: error instanceof Error ? error.message : "Unknown error" });
    }
  };
  const statusStyles: { [key in Booking['status']]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">Admin Dashboard</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Manage sessions, view bookings, and oversee club operations.
            </p>
          </div>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Weekly Booking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="hsl(var(--brand-blue))" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Add New Session</CardTitle>
                <CardDescription>Create a new workshop or free-play session.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSession} className="space-y-4">
                  <div><Label htmlFor="title">Session Title</Label><Input id="title" name="title" required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Start Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{startDate ? format(startDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent></Popover></div>
                    <div><Label>End Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{endDate ? format(endDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} /></PopoverContent></Popover></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label htmlFor="ageMin">Min Age</Label><Input id="ageMin" name="ageMin" type="number" defaultValue="5" /></div>
                    <div><Label htmlFor="ageMax">Max Age</Label><Input id="ageMax" name="ageMax" type="number" defaultValue="12" /></div>
                    <div><Label htmlFor="capacity">Capacity</Label><Input id="capacity" name="capacity" type="number" defaultValue="20" /></div>
                  </div>
                  <div><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" name="tags" placeholder="e.g., space, workshop" /></div>
                  <div><Label htmlFor="notes">Description</Label><Textarea id="notes" name="notes" /></div>
                  <Button type="submit" className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white">Add Session</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Bookings Overview</CardTitle>
                <CardDescription>View and manage all current bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Child</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="font-medium">{booking.child.name}</div>
                            <div className="text-sm text-muted-foreground">{format(new Date(booking.createdTs), 'PP')}</div>
                          </TableCell>
                          <TableCell>{booking.session.title}</TableCell>
                          <TableCell><Badge variant="outline" className={cn('capitalize', statusStyles[booking.status])}>{booking.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleCancelBooking(booking.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
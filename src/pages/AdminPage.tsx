import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
export function AdminPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
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
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">Admin Dashboard</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Manage sessions, view bookings, and oversee club operations.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Session</CardTitle>
                <CardDescription>Create a new workshop or free-play session.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSession} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Session Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label htmlFor="ageMin">Min Age</Label><Input id="ageMin" name="ageMin" type="number" defaultValue="5" /></div>
                    <div><Label htmlFor="ageMax">Max Age</Label><Input id="ageMax" name="ageMax" type="number" defaultValue="12" /></div>
                    <div><Label htmlFor="capacity">Capacity</Label><Input id="capacity" name="capacity" type="number" defaultValue="20" /></div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="e.g., space, workshop, creative" />
                  </div>
                  <div>
                    <Label htmlFor="notes">Description</Label>
                    <Textarea id="notes" name="notes" />
                  </div>
                  <Button type="submit" className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white">Add Session</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bookings Overview</CardTitle>
                <CardDescription>View and manage all current bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Bookings management UI coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
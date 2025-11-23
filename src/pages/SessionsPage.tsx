import { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SessionCard } from '@/components/SessionCard';
import { BookingModal } from '@/components/BookingModal';
import { api } from '@/lib/api-client';
import type { Session, Child } from '@shared/types';
import { useFamilyStore } from '@/hooks/use-family-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
const ALL_TAGS = ['creative free-build', 'vehicles', 'space', 'rockets', 'workshop', 'castles', 'knights', 'adults', 'architecture', 'relax', 'minifigures'];
export function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSession, setBookingSession] = useState<Session | null>(null);
  const family = useFamilyStore(s => s.family);
  const selectedChildId = useFamilyStore(s => s.selectedChildId);
  const selectChild = useFamilyStore(s => s.selectChild);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const selectedChild = useMemo(() => {
    return family?.children.find((c: Child) => c.id === selectedChildId);
  }, [family, selectedChildId]);
  useEffect(() => {
    api<Session[]>('/api/sessions')
      .then(data => setSessions(data))
      .catch(err => toast.error('Failed to load sessions', { description: err.message }))
      .finally(() => setIsLoading(false));
  }, []);
  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(tag);
      } else {
        newSet.delete(tag);
      }
      return newSet;
    });
  };
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      if (selectedChild) {
        if (session.ageMin > selectedChild.age || session.ageMax < selectedChild.age) {
          return false;
        }
      }
      if (selectedTags.size > 0) {
        if (!Array.from(selectedTags).every(tag => session.tags.includes(tag))) {
          return false;
        }
      }
      return true;
    });
  }, [sessions, selectedChild, selectedTags]);
  const handleBook = (session: Session) => {
    if (!family) {
      toast.info('Please set up your family profile first.');
      // Potentially navigate to /family
      return;
    }
    setBookingSession(session);
  };
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">Find a Session</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Browse upcoming workshops and free-play sessions. Filter by child to see what's available for them.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="font-semibold">Child Profile</Label>
                    <Select value={selectedChildId ?? ''} onValueChange={(val) => selectChild(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a child" />
                      </SelectTrigger>
                      <SelectContent>
                        {family?.children.map((child: Child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name} (Age {child.age})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">Interest Tags</Label>
                    <div className="space-y-2 mt-2">
                      {ALL_TAGS.map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={selectedTags.has(tag)}
                            onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                          />
                          <Label htmlFor={tag} className="font-normal capitalize">{tag}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
            <main className="md:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-[125px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map(session => (
                      <SessionCard key={session.id} session={session} onBook={handleBook} />
                    ))
                  ) : (
                    <div className="lg:col-span-2 text-center py-16">
                      <p className="text-muted-foreground">No sessions match your filters.</p>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <BookingModal
        session={bookingSession}
        isOpen={!!bookingSession}
        onClose={() => setBookingSession(null)}
      />
    </PageLayout>
  );
}
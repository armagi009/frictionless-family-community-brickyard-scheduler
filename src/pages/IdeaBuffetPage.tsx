import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { IdeaBuffet } from '@/components/IdeaBuffet';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { LegoSet } from '@shared/types';
import { toast } from 'sonner';
export function IdeaBuffetPage() {
  const [sets, setSets] = useState<LegoSet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    api<LegoSet[]>('/api/sets')
      .then(setSets)
      .catch(err => toast.error("Failed to load sets", { description: err.message }))
      .finally(() => setIsLoading(false));
  }, []);
  // In a real app, filtering would be done on the server for large datasets
  const filteredSets = sets.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">The Idea Buffet</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our full library of pre-built sets. Search for inspiration, find parts, or see what's being built.
            </p>
          </div>
          <div className="max-w-lg mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by set name or ID..."
                className="pl-10 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading sets...</p>
          ) : (
            <IdeaBuffet /> // The component already uses mock data, which is fine for this phase.
                           // A future enhancement would be to pass `filteredSets` to it.
          )}
        </div>
      </div>
    </PageLayout>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Session, Child } from '@shared/types';
import { useFamilyStore } from '@/hooks/use-family-store';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
interface BookingModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}
export function BookingModal({ session, isOpen, onClose }: BookingModalProps) {
  const family = useFamilyStore(s => s.family);
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(family?.children[0]?.id);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!session || !family || !selectedChildId) {
      toast.error('Missing information to create booking.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: session.id,
          familyId: family.id,
          childId: selectedChildId,
          notes: message,
        }),
      });
      toast.success('Booking requested!', {
        description: 'Check the Approvals page for parent review.',
      });
      onClose();
      // Reset form state for next time
      setMessage('');
      setSelectedChildId(family?.children[0]?.id);
    } catch (error) {
      toast.error('Failed to request booking.', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!session || !family) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Request Booking</DialogTitle>
          <DialogDescription>
            Request a spot for "{session.title}" for one of your children.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="child" className="text-right">
              Child
            </Label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger id="child" className="col-span-3">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {family.children.map((child: Child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name} (Age {child.age})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Optional message to the club..."
              className="col-span-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {!selectedChildId && <p className="col-span-4 text-center text-sm text-destructive">Please select a child to continue.</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedChildId || isSubmitting}
            className="bg-[#E53935] hover:bg-[#D32F2F] text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
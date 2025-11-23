import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Tag, Info, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@shared/types';
interface SessionCardProps {
  session: Session;
  onBook: (session: Session) => void;
}
export function SessionCard({ session, onBook }: SessionCardProps) {
  const sessionTypeColors = {
    'free-play': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'workshop': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'adult-night': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold font-display tracking-tight text-foreground pr-2">
              {session.title}
            </CardTitle>
            <Badge className={`whitespace-nowrap ${sessionTypeColors[session.type]}`}>
              {session.type.replace('-', ' ')}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center pt-1">
            <Users className="w-4 h-4 mr-2" />
            Ages {session.ageMin} - {session.ageMax}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(session.startTs), 'EEEE, MMMM d')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{format(new Date(session.startTs), 'p')} - {format(new Date(session.endTs), 'p')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Info className="w-4 h-4 mr-2 flex-shrink-0" />
            <p className="line-clamp-2">{session.notes}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {session.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onBook(session)}
            className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-semibold shadow-primary transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Request Booking
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
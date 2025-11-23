import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Pin } from 'lucide-react';
const galleryImages = [
  "https://images.unsplash.com/photo-1611283361499-11a60a50a46b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599652492782-7056d83a34a3?q=80&w=1932&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585366119957-e1579a529323?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603361326905-9288341b83a6?q=80&w=1974&auto=format&fit=crop",
];
const buildChallenges = [
  { title: "Build a vehicle with no wheels", difficulty: "Hard" },
  { title: "Create a scene from your favorite movie", difficulty: "Medium" },
  { title: "Build the tallest tower you can in 5 minutes", difficulty: "Easy" },
];
export function LegacyWallPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">Legacy Wall</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              A gallery of our community's amazing creations and current build challenges.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-display mb-4">Community Gallery</h2>
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {galleryImages.map((src, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <img src={src} alt={`Lego creation ${index + 1}`} className="aspect-video w-full object-cover" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display mb-4">Build Challenges</h2>
              <div className="space-y-4">
                {buildChallenges.map((challenge, index) => (
                  <Card key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-semibold">{challenge.title}</CardTitle>
                      <Pin className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className={
                        challenge.difficulty === 'Hard' ? 'border-red-500 text-red-500' :
                        challenge.difficulty === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
                      }>{challenge.difficulty}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
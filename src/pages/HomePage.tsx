import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArrowRight, ToyBrick, Calendar, Users } from 'lucide-react';
import { IdeaBuffet } from '@/components/IdeaBuffet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFamilyStore } from '@/hooks/use-family-store';
export function HomePage() {
  const family = useFamilyStore(s => s.family);
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-32 text-center">
          <div className="inline-block bg-[#FFD54F] p-4 rounded-full mb-6 animate-float">
            <ToyBrick className="w-12 h-12 text-[#1976D2]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-foreground">
            Welcome to the Community Brickyard
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A place for creative building, deconstruction, and endless imagination. Let's build something amazing together!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#E53935] hover:bg-[#D32F2F] text-white shadow-primary text-base font-semibold px-8 py-6 rounded-full transition-transform hover:scale-105">
              <Link to="/sessions">
                Find a Session <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-semibold px-8 py-6 rounded-full transition-transform hover:scale-105">
              <Link to="/family">
                View My Family
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 lg:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Your Family Dashboard</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Manage your children's profiles, see recommended sessions, and approve booking requests all in one place.
                </p>
                <div className="mt-8">
                  {family ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>{family.name}</CardTitle>
                        <CardDescription>{family.parentName} ({family.parentEmail})</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {family.children.map(child => (
                            <div key={child.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                              <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="font-semibold">{child.name}</p>
                                  <p className="text-sm text-muted-foreground">Age {child.age}</p>
                                </div>
                              </div>
                              <Link to="/sessions">
                                <Button size="sm" variant="ghost">
                                  Find Sessions <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                     <p>Loading family data...</p>
                  )}
                </div>
              </div>
              <div className="bg-background p-8 rounded-2xl shadow-soft">
                 <div className="aspect-video bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-24 h-24 text-blue-300" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">The Idea Buffet</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our library of pre-built sets for inspiration, play, or deconstruction.
            </p>
          </div>
          <IdeaBuffet />
        </div>
      </div>
    </PageLayout>
  );
}
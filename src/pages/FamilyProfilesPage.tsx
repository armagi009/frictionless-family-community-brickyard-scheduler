import { PageLayout } from '@/components/layout/PageLayout';
import { useFamilyStore } from '@/hooks/use-family-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
export function FamilyProfilesPage() {
  const family = useFamilyStore(s => s.family);
  const setFamily = useFamilyStore(s => s.setFamily);
  const loadDemoFamily = useFamilyStore(s => s.loadDemoFamily);
  // In a real app, this would be a form with state management (e.g., react-hook-form)
  // For this demo, we'll just display the data from the store.
  const handleSaveChanges = () => {
    // Mock save
    toast.success("Profile Saved!", { description: "Your family profile has been updated." });
  }
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">My Family Profile</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Manage your family's details and your children's interests to get personalized session recommendations.
              </p>
            </div>
            {family ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Family Profile</CardTitle>
                  <CardDescription>Changes are saved automatically for this demo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Parent Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentName">Parent Name</Label>
                        <Input id="parentName" defaultValue={family.parentName} />
                      </div>
                      <div>
                        <Label htmlFor="parentEmail">Parent Email</Label>
                        <Input id="parentEmail" type="email" defaultValue={family.parentEmail} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Children</h3>
                      <Button variant="outline" size="sm"><UserPlus className="w-4 h-4 mr-2" /> Add Child</Button>
                    </div>
                    <div className="space-y-4">
                      {family.children.map(child => (
                        <div key={child.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="grid sm:grid-cols-2 gap-4 flex-grow">
                              <div>
                                <Label htmlFor={`childName-${child.id}`}>Child's Name</Label>
                                <Input id={`childName-${child.id}`} defaultValue={child.name} />
                              </div>
                              <div>
                                <Label htmlFor={`childAge-${child.id}`}>Age</Label>
                                <Input id={`childAge-${child.id}`} type="number" defaultValue={child.age} />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 flex-shrink-0">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                          <div>
                            <Label>Interests</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {child.interestTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              <Button variant="outline" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={loadDemoFamily}>Reset to Demo Data</Button>
                    <Button onClick={handleSaveChanges} className="bg-[#1976D2] hover:bg-[#1565C0] text-white">Save Changes</Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Loading family profile...</p>
                <Button onClick={loadDemoFamily} className="mt-4">Load Demo Family</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
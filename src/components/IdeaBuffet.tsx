import { Card, CardContent } from '@/components/ui/card';
import { MOCK_SETS } from '@shared/mock-data';
import { QrCode, ToyBrick } from 'lucide-react';
export function IdeaBuffet() {
  const setsByShelf = MOCK_SETS.reduce((acc, set) => {
    if (!acc[set.shelf]) {
      acc[set.shelf] = [];
    }
    acc[set.shelf].push(set);
    return acc;
  }, {} as Record<string, typeof MOCK_SETS>);
  const shelfOrder: (keyof typeof setsByShelf)[] = ['Ready for Play', 'Ready for Parts', 'Works in Progress'];
  return (
    <div className="space-y-12">
      {shelfOrder.map(shelf => (
        <div key={shelf}>
          <h3 className="text-2xl font-bold font-display mb-4 tracking-tight">{shelf}</h3>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {setsByShelf[shelf]?.map(set => (
                <Card key={set.id} className="min-w-[250px] flex-shrink-0 rounded-2xl shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center mb-4">
                      <ToyBrick className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-foreground">{set.title}</h4>
                      <p className="text-sm text-muted-foreground">{set.id}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>{set.pieceCount} pieces</span>
                      <QrCode className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
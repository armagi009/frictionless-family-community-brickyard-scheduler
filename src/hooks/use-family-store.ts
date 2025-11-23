import { create } from 'zustand';
import type { Family, Child } from '@shared/types';
import { MOCK_FAMILIES } from '@shared/mock-data';
interface FamilyState {
  family: Family | null;
  selectedChildId: string | null;
  setFamily: (family: Family) => void;
  selectChild: (childId: string | null) => void;
  loadDemoFamily: () => void;
}
export const useFamilyStore = create<FamilyState>((set) => ({
  family: null,
  selectedChildId: null,
  setFamily: (family) => set({ family, selectedChildId: family.children[0]?.id ?? null }),
  selectChild: (childId) => set({ selectedChildId: childId }),
  loadDemoFamily: () => {
    const demoFamily = MOCK_FAMILIES[0];
    set({ family: demoFamily, selectedChildId: demoFamily.children[0]?.id ?? null });
  },
}));
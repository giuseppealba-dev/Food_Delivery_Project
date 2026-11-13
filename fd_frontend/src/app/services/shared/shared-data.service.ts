import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  // Signal privato per la categoria selezionata - inizia con null (nessuna categoria selezionata)
  private selectedCategorySignal = signal<number | null>(null);
  
  // Signal pubblico read-only per permettere ai componenti di leggere la categoria selezionata
  public readonly selectedCategory = this.selectedCategorySignal.asReadonly();

  constructor() { }

  setSelectedCategory(categoryId: number | null): void {
    console.log('SharedDataService: Impostando categoria selezionata:', categoryId);
    this.selectedCategorySignal.set(categoryId);
  }

  getSelectedCategory(): number | null {
    return this.selectedCategorySignal();
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategorySignal() === categoryId;
  }

  clearSelectedCategory(): void {
    console.log('SharedDataService: Deselezionando categoria');
    this.selectedCategorySignal.set(null);
  }
}

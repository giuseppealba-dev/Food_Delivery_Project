import { Component, OnInit, ViewChild, output } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonContent, IonTitle, IonCheckbox } from "@ionic/angular/standalone";
import { OverlayEventDetail } from '@ionic/core/components';
import { IngredientService } from '../../services/ingredient-service/ingredient.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.scss'],
  imports: [FormsModule, IonCheckbox, IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonContent, IonTitle]
})
export class IngredientModalComponent implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;
  ingredientsSelected = output<{id: number, name: string}[]>();

  name!: string;

  ingredients: { id: number, name: string, selected?: boolean }[] = [];
  filteredIngredients: { id: number, name: string, selected?: boolean }[] = []; // Lista filtrata che verrà mostrata
  searchTerm: string = ''
  selectedIngredients: {id: number, name: string}[] = [];

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.loadIngredients();
    // this.filteredIngredients = [...this.ingredients]
  }

  loadIngredients() {
    this.ingredientService.getIngredients().subscribe(
      (response) => {
        if (response.success) {
          this.ingredients = response.data.map((ingredient: any) => ({ 
            id: ingredient.ID_ingrediente, 
            name: ingredient.nome_ingrediente,
            selected: false
          }));
          this.filteredIngredients = [...this.ingredients];
          console.log('Ingredients loaded:', response.data);
        } else {
          console.error('Failed to load ingredients:', response);
        }
      });
  }

  // Metodo per gestire la selezione degli ingredienti
  onIngredientSelectionChange(ingredient: { id: number, name: string, selected?: boolean }) {
    if (ingredient.selected) {
      // Aggiungi l'ingrediente alla lista se non è già presente
      if (!this.selectedIngredients.find(item => item.id === ingredient.id)) {
        this.selectedIngredients.push({ id: ingredient.id, name: ingredient.name });
      }
    } else {
      // Rimuovi l'ingrediente dalla lista
      this.selectedIngredients = this.selectedIngredients.filter(item => item.id !== ingredient.id);
    }
    console.log('Selected ingredients:', this.selectedIngredients);
  }

  // Metodo per cercare gli ingredienti all'interno della lista
  filterIngredients(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;

    if (searchTerm.trim() === '') {
      // Se il campo di ricerca è vuoto, mostra tutti gli ingredienti
      this.filteredIngredients = [...this.ingredients];
    } else {
      // Filtra gli ingredienti in base al nome
      this.filteredIngredients = this.ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  // Modale
  cancel() {
    this.resetSelections();
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.ingredientsSelected.emit(this.selectedIngredients);
    this.resetSelections();
    this.modal.dismiss(this.selectedIngredients, 'confirm');
  }

  resetSelections() {
    this.selectedIngredients = [];
    this.ingredients.forEach(ingredient => ingredient.selected = false);
    this.filteredIngredients.forEach(ingredient => ingredient.selected = false);
    this.searchTerm = '';
  }

  // chatgpt: Gestione dell'evento di chiusura del modale
  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      console.log('Ingredienti selezionati:', event.detail.data);
    }
  }
}

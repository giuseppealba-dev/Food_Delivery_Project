import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { IngredientService } from 'src/app/services/ingredient-service/ingredient.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-remove-ingredient',
  templateUrl: './remove-ingredient.component.html',
  styleUrls: ['./remove-ingredient.component.scss'],
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert],
})
export class RemoveIngredientComponent implements OnInit {
  ingredients: { ID_ingrediente: number, nome_ingrediente: string }[] = [];
  isLoading: boolean = false;
  statusMessage: string = '';
  
  // Proprietà per gestire l'alert inline
  isAlertOpen = false;
  selectedIngredient: { ID_ingrediente: number, nome_ingrediente: string } | null = null;
  alertMessage = '';

  constructor(
    private ingredientService: IngredientService,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.loadIngredients();
  }

  loadIngredients() {
    this.isLoading = true;
    this.ingredientService.getIngredients().subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.ingredients = response.data;
        } else {
          this.statusMessage = 'Errore durante il caricamento degli ingredienti';
        }
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = 'Errore di connessione';
        console.error('Errore:', error);
      }
    );
  }

  confirmRemoveIngredient(ingredient: { ID_ingrediente: number, nome_ingrediente: string }) {
    this.selectedIngredient = ingredient;
    this.alertMessage = `Sei sicuro di voler rimuovere l'ingrediente "${ingredient.nome_ingrediente}"? Questa azione rimuoverà anche tutte le associazioni con i prodotti.`;
    this.isAlertOpen = true;
  }

  onAlertDismiss(event: any) {
    this.isAlertOpen = false;
    if (event.detail.role === 'confirm' && this.selectedIngredient) {
      this.removeIngredient(this.selectedIngredient.ID_ingrediente);
    }
    this.selectedIngredient = null;
  }

  removeIngredient(id: number) {
    this.isLoading = true;
    this.ingredientService.removeIngredient(id).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.statusMessage = 'Ingrediente rimosso con successo!';
          // Ricarica la lista degli ingredienti
          this.loadIngredients();
        } else {
          this.statusMessage = 'Errore durante la rimozione dell\'ingrediente: ' + response.message;
        }
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = 'Errore di connessione';
        console.error('Errore:', error);
      }
    );
  }

  goBackToGestione() {
    this.router.navigate(['/user/gestione_locale']);
  }
}

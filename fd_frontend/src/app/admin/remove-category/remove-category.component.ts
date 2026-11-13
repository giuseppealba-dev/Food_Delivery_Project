import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-remove-category',
  templateUrl: './remove-category.component.html',
  styleUrls: ['./remove-category.component.scss'],
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert],
  standalone: true
})
export class RemoveCategoryComponent implements OnInit {
  categories: any[] = [];
  isLoading: boolean = false;
  statusMessage: string = '';
  
  // Proprietà per gestire l'alert inline
  isAlertOpen = false;
  selectedCategory: any = null;
  alertMessage = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Response from backend:', response);
        if (response.success) {
          console.log('Categories data:', response.data);
          this.categories = response.data;
        } else {
          this.statusMessage = 'Errore durante il caricamento delle categorie';
        }
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = 'Errore di connessione';
        console.error('Errore:', error);
      }
    );
  }

  confirmRemoveCategory(category: any) {
    this.selectedCategory = category;
    this.alertMessage = `Sei sicuro di voler rimuovere la categoria "${category.nome_categoria}"? Questa azione rimuoverà anche TUTTI i prodotti associati alla categoria e i loro riferimenti nella tabella Ingredienti_Prodotto. Questa operazione non può essere annullata.`;
    this.isAlertOpen = true;
  }

  onAlertDismiss(event: any) {
    this.isAlertOpen = false;
    if (event.detail.role === 'confirm' && this.selectedCategory) {
      const categoryId = this.selectedCategory.ID_categoria || this.selectedCategory.id_categoria;
      this.removeCategory(categoryId);
    }
    this.selectedCategory = null;
  }

  removeCategory(id: number) {
    this.isLoading = true;
    this.categoryService.removeCategory(id).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.statusMessage = 'Categoria e prodotti associati rimossi con successo!';
          // Ricarica la lista delle categorie
          this.loadCategories();
        } else {
          this.statusMessage = 'Errore durante la rimozione della categoria: ' + response.message;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { ProductService } from 'src/app/services/product-service/product.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-remove-product',
  templateUrl: './remove-product.component.html',
  styleUrls: ['./remove-product.component.scss'],
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonList, IonIcon, IonAlert],
})
export class RemoveProductComponent implements OnInit {
  products: { ID_prodotto: number, nome_prodotto: string, prezzo: number }[] = [];
  isLoading: boolean = false;
  statusMessage: string = '';
  
  // Proprietà per gestire l'alert inline
  isAlertOpen = false;
  selectedProduct: { ID_prodotto: number, nome_prodotto: string, prezzo: number } | null = null;
  alertMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.products = response.data;
        } else {
          this.statusMessage = 'Errore durante il caricamento dei prodotti';
        }
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = 'Errore di connessione';
        console.error('Errore:', error);
      }
    );
  }

  confirmRemoveProduct(product: { ID_prodotto: number, nome_prodotto: string, prezzo: number }) {
    this.selectedProduct = product;
    this.alertMessage = `Sei sicuro di voler rimuovere il prodotto "${product.nome_prodotto}"? Questa azione rimuoverà anche tutte le associazioni con gli ingredienti.`;
    this.isAlertOpen = true;
  }

  onAlertDismiss(event: any) {
    this.isAlertOpen = false;
    if (event.detail.role === 'confirm' && this.selectedProduct) {
      this.removeProduct(this.selectedProduct.ID_prodotto);
    }
    this.selectedProduct = null;
  }

  removeProduct(id: number) {
    this.isLoading = true;
    this.productService.removeProduct(id).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success) {
          this.statusMessage = 'Prodotto rimosso con successo!';
          // Ricarica la lista dei prodotti
          this.loadProducts();
        } else {
          this.statusMessage = 'Errore durante la rimozione del prodotto: ' + response.message;
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

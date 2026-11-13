import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonItem, IonLabel, IonButton, IonList, IonIcon } from '@ionic/angular/standalone';
import { ProductService } from 'src/app/services/product-service/product.service';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-list-edit-product',
  templateUrl: './list-edit-product.component.html',
  styleUrls: ['./list-edit-product.component.scss'],
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonList, IonIcon, EditProductComponent],
})
export class ListEditProductComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = false;
  statusMessage: string = '';
  selectedProduct: any = null;
  showEditForm: boolean = false;

  constructor(private productService: ProductService, private router: Router) {
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

  editProduct(product: any) {
    this.selectedProduct = product;
    this.showEditForm = true;
  }

  onProductUpdated() {
    this.showEditForm = false;
    this.selectedProduct = null;
    this.loadProducts(); // Ricarica la lista
    this.statusMessage = 'Prodotto aggiornato con successo!';
  }

  onEditCanceled() {
    this.showEditForm = false;
    this.selectedProduct = null;
  }

  goBackToGestione() {
    this.router.navigate(['/user/gestione_locale']);
  }
}

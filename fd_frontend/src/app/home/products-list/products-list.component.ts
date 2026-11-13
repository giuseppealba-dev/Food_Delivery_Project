import { Component, OnInit, effect } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product-service/product.service';
import { SharedDataService } from 'src/app/services/shared/shared-data.service';
import { IonCol, IonRow, IonGrid, IonItem, IonInput } from "@ionic/angular/standalone";
import { ProductCardComponent } from 'src/app/home/product-card/product-card.component';
import { IngredientService } from 'src/app/services/ingredient-service/ingredient.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [FormsModule, IonGrid, IonRow, IonCol, IonItem, IonInput, ProductCardComponent],
})
export class ProductsListComponent implements OnInit {

  selectedCategoryId: number | null = null;

  products: { product: Product, ingredients: string[] }[] = [];
  filteredProducts: { product: Product, ingredients: string[] }[] = [];
  searchTerm: string = ''; // Termine di ricerca per nome prodotto

  constructor(private sharedData: SharedDataService, private productService: ProductService, private ingredientService: IngredientService) {
    // effect per reagire automaticamente ai cambiamenti della categoria selezionata del signal i shared service
    effect(() => {
      const categoryId = this.sharedData.selectedCategory();
      console.log('-+- ProductsList: Categoria ricevuta:', categoryId);
      this.selectedCategoryId = categoryId;
      console.log("La categoria selezionata è:", this.selectedCategoryId);
      this.onCategoryChanged(categoryId);
    });
  }

  ngOnInit() {
    this.loadAllProducts();
  }

  onCategoryChanged(categoryId: number | null) {
    if (categoryId === null) {
      console.log('++ ProductsList: Caricamento tutti i prodotti');
      this.filteredProducts = [...this.products]; // Mostra tutti i prodotti
    } else if (categoryId === 0) {
      console.log('++ ProductsList: Caricamento prodotti in offerta');
      this.sortProductsOnSale();
    } else if (categoryId > 0) {
      console.log(`++ ProductsList: Caricamento prodotti per categoria ${categoryId}`);
      this.sortProductsByCategory(categoryId);
    }
  }

  sortProductsByCategory(categoryId: number) {
    // Implementa  logica di ordinamento dei prodotti per categoria
    // questa funzione può essere utilizzata per filtrare o ordinare i prodotti in base alla categoria selezionata
    console.log(`Ordinamento dei prodotti per categoria: ${categoryId}`);
    this.filteredProducts = this.products.filter(item => item.product.REF_categoria === categoryId);
    console.log('Prodotti filtrati:', this.filteredProducts);
  }

  sortProductsOnSale() {
    // Implementa la logica di ordinamento dei prodotti in offerta
    console.log(`Ordinamento dei prodotti in offerta`);
    this.filteredProducts = this.products.filter(item => item.product.is_offerta == true);
    console.log('Prodotti filtrati:', this.filteredProducts);
  }

  loadAllProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        if (response.success) {
          console.log('Tutti i prodotti caricati:', response.data);
          // Trasforma i dati nel formato corretto
          this.products = response.data.map((product: Product) => ({
            product: product,
            ingredients: [] // TODO: Implementare il caricamento degli ingredienti
          }));
          this.filteredProducts = [...this.products];
          // Carica gli ingredienti per ogni prodotto
          this.products.forEach(item => {
            this.loadIngredientsForProduct(item.product.ID_prodotto);
          });
        } else {
          console.error('Failed to load all products:', response);
        }
      },
      (error) => {
        console.error('Errore durante il caricamento di tutti i prodotti:', error);
      }
    );
  }

  loadIngredientsForProduct(productId: number) {
    this.ingredientService.getIngredientsForProduct(productId).subscribe(
      (response) => {
        if (response.success) {
          console.log('Ingredienti caricati per il prodotto:', productId, response.data);
          // Trova il prodotto corrispondente e aggiorna gli ingredienti
          const productItem = this.products.find(item => item.product.ID_prodotto === productId);
          if (productItem) {
            productItem.ingredients = response.data.map((ingredient: any) => ingredient.nome_ingrediente);
          }
        } else {
          console.error('Failed to load ingredients for product:', response);
        }
      },
      (error) => {
        console.error('Errore durante il caricamento degli ingredienti per il prodotto:', error);
      }
    );
  }

  // Metodo per filtrare i prodotti in base al nome del prodotto
  filterProductsByName(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;

    if (searchTerm.trim() === '') {
      // Se il campo di ricerca è vuoto, applica il filtro di categoria corrente
      this.onCategoryChanged(this.selectedCategoryId);
    } else {
      // Filtra i prodotti in base al nome del prodotto che contiene il termine di ricerca
      let baseProducts = this.products;

      // Se c'è una categoria selezionata, parti da quei prodotti
      if (this.selectedCategoryId !== null) {
        if (this.selectedCategoryId === 0) {
          baseProducts = this.products.filter(item => item.product.is_offerta == true);
        } else if (this.selectedCategoryId > 0) {
          baseProducts = this.products.filter(item => item.product.REF_categoria === this.selectedCategoryId);
        }
      }

      // Filtra per nome del prodotto
      this.filteredProducts = baseProducts.filter(item =>
        item.product.nome_prodotto.toLowerCase().includes(searchTerm)
      );
    }

    console.log('Prodotti filtrati per nome:', this.filteredProducts);
  }
}

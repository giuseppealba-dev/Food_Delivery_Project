import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, IonItem, IonButton, IonIcon, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { ProductService } from 'src/app/services/product-service/product.service';
import { AddProduct } from 'src/app/interfaces/add-product';
import { IngredientService } from 'src/app/services/ingredient-service/ingredient.service';
import { IngredientModalComponent } from 'src/app/admin/ingredient-modal/ingredient-modal.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonItem, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, IonIcon, IngredientModalComponent],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  isLoading: boolean = false;
  statusMessage: string = '';
  categories: { id: number, name: string }[] = [];
  selectedIngredients: { id: number, name: string }[] = [];
  prodottoAggiunto: string = '';

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private productService: ProductService, private ingredientService: IngredientService, private router: Router) {
    this.addProductForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prezzo: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      url_immagine: ['', [Validators.required, Validators.pattern('https?://.+')]],
      categoria: ['', [Validators.required]],
      percentuale_sconto: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(100|\\d{1,2})')]],
      ingredienti: ['']
    });
    addIcons({ close });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        if (response.success) {
          this.categories = response.data.map((category: any) => ({ id: category.ID_categoria, name: category.nome_categoria }));
        } else {
          console.error('Failed to load categories:', response);
        }
      })
  }

  onAddSubmit() {
    if (this.addProductForm.valid) {
        this.isLoading = true;

        const prodottoDaAggiungere: AddProduct = {
            nome_prodotto: this.addProductForm.get('nome')?.value,
            prezzo: parseFloat(this.addProductForm.get('prezzo')?.value),
            url_immagine: this.addProductForm.get('url_immagine')?.value,
            REF_categoria: parseInt(this.addProductForm.get('categoria')?.value),
            percentuale_sconto: parseInt(this.addProductForm.get('percentuale_sconto')?.value),
        }

        this.productService.addProduct(prodottoDaAggiungere).subscribe(
            (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.statusMessage = 'Prodotto aggiunto con successo!';
                    this.prodottoAggiunto = "(ID: " + response.prodotto_aggiunto.id + ") " + response.prodotto_aggiunto.nome_prodotto + ", prezzo: " + response.prodotto_aggiunto.prezzo + "€ " + "aggiunto.";
                    
                    const idProdottoAggiunto = response.prodotto_aggiunto.id;
                    console.log("ID: " + idProdottoAggiunto + ", lista ingredienti: " + this.selectedIngredients.map(ingredient => ingredient.id));

                    // collega gli ingredienti al prodotto appena aggiunto
                    if (this.selectedIngredients.length > 0) {
                        this.linkIngredientsToProduct(idProdottoAggiunto);
                    }
                    
                    this.addProductForm.reset();
                    this.resetSelectedIngredients();
                } else {
                    this.statusMessage = 'Errore durante l\'aggiunta del prodotto: ' + response.prodotto_aggiunto;
                }
            },
            (error) => {
                this.isLoading = false;
                this.statusMessage = 'Errore di connessione';
                console.error('Errore:', error);
            }
        );
    }
}

private linkIngredientsToProduct(productId: number) {
    const ingredientIds = this.selectedIngredients.map(ingredient => ingredient.id);
    
    this.ingredientService.linkIngredientsToProduct(productId, ingredientIds).subscribe(
        (response) => {
            if (response.success) {
                console.log('Ingredienti collegati al prodotto con successo:', response.message);
            } else {
                console.error('Errore durante il collegamento degli ingredienti al prodotto:', response.message);
            }
        },
        (error) => {
            console.error('Errore di connessione ingredienti:', error);
        }
    );
}

  onIngredientsSelected(selectedIngredient: { id: number, name: string }[]) {
    console.log('Ingredienti ricevuti dal componente padre:', selectedIngredient);
    this.selectedIngredients = selectedIngredient;
  }

  resetSelectedIngredients() {
    this.selectedIngredients = [];
  }

  goBack() {
    this.router.navigate(['/user/gestione_locale']);
  }
}

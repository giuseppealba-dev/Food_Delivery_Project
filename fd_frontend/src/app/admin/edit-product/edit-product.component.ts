import { Component, OnInit, input, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonItem, IonInput, IonButton, IonLabel, IonSelect, IonSelectOption, IonIcon, IngredientModalComponent],
})
export class EditProductComponent implements OnInit {
  // riferimento al prodotto da modificare
  product = input<any>(null);
  // permette di emettere un evento quando il prodotto viene aggiornato
  productUpdated = output<void>();
  // permette di emettere un evento quando l'utente annulla l'operazione di modifica
  editCanceled = output<void>();

  editProductForm: FormGroup;
  isLoading: boolean = false;
  statusMessage: string = '';
  categories: { id: number, name: string }[] = [];
  selectedIngredients: { id: number, name: string }[] = [];

  constructor(
    private categoryService: CategoryService, 
    private fb: FormBuilder, 
    private productService: ProductService, 
    private ingredientService: IngredientService
  ) {
    this.editProductForm = this.fb.group({
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
    if (this.product()) {
      this.populateForm();
      this.loadProductIngredients();
    }
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

  populateForm() {
    if (this.product()) {
      this.editProductForm.patchValue({
        nome: this.product().nome_prodotto,
        prezzo: this.product().prezzo,
        url_immagine: this.product().url_immagine,
        categoria: this.product().REF_categoria,
        percentuale_sconto: this.product().percentuale_offerta || 0
      });
    }
  }

  loadProductIngredients() {
    if (this.product()) {
      this.ingredientService.getIngredientsForProduct(this.product().ID_prodotto).subscribe(
        (response) => {
          if (response.success) {
            this.selectedIngredients = response.data.map((ingredient: any) => ({
              id: ingredient.ID_ingrediente,
              name: ingredient.nome_ingrediente
            }));
          }
        },
        (error) => {
          console.error('Errore nel caricamento ingredienti:', error);
        }
      );
    }
  }

  onEditSubmit() {
    if (this.editProductForm.valid && this.product()) {
        this.isLoading = true;

        const prodottoAggiornato: AddProduct = {
            nome_prodotto: this.editProductForm.get('nome')?.value,
            prezzo: parseFloat(this.editProductForm.get('prezzo')?.value),
            url_immagine: this.editProductForm.get('url_immagine')?.value,
            REF_categoria: parseInt(this.editProductForm.get('categoria')?.value),
            percentuale_sconto: parseInt(this.editProductForm.get('percentuale_sconto')?.value),
        }

        this.productService.updateProduct(this.product().ID_prodotto, prodottoAggiornato).subscribe(
            (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.statusMessage = 'Prodotto aggiornato con successo!';
                    
                    // aggiorna sempre gli ingredienti (anche se la lista è vuota per rimuoverli tutti)
                    this.linkIngredientsToProduct(this.product().ID_prodotto);
                    
                    // emetti l'evento per informare il componente padre con un timeout
                    setTimeout(() => {
                        this.productUpdated.emit();
                    }, 1000);
                } else {
                    this.statusMessage = 'Errore durante l\'aggiornamento del prodotto: ' + response.message;
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
                if (ingredientIds.length > 0) {
                    console.log('Ingredienti collegati al prodotto con successo:', response.message);
                } else {
                    console.log('Tutti gli ingredienti rimossi dal prodotto con successo:', response.message);
                }
            } else {
                console.error('Errore durante l\'aggiornamento degli ingredienti del prodotto:', response.message);
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

  onCancel() {
    this.editCanceled.emit();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { AddCategory } from 'src/app/interfaces/add-category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonItem, IonInput, IonButton, IonIcon],
  standalone: true
})
export class AddCategoryComponent implements OnInit {
  addCategoryForm: FormGroup;
  isLoading: boolean = false;
  statusMessage: string = '';
  categoriaAggiunta: string = '';

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private router: Router) {
    this.addCategoryForm = this.fb.group({
      nome_categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
    addIcons({ close });
  }

  ngOnInit() {}

  onAddSubmit() {
    if (this.addCategoryForm.valid) {
        this.isLoading = true;

        const categoriaDaAggiungere: AddCategory = {
            nome_categoria: this.addCategoryForm.get('nome_categoria')?.value,
        }

        this.categoryService.addCategory(categoriaDaAggiungere).subscribe(
            (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.statusMessage = 'Categoria aggiunta con successo!';
                    this.categoriaAggiunta = "(ID: " + response.categoria_aggiunta.id + ") " + response.categoria_aggiunta.nome_categoria + " aggiunta.";
                    this.addCategoryForm.reset();
                } else {
                    this.statusMessage = 'Errore durante l\'aggiunta della categoria: ' + response.message;
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

  goBack() {
    this.router.navigate(['/user/gestione_locale']);
  }
}

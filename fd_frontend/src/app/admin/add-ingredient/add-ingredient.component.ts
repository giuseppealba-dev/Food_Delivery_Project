import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { IngredientService } from 'src/app/services/ingredient-service/ingredient.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { AddIngredient } from 'src/app/interfaces/add-ingredient';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonItem, IonInput, IonButton, IonIcon],
})
export class AddIngredientComponent implements OnInit {
  addIngredientForm: FormGroup;
  isLoading: boolean = false;
  statusMessage: string = '';
  ingredienteAggiunto: string = '';

  constructor(private fb: FormBuilder, private ingredientService: IngredientService, private router: Router) {
    this.addIngredientForm = this.fb.group({
      nome_ingrediente: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
    addIcons({ close });
  }

  ngOnInit() {}

  onAddSubmit() {
    if (this.addIngredientForm.valid) {
        this.isLoading = true;

        const ingredienteDaAggiungere: AddIngredient = {
            nome_ingrediente: this.addIngredientForm.get('nome_ingrediente')?.value,
        }

        this.ingredientService.addIngredient(ingredienteDaAggiungere).subscribe(
            (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.statusMessage = 'Ingrediente aggiunto con successo!';
                    this.ingredienteAggiunto = "(ID: " + response.ingrediente_aggiunto.id + ") " + response.ingrediente_aggiunto.nome_ingrediente + " aggiunto.";
                    this.addIngredientForm.reset();
                } else {
                    this.statusMessage = 'Errore durante l\'aggiunta dell\'ingrediente: ' + response.message;
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

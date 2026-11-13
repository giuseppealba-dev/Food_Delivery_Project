import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, IonItem, IonButton, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { IndirizzoService } from 'src/app/services/indirizzo-service/indirizzo.service';
import { AddIndirizzo } from 'src/app/interfaces/add-indirizzo';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-add-indirizzo',
  templateUrl: './add-indirizzo.component.html',
  styleUrls: ['./add-indirizzo.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonItem, IonInput, IonButton, IonIcon, IonTextarea],
})
export class AddIndirizzoComponent implements OnInit {
  addIndirizzoForm: FormGroup;
  isLoading: boolean = false;
  statusMessage: string = '';
  indirizzoAggiunto: string = '';

  constructor(
    private fb: FormBuilder,
    private indirizzoService: IndirizzoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.addIndirizzoForm = this.fb.group({
      via: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      numero_civico: ['', [Validators.required, Validators.maxLength(10)]],
      citta: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cap: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      note_consegna: ['', [Validators.maxLength(200)]]
    });
    addIcons({ close });
  }

  ngOnInit() {
  }

  onAddSubmit() {
    if (this.addIndirizzoForm.valid) {
      this.isLoading = true;

      // Ottieni l'ID dell'utente autenticato
      const currentUserId = this.authService.getCurrentUserId();
      
      if (!currentUserId) {
        this.statusMessage = 'Errore: utente non autenticato';
        this.isLoading = false;
        return;
      }

      const indirizzoDaAggiungere: AddIndirizzo = {
        REF_Utente: currentUserId,
        via: this.addIndirizzoForm.get('via')?.value,
        numero_civico: this.addIndirizzoForm.get('numero_civico')?.value,
        citta: this.addIndirizzoForm.get('citta')?.value,
        cap: this.addIndirizzoForm.get('cap')?.value,
        note_consegna: this.addIndirizzoForm.get('note_consegna')?.value || ''
      };

      this.indirizzoService.addIndirizzo(indirizzoDaAggiungere).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success) {
            this.statusMessage = 'Indirizzo aggiunto con successo!';
            this.indirizzoAggiunto = `Indirizzo aggiunto: ${response.data?.via} ${response.data?.numero_civico}, ${response.data?.citta} ${response.data?.cap}`;
            this.addIndirizzoForm.reset();
            // Reindirizza alla lista degli indirizzi dopo l'aggiunta
            setTimeout(() => {
              this.goBack();
            }, 500); // Attende 0.5 secondi per mostrare il messaggio di successo
          } else {
            this.statusMessage = 'Errore durante l\'aggiunta dell\'indirizzo: ' + response.message;
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
    this.router.navigate(['/user/profile/listIndirizzi']);
  }
}

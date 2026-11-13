import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
  IonAlert
} from "@ionic/angular/standalone";
import { IndirizzoService } from 'src/app/services/indirizzo-service/indirizzo.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Indirizzo } from 'src/app/interfaces/indirizzo';
import { addIcons } from 'ionicons';
import { homeOutline, trash, add, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-list-indirizzo',
  templateUrl: './list-indirizzo.component.html',
  styleUrls: ['./list-indirizzo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonText,
    IonAlert
  ]
})
export class ListIndirizzoComponent implements OnInit {
  indirizzi: Indirizzo[] = [];
  isLoading: boolean = true;
  showDeleteConfirmation: boolean = false;
  indirizzoToDelete: Indirizzo | null = null;

  constructor(
    private router: Router,
    private indirizzoService: IndirizzoService,
    private authService: AuthService
  ) {
    addIcons({ homeOutline, trash, add, arrowBack });
  }

  ngOnInit() {
    this.loadIndirizzi();
  }

  loadIndirizzi() {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.isLoading = true;
      this.indirizzoService.getIndirizziByUser(currentUserId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.indirizzi = response.data;
          } else {
            console.error('Errore nel caricamento degli indirizzi:', response.message);
            this.indirizzi = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore nel caricamento degli indirizzi:', error);
          this.indirizzi = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      console.error('Utente non autenticato');
    }
  }

  navigateToAddIndirizzo() {
    this.router.navigate(['/user/profile/addIndirizzo']);
  }

  navigateBack() {
    this.router.navigate(['/user/profile/dashboard']);
  }

  showDeleteIndirizzoConfirmation(indirizzo: Indirizzo) {
    this.indirizzoToDelete = indirizzo;
    this.showDeleteConfirmation = true;
  }

  hideDeleteConfirmation() {
    this.showDeleteConfirmation = false;
    this.indirizzoToDelete = null;
  }

  handleDeleteAlertResponse(event: any) {
    if (event.detail.role === 'confirm' && this.indirizzoToDelete) {
      this.deleteIndirizzo(this.indirizzoToDelete);
    }
    this.hideDeleteConfirmation();
  }

  private deleteIndirizzo(indirizzo: Indirizzo) {
    if (indirizzo.ID_indirizzo) {
      this.indirizzoService.deleteIndirizzo(indirizzo.ID_indirizzo).subscribe({
        next: (response) => {
          if (response.success) {
            // Rimuovi l'indirizzo dalla lista locale
            this.indirizzi = this.indirizzi.filter(i => i.ID_indirizzo !== indirizzo.ID_indirizzo);
          } else {
            console.error('Errore nell\'eliminazione dell\'indirizzo:', response.message);
          }
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione dell\'indirizzo:', error);
        }
      });
    }
  }

  isIndirizziEmpty(): boolean {
    return this.indirizzi.length === 0;
  }
}

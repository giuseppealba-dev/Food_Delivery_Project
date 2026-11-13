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
  IonBadge,
  IonAccordion,
  IonAccordionGroup
} from "@ionic/angular/standalone";
import { OrdineService } from 'src/app/services/ordine-service/ordine.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Ordine } from 'src/app/interfaces/ordine';
import { ProdottoOrdine } from 'src/app/interfaces/prodotto-ordine';
import { StatoOrdine } from 'src/app/interfaces/stato-ordine';
import { addIcons } from 'ionicons';
import { receiptOutline, arrowBack, calendarOutline, timeOutline, locationOutline, pricetagOutline, restaurantOutline } from 'ionicons/icons';

@Component({
  selector: 'app-storico-ordini',
  templateUrl: './storico-ordini.component.html',
  styleUrls: ['./storico-ordini.component.scss'],
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
    IonBadge,
    IonAccordion,
    IonAccordionGroup
  ]
})
export class StoricoOrdiniComponent implements OnInit {
  ordini: Ordine[] = [];
  ordiniConProdotti: { [key: number]: ProdottoOrdine[] } = {};
  isLoading: boolean = true;
  StatoOrdine = StatoOrdine; // Espone l'enum al template

  constructor(
    private router: Router,
    private ordineService: OrdineService,
    private authService: AuthService
  ) {
    addIcons({ 
      receiptOutline, 
      arrowBack, 
      calendarOutline, 
      timeOutline, 
      locationOutline, 
      pricetagOutline, 
      restaurantOutline 
    });
  }

  ngOnInit() {
    this.loadOrdini();
  }

  loadOrdini() {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.isLoading = true;
      this.ordineService.getUserOrders(currentUserId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.ordini = response.data;
            // Carica i prodotti per ogni ordine
            this.loadProdottiPerOrdini();
          } else {
            console.error('Errore nel caricamento degli ordini:', response);
            this.ordini = [];
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Errore nel caricamento degli ordini:', error);
          this.ordini = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      console.error('Utente non autenticato');
    }
  }

  loadProdottiPerOrdini() {
    if (this.ordini.length === 0) {
      this.isLoading = false;
      return;
    }

    let completedRequests = 0;
    const totalRequests = this.ordini.length;

    this.ordini.forEach(ordine => {
      if (ordine.ID_ordine) {
        this.ordineService.getOrderProducts(ordine.ID_ordine).subscribe({
          next: (response) => {
            if (response.success && response.data) {
              this.ordiniConProdotti[ordine.ID_ordine!] = response.data;
            }
            completedRequests++;
            if (completedRequests === totalRequests) {
              this.isLoading = false;
            }
          },
          error: (error) => {
            console.error(`Errore nel caricamento dei prodotti per l'ordine ${ordine.ID_ordine}:`, error);
            completedRequests++;
            if (completedRequests === totalRequests) {
              this.isLoading = false;
            }
          }
        });
      }
    });
  }

  navigateBack() {
    this.router.navigate(['/user/profile/dashboard']);
  }

  isOrdiniEmpty(): boolean {
    return this.ordini.length === 0;
  }

  getStatoOrdineColor(stato: StatoOrdine): string {
    switch (stato) {
      case StatoOrdine.ORDINATO:
        return 'warning';
      case StatoOrdine.ACCETTATO:
        return 'primary';
      case StatoOrdine.RIFIUTATO:
        return 'danger';
      case StatoOrdine.IN_PREPARAZIONE:
        return 'secondary';
      case StatoOrdine.IN_CONSEGNA:
        return 'medium';
      case StatoOrdine.CONSEGNATO:
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatoOrdineText(stato: StatoOrdine): string {
    switch (stato) {
      case StatoOrdine.ORDINATO:
        return 'Ordinato';
      case StatoOrdine.ACCETTATO:
        return 'Accettato';
      case StatoOrdine.RIFIUTATO:
        return 'Rifiutato';
      case StatoOrdine.IN_PREPARAZIONE:
        return 'In Preparazione';
      case StatoOrdine.IN_CONSEGNA:
        return 'In Consegna';
      case StatoOrdine.CONSEGNATO:
        return 'Consegnato';
      default:
        return 'Sconosciuto';
    }
  }

  getProdottiOrdine(ordineId: number): ProdottoOrdine[] {
    return this.ordiniConProdotti[ordineId] || [];
  }

  formatData(data: string): string {
    return new Date(data).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatOra(ora: string): string {
    return ora.substring(11, 16); // HH:MM
  }

  formatIndirizzo(ordine: Ordine): string {
    if (ordine.via && ordine.numero_civico && ordine.citta) {
      return `${ordine.via}, ${ordine.numero_civico} - ${ordine.citta} ${ordine.cap}`;
    }
    return 'Indirizzo non disponibile';
  }

  // Metodi di utilità per convertire stringhe in numeri
  toNumber(value: string | number): number {
    if (typeof value === 'string') {
      // Rimuove eventuali spazi e sostituisce la virgola con il punto
      const cleanValue = value.replace(/\s/g, '').replace(',', '.');
      return parseFloat(cleanValue) || 0;
    }
    return value || 0;
  }

  // Metodo per generare un tracker per il for, dato che il solo ID da problemi
  getProductTrackId(prodotto: ProdottoOrdine): string {
    return `${prodotto.REF_prodotto}-${prodotto.note || 'no-notes'}`;
  }
}

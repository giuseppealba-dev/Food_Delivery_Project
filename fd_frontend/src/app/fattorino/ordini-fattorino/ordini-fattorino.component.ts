import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonAccordionGroup,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert
} from "@ionic/angular/standalone";
import { OrdineService } from 'src/app/services/ordine-service/ordine.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Ordine } from 'src/app/interfaces/ordine';
import { ProdottoOrdine } from 'src/app/interfaces/prodotto-ordine';
import { StatoOrdine } from 'src/app/interfaces/stato-ordine';
import { addIcons } from 'ionicons';
import { 
  receiptOutline, 
  calendarOutline, 
  timeOutline, 
  locationOutline, 
  pricetagOutline, 
  restaurantOutline,
  personOutline,
  callOutline,
  mailOutline,
  searchOutline,
  carOutline,
  checkmarkCircleOutline,
  playCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-ordini-fattorino',
  templateUrl: './ordini-fattorino.component.html',
  styleUrls: ['./ordini-fattorino.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonAccordionGroup,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonAlert
  ]
})
export class OrdiniFattorinoComponent implements OnInit {
  ordini: Ordine[] = [];
  filteredOrdini: Ordine[] = [];
  ordiniConProdotti: { [key: number]: ProdottoOrdine[] } = {};
  isLoading: boolean = true;
  searchTerm: string = '';
  StatoOrdine = StatoOrdine;
  
  // Proprietà per l'alert inline
  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';
  ordineIdInSospeso: number | null = null;
  alertType: 'presa-carico' | 'consegna' = 'presa-carico';
  alertButtons = [
    {
      text: 'Annulla',
      role: 'cancel',
      handler: () => {
        this.annullaAzione();
      }
    },
    {
      text: 'Conferma',
      handler: () => {
        this.confermaAzione();
      }
    }
  ];

  constructor(
    private ordineService: OrdineService,
    private authService: AuthService
  ) {
    addIcons({ 
      receiptOutline, 
      calendarOutline, 
      timeOutline, 
      locationOutline, 
      pricetagOutline, 
      restaurantOutline,
      personOutline,
      callOutline,
      mailOutline,
      searchOutline,
      carOutline,
      checkmarkCircleOutline,
      playCircleOutline
    });
  }

  ngOnInit() {
    this.loadOrdiniPerFattorino();
  }

  loadOrdiniPerFattorino() {
    this.isLoading = true;
    this.ordineService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filtra solo ordini "IN_PREPARAZIONE" e "IN_CONSEGNA"
          this.ordini = response.data.filter((ordine: Ordine) => 
            ordine.stato === StatoOrdine.IN_PREPARAZIONE || 
            ordine.stato === StatoOrdine.IN_CONSEGNA
          );
          this.applyFilters();
          this.loadProdottiPerOrdini();
        } else {
          console.error('Errore nel caricamento degli ordini:', response);
          this.ordini = [];
          this.filteredOrdini = [];
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento degli ordini:', error);
        this.ordini = [];
        this.filteredOrdini = [];
        this.isLoading = false;
      }
    });
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

  filterOrdiniById(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.ordini];

    // Applica filtro di ricerca per ID
    if (this.searchTerm !== '') {
      filtered = filtered.filter(ordine =>
        ordine.ID_ordine?.toString().includes(this.searchTerm)
      );
    }

    this.filteredOrdini = filtered;
  }

  isOrdiniEmpty(): boolean {
    return this.filteredOrdini.length === 0;
  }

  getStatoOrdineColor(stato: StatoOrdine): string {
    switch (stato) {
      case StatoOrdine.IN_PREPARAZIONE:
        return 'warning';
      case StatoOrdine.IN_CONSEGNA:
        return 'primary';
      case StatoOrdine.CONSEGNATO:
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatoOrdineText(stato: StatoOrdine): string {
    switch (stato) {
      case StatoOrdine.IN_PREPARAZIONE:
        return 'Pronto per Consegna';
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

  formatNomeCompleto(ordine: Ordine): string {
    if (ordine.nome && ordine.cognome) {
      return `${ordine.nome} ${ordine.cognome}`;
    }
    return 'Nome non disponibile';
  }

  toNumber(value: string | number): number {
    if (typeof value === 'string') {
      const cleanValue = value.replace(/\s/g, '').replace(',', '.');
      return parseFloat(cleanValue) || 0;
    }
    return value || 0;
  }

  getProductTrackId(prodotto: ProdottoOrdine): string {
    return `${prodotto.REF_prodotto}-${prodotto.note || 'no-notes'}`;
  }

  prendiInCarico(ordineId: number) {
    this.ordineIdInSospeso = ordineId;
    this.alertType = 'presa-carico';
    this.alertHeader = 'Conferma Presa in Carico';
    this.alertMessage = `Vuoi prendere in carico l'ordine #${ordineId}?`;
    this.isAlertOpen = true;
  }

  confermaConsegna(ordineId: number) {
    this.ordineIdInSospeso = ordineId;
    this.alertType = 'consegna';
    this.alertHeader = 'Conferma Consegna';
    this.alertMessage = `Confermi di aver effettuato la consegna dell'ordine #${ordineId}?`;
    this.isAlertOpen = true;
  }

  onAlertDidDismiss(event: any) {
    this.isAlertOpen = false;
    this.ordineIdInSospeso = null;
  }

  confermaAzione() {
    if (this.ordineIdInSospeso) {
      if (this.alertType === 'presa-carico') {
        this.eseguiPresaInCarico(this.ordineIdInSospeso);
      } else if (this.alertType === 'consegna') {
        this.eseguiConsegna(this.ordineIdInSospeso);
      }
    }
    this.isAlertOpen = false;
    this.ordineIdInSospeso = null;
  }

  annullaAzione() {
    this.isAlertOpen = false;
    this.ordineIdInSospeso = null;
  }

  private eseguiPresaInCarico(ordineId: number) {
    // Ottieni l'ID dell'utente corrente (fattorino)
    const currentUser = this.authService.getCurrentUser();
    const fattorinoId = currentUser?.ID_utente;
    
    if (!fattorinoId) {
      console.error('ID fattorino non disponibile');
      return;
    }

    this.ordineService.updateOrderStatus(ordineId, StatoOrdine.IN_CONSEGNA.toString(), fattorinoId).subscribe({
      next: (response) => {
        if (response.success) {
          const ordine = this.ordini.find(o => o.ID_ordine === ordineId);
          if (ordine) {
            ordine.stato = StatoOrdine.IN_CONSEGNA;
            ordine.REF_fattorino = fattorinoId;
          }
          console.log('Ordine preso in carico con successo');
        } else {
          console.error('Errore nel prendere in carico l\'ordine:', response);
        }
      },
      error: (error) => {
        console.error('Errore nel prendere in carico l\'ordine:', error);
      }
    });
  }

  private eseguiConsegna(ordineId: number) {
    this.ordineService.updateOrderStatus(ordineId, StatoOrdine.CONSEGNATO.toString()).subscribe({
      next: (response) => {
        if (response.success) {
          // Rimuovi l'ordine dalla lista (è stato consegnato)
          this.ordini = this.ordini.filter(o => o.ID_ordine !== ordineId);
          this.applyFilters();
          console.log('Consegna confermata con successo');
        } else {
          console.error('Errore nella conferma della consegna:', response);
        }
      },
      error: (error) => {
        console.error('Errore nella conferma della consegna:', error);
      }
    });
  }
}

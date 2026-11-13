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
  IonCol
} from "@ionic/angular/standalone";
import { OrdineService } from 'src/app/services/ordine-service/ordine.service';
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
  eyeOffOutline,
  eyeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  carOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-gestione-ordini',
  templateUrl: './gestione-ordini.component.html',
  styleUrls: ['./gestione-ordini.component.scss'],
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
    IonCol
  ]
})
export class GestioneOrdiniComponent implements OnInit {
  ordini: Ordine[] = [];
  filteredOrdini: Ordine[] = [];
  ordiniConProdotti: { [key: number]: ProdottoOrdine[] } = {};
  isLoading: boolean = true;
  searchTerm: string = '';
  nascondiOrdiniConsegnati: boolean = false;
  StatoOrdine = StatoOrdine;
  mostraSoloNonConsegnati: boolean = true;

  constructor(private ordineService: OrdineService) {
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
      eyeOffOutline,
      eyeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      carOutline
    });
  }

  ngOnInit() {
    this.loadAllOrdini();
  }

  loadAllOrdini() {
    this.isLoading = true;
    this.ordineService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.ordini = response.data;
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

  toggleOrdiniConsegnati() {
    this.nascondiOrdiniConsegnati = !this.nascondiOrdiniConsegnati;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.ordini];

    // applica filtro per nascondere ordini consegnati e rifiutati
    if (this.nascondiOrdiniConsegnati) {
      filtered = filtered.filter(ordine => 
        ordine.stato !== StatoOrdine.CONSEGNATO && 
        ordine.stato !== StatoOrdine.RIFIUTATO
      );
    }

    // applica filtro di ricerca per ID
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

  formatNomeCompleto(ordine: Ordine): string {
    if (ordine.nome && ordine.cognome) {
      return `${ordine.nome} ${ordine.cognome}`;
    }
    return 'Nome non disponibile';
  }

  formatNomeFattorino(ordine: Ordine): string {
    if (ordine.nome_fattorino && ordine.cognome_fattorino) {
      return `${ordine.nome_fattorino} ${ordine.cognome_fattorino}`;
    }
    return 'Non assegnato';
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

  updateOrderStatus(ordineId: number, newStatus: StatoOrdine) {
    this.ordineService.updateOrderStatus(ordineId, newStatus.toString()).subscribe({
      next: (response) => {
        if (response.success) {
          // aggiorna lo stato locale
          const ordine = this.ordini.find(o => o.ID_ordine === ordineId);
          if (ordine) {
            ordine.stato = newStatus;
          }
          console.log('Stato ordine aggiornato con successo');
        } else {
          console.error('Errore nell\'aggiornamento dello stato:', response);
        }
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento dello stato:', error);
      }
    });
  }

  toggleMostraConsegnati() {
    this.mostraSoloNonConsegnati = !this.mostraSoloNonConsegnati;
    this.filtraOrdini();
  }

  filtraOrdini() {
    if (this.mostraSoloNonConsegnati) {
      this.filteredOrdini = this.ordini.filter(ordine => ordine.stato !== StatoOrdine.CONSEGNATO);
    } else {
      this.filteredOrdini = [...this.ordini];
    }
  }
}

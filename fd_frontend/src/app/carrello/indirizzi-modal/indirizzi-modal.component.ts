import { Component, OnInit, ViewChild, output, OnDestroy } from '@angular/core';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonContent, IonTitle, IonRadio, IonRadioGroup, IonText, IonIcon } from "@ionic/angular/standalone";
import { OverlayEventDetail } from '@ionic/core/components';
import { IndirizzoService } from '../../services/indirizzo-service/indirizzo.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Indirizzo } from '../../interfaces/indirizzo';
import { addIcons } from 'ionicons';
import { homeOutline, locationOutline, chatbubbleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-indirizzi-modal',
  templateUrl: './indirizzi-modal.component.html',
  styleUrls: ['./indirizzi-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, IonRadio, IonRadioGroup, IonText, IonIcon, IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonContent, IonTitle]
})
export class IndirizziModalComponent implements OnInit, OnDestroy {

  @ViewChild(IonModal) modal!: IonModal;
  indirizzoSelected = output<Indirizzo>();

  indirizzi: Indirizzo[] = [];
  filteredIndirizzi: Indirizzo[] = [];
  searchTerm: string = '';
  selectedIndirizzo: Indirizzo | null = null;
  selectedIndirizzoId: number | null = null;
  isOpen: boolean = false;
  private authSubscription?: Subscription;

  constructor(
    private indirizzoService: IndirizzoService,
    private authService: AuthService
  ) {
    addIcons({homeOutline,locationOutline,chatbubbleOutline});
  }

  ngOnInit() {
    // Carica gli indirizzi inizialmente
    this.loadIndirizzi();
    
    // Sottoscrivi ai cambiamenti dello stato di autenticazione
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        // Quando l'utente si autentica, ricarica gli indirizzi
        this.loadIndirizzi();
      } else {
        // Quando l'utente si disconnette, svuota la lista
        this.clearIndirizzi();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  clearIndirizzi() {
    this.indirizzi = [];
    this.filteredIndirizzi = [];
    this.resetSelections();
  }

  loadIndirizzi() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.ID_utente) {
      console.log('Caricamento indirizzi per utente ID:', currentUser.ID_utente);
      this.indirizzoService.getIndirizziByUser(currentUser.ID_utente).subscribe(
        (response) => {
          if (response.success && response.data) {
            this.indirizzi = response.data;
            this.filteredIndirizzi = [...this.indirizzi];
            console.log('Indirizzi caricati:', response.data);
          } else {
            console.error('Errore nel caricamento degli indirizzi:', response);
          }
        },
        (error) => {
          console.error('Errore nella chiamata API:', error);
        }
      );
    } else {
      console.error('Utente non autenticato o ID_utente mancante');
    }
  }

  // metodo per gestire la selezione dell'indirizzo
  onIndirizzoSelectionChange(event: any) {
    const selectedId = parseInt(event.detail.value);
    this.selectedIndirizzoId = selectedId;
    this.selectedIndirizzo = this.indirizzi.find(indirizzo => indirizzo.ID_indirizzo === selectedId) || null;
    console.log('Indirizzo selezionato:', this.selectedIndirizzo);
  }

  // emtodo per cercare gli indirizzi all'interno della lista
  filterIndirizzi(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;

    if (searchTerm.trim() === '') {
      this.filteredIndirizzi = [...this.indirizzi];
    } else {
      // filtra gli indirizzi in base a via, città o note
      this.filteredIndirizzi = this.indirizzi.filter(indirizzo =>
        indirizzo.via.toLowerCase().includes(searchTerm) ||
        indirizzo.citta.toLowerCase().includes(searchTerm) ||
        (indirizzo.note_consegna && indirizzo.note_consegna.toLowerCase().includes(searchTerm))
      );
    }
  }

  formatIndirizzo(indirizzo: Indirizzo): string {
    return `${indirizzo.via}, ${indirizzo.numero_civico} - ${indirizzo.citta} (${indirizzo.cap})`;
  }

  // Modale
  cancel() {
    this.resetSelections();
    this.close();
  }

  confirm() {
    if (this.selectedIndirizzo) {
      this.indirizzoSelected.emit(this.selectedIndirizzo);
      this.close();
    }
    this.resetSelections();
  }

  resetSelections() {
    this.selectedIndirizzo = null;
    this.selectedIndirizzoId = null;
    this.searchTerm = '';
    this.filteredIndirizzi = [...this.indirizzi];
  }

  // Gestione dell'evento di chiusura del modale
  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      console.log('Indirizzo selezionato:', event.detail.data);
    }
  }

  // Gestione dell'evento dopo la chiusura del modale
  onDidDismiss(event: CustomEvent<OverlayEventDetail>) {
    // Resetta sempre isOpen a false quando la modale si chiude
    // indipendentemente dal modo in cui è stata chiusa
    this.isOpen = false;
    console.log('Modale chiusa, isOpen resettato a false');
  }

  // Metodo chiamato quando il modale viene presentato
  onModalPresent() {
    console.log('Modale aperto, ricarico gli indirizzi...');
    this.loadIndirizzi();
  }

  // Metodo per aprire il modale
  open() {
    this.isOpen = true;
  }

  // Metodo per chiudere il modale
  close() {
    this.isOpen = false;
    console.log('Modale chiusa manualmente, isOpen resettato a false');
  }
}

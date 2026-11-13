import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { CartElementComponent } from '../cart-element/cart-element.component';
import { IndirizziModalComponent } from '../indirizzi-modal/indirizzi-modal.component';
import { CarrelloService } from '../../services/carrello-service/carrello.service';
import { OrdineService } from '../../services/ordine-service/ordine.service';
import { CartItem } from '../../interfaces/cart-item';
import { Indirizzo } from '../../interfaces/indirizzo';
import { RoleEnum } from '../../interfaces/role-enum';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { cartOutline, trash, checkmarkCircle, mapOutline, alertCircle, close } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
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
    IonAlert,
    CartElementComponent,
    IndirizziModalComponent
  ]
})
export class CartListComponent implements OnInit, OnDestroy {
  @ViewChild(IndirizziModalComponent) indirizziModal!: IndirizziModalComponent;
  
  showClearConfirmation: boolean = false;
  canEffettuaOrdine: boolean = false;
  selectedIndirizzo: Indirizzo | null = null;
  currentUserId: number | null = null;
  isEffettuaOrdine: boolean = false;
  
  // Proprietà per i messaggi di stato
  statusMessage: string = '';
  isSuccess: boolean = false;
  ordineCreato: boolean = false;

  private authSubscription?: Subscription;
  private authStateSubscription?: Subscription;

  constructor(
    public carrelloService: CarrelloService,
    private authService: AuthService,
    private ordineService: OrdineService
  ) {
    addIcons({cartOutline,close,trash,mapOutline,checkmarkCircle,alertCircle});
  }

  ngOnInit() {
    
    // Solo per il ruolo utente manteniamo la subscription (AuthService non migrato ancora)
    // TODO: Migrare AuthService a Signal e rimuovere questa subscription
    this.authSubscription = this.authService.accountRole$.subscribe(role => {
      this.canEffettuaOrdine = this.authService.isLoggedIn() && role === RoleEnum.UTENTE;
      
      // CHATGPT: causava problemi con la selezione dell'indirizzo
      // Controlla se è cambiato l'utente
      // Questo codice serve per resettare l'indirizzo selezionato quando l'utente cambia
      const currentUser = this.authService.getCurrentUser();
      const newUserId = currentUser?.ID_utente || null;
      
      if (this.currentUserId !== null && this.currentUserId !== newUserId) {
        // È cambiato l'utente, resetta l'indirizzo selezionato
        this.selectedIndirizzo = null;
        console.log('Cambiato utente, indirizzo selezionato resettato');
      }
      
      this.currentUserId = newUserId;
    });

    this.authStateSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        // Quando l'utente si disconnette, resetta l'indirizzo selezionato
        this.selectedIndirizzo = null;
        this.currentUserId = null;
        console.log('Utente disconnesso, indirizzo selezionato resettato');
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.authStateSubscription?.unsubscribe();
  }

  // gestisce l'aumento della quantità di un item
  onIncreaseQuantity(cartItem: CartItem): void {
    this.carrelloService.updateQuantity(
      cartItem.id_prodotto,
      cartItem.quantity + 1,
      cartItem.notes
    );
  }

  // gestisce la riduzione della quantità di un item
  onDecreaseQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.carrelloService.updateQuantity(
        cartItem.id_prodotto,
        cartItem.quantity - 1,
        cartItem.notes
      );
    } else {
      // se la quantità è 1, rimuovi l'item dal carrello (anche se viene gestita da updatequantity di CarrelloService)
      this.carrelloService.removeFromCart(cartItem.id_prodotto, cartItem.notes);
    }
  }

  // gestisce la rimozione di un item dal carrello
  onRemoveItem(cartItem: CartItem): void {
    this.carrelloService.removeFromCart(cartItem.id_prodotto, cartItem.notes);
  }

  // Mostra alert di conferma per svuotare il carrello
  showClearCartConfirmation(): void {
    this.showClearConfirmation = true;
  }

  // nasconde l'alert di conferma
  hideClearCartConfirmation(): void {
    this.showClearConfirmation = false;
  }

  // Gestisce la risposta dell'alert
  // serve per confermare o annullare l'azione di svuotamento del carrello
  handleAlertResponse(event: any): void {
    if (event.detail.role === 'confirm') {
      this.clearCart();
    }
    this.hideClearCartConfirmation();
  }

  // svuota l'intero carrello
  private clearCart(): void {
    this.carrelloService.clearCart();
  }

  selectIndirizzo(): void {
    console.log('Apertura modale selezione indirizzo');
    this.indirizziModal.open();
  }

  onIndirizzoSelected(indirizzo: Indirizzo): void {
    this.selectedIndirizzo = indirizzo;
    console.log('Indirizzo selezionato:', indirizzo);
  }

  effettuaOrdine(): void {
    // sono da mettere anche se sono già rispettati
    // altrimenti da problemi successivamente, poichè possono essere null
    if (!this.selectedIndirizzo) {
      this.showErrorMessage('Seleziona un indirizzo di consegna prima di effettuare l\'ordine');
      return;
    }

    if (!this.currentUserId) {
      this.showErrorMessage('Errore: utente non identificato');
      return;
    }

    if (this.carrelloService.cartItems().length === 0) {
      this.showErrorMessage('Il carrello è vuoto');
      return;
    }

    this.isEffettuaOrdine = true;
    this.clearStatusMessage();
    const cartItems = this.carrelloService.getCartItems();

    this.ordineService.createOrder(cartItems, this.currentUserId, this.selectedIndirizzo.ID_indirizzo!).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessMessage('Ordine effettuato con successo!');
          this.ordineCreato = true;
          console.log('Ordine creato:', response.data);
          
          // svuota il carrello dopo un ordine completato con successo
          this.carrelloService.clearCart();
          
          // rreset dell'indirizzo selezionato
          this.selectedIndirizzo = null;

          // pulisce il messaggio di success dopo 3 secondi
          setTimeout(() => {
            this.clearStatusMessage(); // pulisce il messaggio di successo dopo 3 second
          }, 3000);

        } else {
          this.showErrorMessage('Errore nella creazione dell\'ordine: ' + response.message);
        }
        this.isEffettuaOrdine = false;
      },
      error: (error) => {
        console.error('Errore nella creazione dell\'ordine:', error);
        this.showErrorMessage('Errore nella creazione dell\'ordine. Riprova più tardi.');
        this.isEffettuaOrdine = false;
      }
    });
  }

  isCartEmpty(): boolean {
    return this.carrelloService.cartItems().length === 0;
  }

  // Metodi per gestire i messaggi di stato
  private showSuccessMessage(message: string): void {
    this.statusMessage = message;
    this.isSuccess = true;
  }

  private showErrorMessage(message: string): void {
    this.statusMessage = message;
    this.isSuccess = false;
  }

  private clearStatusMessage(): void {
    this.statusMessage = '';
    this.isSuccess = false;
    this.ordineCreato = false;
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../interfaces/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {
  // Signal privato per gli item del carrello
  private cartItemsSignal = signal<CartItem[]>([]);

  // signal pubblici read-only
  // Serve per leggere li item del carrello al di fuori del servizio
  // riferendosi al signal del servizio
  public readonly cartItems = this.cartItemsSignal.asReadonly();

  // computed signal per il conteggio totale
  public readonly cartCount = computed(() =>
    this.cartItemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  // computed signal per il prezzo totale
  public readonly totalPrice = computed(() =>
    this.cartItemsSignal().reduce((total, item) => total + (item.prezzo * item.quantity), 0)
  );

  constructor() {
    // Carica il carrello dal localStorage all'inizializzazione del servizio
    // Se non ci sono dati nel localStorage, il carrello sarà vuoto
    this.loadCartFromStorage();
  }

  // Aggiunge un item al carrello
  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSignal();
    // Controlla se l'item esiste già nel carrello 
    // deve avere lo stesso id_prodotto e le stesse notes
    const existingItemIndex = currentItems.findIndex(
      cartItem => cartItem.id_prodotto === item.id_prodotto &&
        cartItem.notes === item.notes
    );

    if (existingItemIndex > -1) {
      // Se l'item esiste già, aumenta la quantità
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity
      };
      this.cartItemsSignal.set(updatedItems);
    } else {
      // Altrimenti aggiungi il nuovo item
      this.cartItemsSignal.set([...currentItems, { ...item }]);
    }

    // Aggiorna il localStorage
    this.saveCartToStorage();
  }

  // Rimuove un item dal carrello
  removeFromCart(id_prodotto: number, notes?: string): void {
    const currentItems = this.cartItemsSignal();
    // filtra gli item per rimuovere quello specificato
    // deve avere lo stesso id_prodotto e le stesse notes
    // se non ci sono notes, rimuove solo per id_prodotto
    const filteredItems = currentItems.filter(
      item => !(item.id_prodotto === id_prodotto && item.notes === notes)
    );
    this.cartItemsSignal.set(filteredItems);
    this.saveCartToStorage();
  }

  // Aggiorna la quantità di un item
  updateQuantity(id_prodotto: number, quantity: number, notes?: string): void {
    // Se la quantità è 0 o negativa, rimuove l'item dal carrello
    if (quantity <= 0) {
      this.removeFromCart(id_prodotto, notes);
      return;
    }

    const currentItems = this.cartItemsSignal();
    // Stessa logica della rimozione, ma per aggiornare la quantità
    const itemIndex = currentItems.findIndex(
      item => item.id_prodotto === id_prodotto && item.notes === notes
    );

    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity
      };
      this.cartItemsSignal.set(updatedItems);
      this.saveCartToStorage();
    }
  }

  // Svuota il carrello
  clearCart(): void {
    this.cartItemsSignal.set([]);
    this.saveCartToStorage();
  }

  // Ottiene tutti gli item del carrello
  getCartItems(): CartItem[] {
    return [...this.cartItemsSignal()];
  }

  // Salva il carrello nel localStorage in un oggetto chiamato 'cart'
  // questo permette di mantenere il carrello anche dopo il refresh della pagina
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSignal()));
  }

  // Carica il carrello dal localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSignal.set(JSON.parse(savedCart));
    }
  }
}
